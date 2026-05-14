#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const args = parseArgs(process.argv.slice(2));
const auditType = args.type || 'all';
const gameFilter = args.game || 'all';

const dataRoots = [path.join(rootDir, 'lib', 'nuzlocke', 'data')].filter((dir) => fs.existsSync(dir));

const gamePathHints = {
  frlg: ['gen3/frlg'],
  'fire-red-leaf-green': ['gen3/frlg'],
  gsc: ['gen2/johto'],
  gen2: ['gen2/johto'],
  johto: ['gen2/johto'],
  hgss: ['gen4/hgss'],
  bdsp: ['gen8/bdsp'],
  bw: ['gen5', 'black-white', 'bw-'],
  b2w2: ['gen5', 'b2w2'],
  xy: ['gen6', 'xy-'],
  sv: ['scarlet-violet'],
};

const pokemonCache = loadPokemonCache();
const files = collectFiles(dataRoots)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json'))
  .filter((file) => !file.endsWith(path.join('pokemon-cache.json')))
  .filter((file) => matchesGameFilter(file, gameFilter))
  .filter((file) => matchesTypeFilter(file, auditType));

const reports = {
  todos: [],
  moveTodos: [],
  spriteMisses: [],
  rivalVariants: [],
  missingLocation: [],
  missingLevelCap: [],
  duplicateIds: [],
};

const idLocations = new Map();
const locationIdLocations = new Map();
const speciesLocations = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const relative = toRelative(file);

  if (auditType === 'all' || auditType === 'todos') {
    lines.forEach((line, index) => {
      if (/\bTODO\b|\bFIXME\b|placeholder|coming later|coming soon/i.test(line)) {
        reports.todos.push(issue(relative, index + 1, trimLine(line)));
      }
    });
  }

  if (auditType === 'all' || auditType === 'bosses' || auditType === 'todos') {
    lines.forEach((line, index) => {
      if (/moves:\s*TODO_MOVES|moves:\s*\[\s*\]/.test(line)) {
        reports.moveTodos.push(issue(relative, index + 1, trimLine(line)));
      }
    });
  }

  for (const match of matchAllWithLine(text, /(?:^|[\s,{])id:\s*['"`]([^'"`]+)['"`]/g)) {
    addLocation(idLocations, `${relative}::${match.value}`, issue(relative, match.line, match.value));
  }

  if (/routes|encounters/i.test(relative)) {
    for (const match of matchAllWithLine(text, /locationId:\s*['"`]([^'"`]+)['"`]/g)) {
      addLocation(locationIdLocations, `${relative}::${match.value}`, issue(relative, match.line, match.value));
    }
  }

  for (const match of findSpeciesReferences(text)) {
    addLocation(speciesLocations, match.value, issue(relative, match.line, match.value));
  }

  if (auditType === 'all' || auditType === 'bosses') {
    auditBossBlocks(text, relative, reports);
    auditRivalVariants(text, relative, reports);
  }
}

if ((auditType === 'all' || auditType === 'sprites') && pokemonCache.loaded) {
  for (const [species, locations] of speciesLocations) {
    if (!hasCachedPokemon(species, pokemonCache)) {
      reports.spriteMisses.push({ species, locations });
    }
  }
}

if (auditType === 'all' || auditType === 'bosses') {
  for (const [key, locations] of idLocations) {
    if (locations.length > 1) {
      reports.duplicateIds.push({ kind: 'id', value: key.split('::').slice(1).join('::'), locations });
    }
  }
  for (const [key, locations] of locationIdLocations) {
    if (locations.length > 1) {
      reports.duplicateIds.push({ kind: 'locationId', value: key.split('::').slice(1).join('::'), locations });
    }
  }
}

printReport({
  files,
  reports,
  auditType,
  gameFilter,
  cacheLoaded: pokemonCache.loaded,
  cacheGeneratedAt: pokemonCache.generatedAt,
});

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) continue;
    const [rawKey, inlineValue] = item.slice(2).split('=');
    parsed[rawKey] = inlineValue ?? argv[index + 1] ?? true;
    if (inlineValue === undefined && argv[index + 1] && !argv[index + 1].startsWith('--')) index += 1;
  }
  return parsed;
}

function collectFiles(roots) {
  const output = [];
  const ignored = new Set(['node_modules', '.next', '.git', '.claude']);

  for (const root of roots) walk(root);
  return output;

  function walk(current) {
    const name = path.basename(current);
    if (ignored.has(name)) return;
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(current)) walk(path.join(current, child));
      return;
    }
    output.push(current);
  }
}

function matchesGameFilter(file, game) {
  if (!game || game === 'all') return true;
  const normalizedGame = String(game).toLowerCase();
  const relative = toRelative(file).replaceAll('\\', '/').toLowerCase();
  const hints = gamePathHints[normalizedGame] || [normalizedGame];
  return hints.some((hint) => relative.includes(hint.toLowerCase()));
}

function matchesTypeFilter(file, type) {
  if (!type || type === 'all') return true;
  const name = path.basename(file).toLowerCase();
  const relative = toRelative(file).replaceAll('\\', '/').toLowerCase();
  if (type === 'bosses') return /boss|trainer|gym|elite|rival/.test(name);
  if (type === 'sprites') return relative.includes('/data/') || relative.includes('/nuzlocke/data');
  if (type === 'todos') return true;
  return true;
}

function loadPokemonCache() {
  const cachePath = path.join(rootDir, 'lib', 'nuzlocke', 'data', 'pokemon-cache.json');
  if (!fs.existsSync(cachePath)) {
    return { loaded: false, generatedAt: null, names: new Set() };
  }

  try {
    const raw = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    const entries = Array.isArray(raw) ? raw : Array.isArray(raw.pokemon) ? raw.pokemon : Array.isArray(raw.entries) ? raw.entries : Object.values(raw.entriesBySlug || raw.bySlug || {});
    const names = new Set();
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object') continue;
      for (const value of [entry.name, entry.species, entry.slug, entry.normalizedName]) {
        if (typeof value === 'string') names.add(normalizeSpecies(value));
      }
      if (Array.isArray(entry.aliases)) {
        for (const alias of entry.aliases) {
          if (typeof alias === 'string') names.add(normalizeSpecies(alias));
        }
      }
    }
    return { loaded: true, generatedAt: raw.generatedAt || raw.generated_at || null, names };
  } catch (error) {
    return { loaded: false, generatedAt: null, names: new Set(), error: error instanceof Error ? error.message : String(error) };
  }
}

function hasCachedPokemon(species, cache) {
  if (!cache.loaded) return false;
  return cache.names.has(normalizeSpecies(species));
}

function normalizeSpecies(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/♀/g, 'f')
    .replace(/♂/g, 'm')
    .replace(/['’.:\-\s_]/g, '')
    .toLowerCase();
}

function findSpeciesReferences(text) {
  const matches = [];
  for (const match of matchAllWithLine(text, /species:\s*['"`]([^'"`]+)['"`]/g)) matches.push(match);
  for (const match of matchAllWithLine(text, /\bmon\(\s*['"`]([^'"`]+)['"`]/g)) matches.push(match);
  for (const match of matchAllWithLine(text, /\bencounter\(\s*['"`]([^'"`]+)['"`]/g)) matches.push(match);
  for (const match of matchAllWithLine(text, /\bgift\(\s*['"`]([^'"`]+)['"`]/g)) matches.push(match);
  for (const match of matchAllWithLine(text, /\bstaticEncounter\(\s*['"`]([^'"`]+)['"`]/g)) matches.push(match);
  return matches;
}

function auditBossBlocks(text, relative, reports) {
  if (/levelcaps|routes|encounters|metadata|todo-registry/i.test(relative)) return;
  for (const block of getLooseBlocks(text)) {
    if (!/category:\s*['"`]/.test(block.text) && !/Boss|boss|rival|gym|elite|champion/i.test(relative)) continue;
    const id = getFirst(block.text, /id:\s*['"`]([^'"`]+)['"`]/);
    if (!id) continue;
    const line = lineFromIndex(text, block.start);
    if (!/(locationId|location|city):\s*['"`]/.test(block.text)) {
      reports.missingLocation.push(issue(relative, line, id));
    }
    if (!/levelCap:\s*[^,\n}]+/.test(block.text)) {
      reports.missingLevelCap.push(issue(relative, line, id));
    }
  }
}

function auditRivalVariants(text, relative, reports) {
  const variantMatches = [...text.matchAll(/variantsByRivalStarterChoice\s*:/g)];
  for (const match of variantMatches) {
    const start = match.index || 0;
    const before = text.slice(Math.max(0, start - 1200), start);
    const after = text.slice(start, start + 2200);
    if (/variantsByRivalStarterChoice\s*:\s*[a-zA-Z_$][\w$]*\(/.test(after)) continue;
    const id = [...before.matchAll(/id:\s*['"`]([^'"`]+)['"`]/g)].at(-1)?.[1] || '(unknown rival)';
    if (id === '(unknown rival)') continue;
    const line = lineFromIndex(text, start);
    const missing = ['grass', 'fire', 'water'].filter((starter) => !new RegExp(`${starter}:\\s*\\[`).test(after));
    const empty = ['grass', 'fire', 'water'].filter((starter) => new RegExp(`${starter}:\\s*\\[\\s*\\]`).test(after));
    if (missing.length || empty.length) {
      reports.rivalVariants.push({
        ...issue(relative, line, id),
        detail: [
          missing.length ? `missing: ${missing.join(', ')}` : '',
          empty.length ? `empty: ${empty.join(', ')}` : '',
        ].filter(Boolean).join('; '),
      });
    }
  }
}

function getLooseBlocks(text) {
  const blocks = [];
  const starts = [...text.matchAll(/\bboss\(\{|{\s*(?:id|name):\s*['"`]/g)];
  for (const startMatch of starts) {
    const start = startMatch.index || 0;
    const end = findBlockEnd(text, start);
    blocks.push({ start, text: text.slice(start, end) });
  }
  return blocks;
}

function findBlockEnd(text, start) {
  let depth = 0;
  let opened = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (char === '{') {
      depth += 1;
      opened = true;
    } else if (char === '}') {
      depth -= 1;
      if (opened && depth <= 0) return index + 1;
    }
  }
  return Math.min(text.length, start + 1200);
}

function getFirst(text, regex) {
  return regex.exec(text)?.[1] || null;
}

function matchAllWithLine(text, regex) {
  return [...text.matchAll(regex)].map((match) => ({
    value: match[1],
    line: lineFromIndex(text, match.index || 0),
  }));
}

function lineFromIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function issue(file, line, text) {
  return { file, line, text };
}

function addLocation(map, key, location) {
  if (!key) return;
  const existing = map.get(key) || [];
  existing.push(location);
  map.set(key, existing);
}

function trimLine(line) {
  return line.trim().replace(/\s+/g, ' ').slice(0, 180);
}

function toRelative(file) {
  return path.relative(rootDir, file);
}

function printReport({ files, reports, auditType, gameFilter, cacheLoaded, cacheGeneratedAt }) {
  const totalIssues = Object.values(reports).reduce((sum, entries) => sum + entries.length, 0);
  console.log(`Nuzlocke data audit (${gameFilter}, ${auditType})`);
  console.log(`Files scanned: ${files.length}`);
  console.log(`Pokemon cache: ${cacheLoaded ? `loaded${cacheGeneratedAt ? ` (${cacheGeneratedAt})` : ''}` : 'not found'}`);
  console.log(`Issues found: ${totalIssues}`);
  console.log('');

  printSimple('TODO / placeholder notes', reports.todos);
  printSimple('Empty or TODO move arrays', reports.moveTodos);
  printSpriteMisses(reports.spriteMisses);
  printSimple('Unresolved rival starter variants', reports.rivalVariants, (item) => `${formatLocation(item)} ${item.text}${item.detail ? ` (${item.detail})` : ''}`);
  printSimple('Missing location/locationId', reports.missingLocation);
  printSimple('Missing levelCap', reports.missingLevelCap);
  printDuplicates(reports.duplicateIds);
}

function printSimple(title, entries, formatter = formatIssue) {
  console.log(`${title}: ${entries.length}`);
  for (const entry of entries.slice(0, 40)) console.log(`  - ${formatter(entry)}`);
  if (entries.length > 40) console.log(`  ... ${entries.length - 40} more`);
  console.log('');
}

function printSpriteMisses(entries) {
  if (!pokemonCache.loaded) {
    console.log('Missing sprites/cache misses: skipped (pokemon-cache.json not found)');
    console.log('');
    return;
  }
  console.log(`Missing sprites/cache misses: ${entries.length}`);
  for (const entry of entries.slice(0, 40)) {
    const first = entry.locations[0];
    console.log(`  - ${entry.species} (${formatLocation(first)})`);
  }
  if (entries.length > 40) console.log(`  ... ${entries.length - 40} more`);
  console.log('');
}

function printDuplicates(entries) {
  console.log(`Duplicate IDs: ${entries.length}`);
  for (const entry of entries.slice(0, 40)) {
    console.log(`  - ${entry.kind} "${entry.value}"`);
    for (const location of entry.locations.slice(0, 4)) console.log(`    ${formatLocation(location)}`);
    if (entry.locations.length > 4) console.log(`    ... ${entry.locations.length - 4} more`);
  }
  if (entries.length > 40) console.log(`  ... ${entries.length - 40} more`);
  console.log('');
}

function formatIssue(entry) {
  return `${formatLocation(entry)} ${entry.text}`;
}

function formatLocation(entry) {
  return `${entry.file}:${entry.line}`;
}
