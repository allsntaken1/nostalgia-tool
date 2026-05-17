import type { GameVersion } from '@/app/nuzlocke/types';

/**
 * Curated "encounter value" registry — a hint layer ON TOP of the canonical encounter tables.
 *
 * The registry surfaces commonly-strong Nuzlocke picks per species. It is intentionally NOT
 * exhaustive; missing entries score 0 from this file and rely entirely on the regular type-
 * matchup / team-gap heuristics. There is no "best" claim — wording in the UI uses cautious
 * language like "high-value encounter" / "often useful".
 *
 * Generation gating: each profile carries `minGeneration` (1-9). A Pokémon introduced in
 * Gen 2 (e.g. Crobat) returns no profile for a Gen 1 run. Tags can further refine when a
 * profile is meaningful (e.g. Fairy-tagged hints only apply when generation >= 6).
 */

export type EncounterValueTier = 'elite' | 'high' | 'solid' | 'niche';

export type EncounterValueTag =
  | 'Bulky Water'
  | 'Intimidate'
  | 'Fast Electric'
  | 'Ground Immunity'
  | 'Early Game Carry'
  | 'Status Support'
  | 'Dragon Dance Potential'
  | 'Reliable Pivot'
  | 'Great Defensive Typing'
  | 'Strong Stats'
  | 'Setup Potential'
  | 'Common Nuzlocke MVP'
  | 'Useful Before Water Gym'
  | 'Useful Before Electric Gym'
  | 'Useful Before Rock Gym'
  | 'Useful Before Elite Four'
  | 'Falls Off Later'
  | 'Needs Evolution'
  | 'Stone Evolution'
  | 'Friendship Evolution'
  | 'Trade Evolution'
  | 'Version Limited'
  | 'Rare Encounter';

export type EncounterValueProfile = {
  species: string;
  valueTier: EncounterValueTier;
  /** First generation the species exists. Scoring returns no profile below this. */
  minGeneration: number;
  tags: EncounterValueTag[];
  reasons: string[];
  cautionNotes?: string[];
  /** Per-generation specific guidance (e.g. Crobat-only-from-Gen-2-on). */
  generationNotes?: Partial<Record<number, string>>;
};

/** Canonical species name → profile. Lookups are case-insensitive via `getEncounterValueProfile`. */
const REGISTRY: EncounterValueProfile[] = [
  // ---- Elite, evergreen Nuzlocke picks ----
  { species: 'Magikarp', valueTier: 'elite', minGeneration: 1,
    tags: ['Common Nuzlocke MVP', 'Bulky Water', 'Needs Evolution', 'Setup Potential'],
    reasons: ['Evolves into Gyarados at Lv 20 — long-term physical sweeper with Intimidate from Gen 3 on.'],
    cautionNotes: ['Splash-only until Lv 15; needs babysitting through the early game.'] },
  { species: 'Gyarados', valueTier: 'elite', minGeneration: 1,
    tags: ['Bulky Water', 'Intimidate', 'Dragon Dance Potential', 'Strong Stats', 'Common Nuzlocke MVP'],
    reasons: ['High Atk + Intimidate (Gen 3+); Dragon Dance access from Gen 3.'],
    generationNotes: { 1: 'No Intimidate in Gen 1; still hits hard but loses defensive utility.' } },
  { species: 'Geodude', valueTier: 'high', minGeneration: 1,
    tags: ['Great Defensive Typing', 'Useful Before Electric Gym', 'Useful Before Rock Gym', 'Needs Evolution'],
    reasons: ['Rock/Ground typing gives Electric immunity and broad early-game coverage.'],
    cautionNotes: ['4× Water and Grass weakness — careful around Water gyms.'] },
  { species: 'Graveler', valueTier: 'high', minGeneration: 1, tags: ['Great Defensive Typing', 'Useful Before Electric Gym', 'Trade Evolution'],
    reasons: ['Same Geodude profile with stronger stats; final form Golem typically requires a trade.'] },
  { species: 'Golem', valueTier: 'high', minGeneration: 1, tags: ['Great Defensive Typing', 'Strong Stats'], reasons: ['Bulky physical attacker with Earthquake/Stone Edge coverage.'] },
  { species: 'Zubat', valueTier: 'high', minGeneration: 1, tags: ['Reliable Pivot', 'Needs Evolution', 'Falls Off Later'],
    reasons: ['Crobat (Gen 2+) is a tier-defining utility Pokémon — Brave Bird / Cross Poison / U-turn.'],
    cautionNotes: ['Drowsy stats until evolved.'], generationNotes: { 1: 'Golbat is the final form in Gen 1; no Crobat — value drops to "solid".' } },
  { species: 'Crobat', valueTier: 'elite', minGeneration: 2, tags: ['Reliable Pivot', 'Fast Electric', 'Common Nuzlocke MVP'], reasons: ['Friendship evolution; one of the fastest fully-evolved options with strong coverage.'] },
  { species: 'Abra', valueTier: 'high', minGeneration: 1, tags: ['Strong Stats', 'Needs Evolution'],
    reasons: ['Kadabra/Alakazam line — exceptional Special Attack, learns Psychic + coverage early.'],
    cautionNotes: ['Teleport-only until Lv 16; can run from wild encounters.'] },
  { species: 'Kadabra', valueTier: 'high', minGeneration: 1, tags: ['Strong Stats', 'Trade Evolution'], reasons: ['Alakazam tier without the trade requirement; still a hard-hitting sweeper.'] },
  { species: 'Alakazam', valueTier: 'elite', minGeneration: 1, tags: ['Strong Stats', 'Common Nuzlocke MVP'], reasons: ['One of the highest Special Attack stats in the game with great speed.'] },
  { species: 'Gastly', valueTier: 'high', minGeneration: 1, tags: ['Ground Immunity', 'Setup Potential', 'Trade Evolution'],
    reasons: ['Ghost/Poison locks out Normal + Fighting moves; Gengar is a top-tier sweeper.'],
    cautionNotes: ['Very frail; one bad crit and it dies.'] },
  { species: 'Haunter', valueTier: 'high', minGeneration: 1, tags: ['Setup Potential', 'Trade Evolution'], reasons: ['Strong special attacker with Levitate (Gen 4+) or just immune to Normal/Fighting in Gen 1-3.'] },
  { species: 'Gengar', valueTier: 'elite', minGeneration: 1, tags: ['Strong Stats', 'Common Nuzlocke MVP', 'Setup Potential'], reasons: ['Top-tier offensive Ghost; Levitate (Gen 4+) adds Ground immunity.'] },
  { species: 'Staryu', valueTier: 'high', minGeneration: 1, tags: ['Bulky Water', 'Status Support', 'Stone Evolution'],
    reasons: ['Special attacker with Recover, BoltBeam coverage and reliable longevity. Star/Strawmie a Water Stone target.'] },
  { species: 'Starmie', valueTier: 'elite', minGeneration: 1, tags: ['Bulky Water', 'Common Nuzlocke MVP', 'Status Support'], reasons: ['Fast special attacker with Recover + coverage; great offensive Water pick.'] },
  { species: 'Tentacool', valueTier: 'solid', minGeneration: 1, tags: ['Bulky Water', 'Status Support'], reasons: ['Strong special bulk and Toxic Spikes (Gen 4+). Common surf-only encounter.'] },
  { species: 'Tentacruel', valueTier: 'high', minGeneration: 1, tags: ['Bulky Water', 'Status Support', 'Strong Stats'], reasons: ['Special bulk + Liquid Ooze (Gen 3+). Counters bulky physical Waters.'] },
  { species: 'Machop', valueTier: 'high', minGeneration: 1, tags: ['Strong Stats', 'Trade Evolution', 'Useful Before Rock Gym'], reasons: ['Machamp Guts/No Guard Cross Chop/Dynamic Punch — one of the strongest physical attackers.'] },
  { species: 'Machoke', valueTier: 'high', minGeneration: 1, tags: ['Strong Stats', 'Trade Evolution'], reasons: ['Same line; trade is required for Machamp.'] },
  { species: 'Machamp', valueTier: 'elite', minGeneration: 1, tags: ['Strong Stats', 'Common Nuzlocke MVP'], reasons: ['No Guard + Dynamic Punch is one of the strongest move-ability combos in the game.'] },
  { species: 'Magnemite', valueTier: 'high', minGeneration: 1, tags: ['Reliable Pivot', 'Status Support', 'Useful Before Water Gym'],
    reasons: ['Steel/Electric (Gen 2+) gives many resistances. Magnezone in Gen 4+ adds bulk and power.'],
    generationNotes: { 1: 'Pure Electric in Gen 1.' } },
  { species: 'Magneton', valueTier: 'high', minGeneration: 1, tags: ['Reliable Pivot', 'Useful Before Water Gym'], reasons: ['Pre-Magnezone form; still solid with Thunderbolt / Flash Cannon.'] },
  { species: 'Magnezone', valueTier: 'elite', minGeneration: 4, tags: ['Reliable Pivot', 'Common Nuzlocke MVP', 'Strong Stats'], reasons: ['Bulky special attacker, only weak to Ground and Fire/Fighting.'] },
  { species: 'Onix', valueTier: 'solid', minGeneration: 1, tags: ['Great Defensive Typing'],
    reasons: ['Sturdy + bulky physical defense; Steelix (Gen 2+ trade) is a long-term wall.'],
    cautionNotes: ['Pure physical bulk; bad SpD until Steelix.'] },
  { species: 'Steelix', valueTier: 'high', minGeneration: 2, tags: ['Great Defensive Typing', 'Strong Stats', 'Trade Evolution'], reasons: ['Steel/Ground typing; massive physical Defense.'] },
  { species: 'Dratini', valueTier: 'high', minGeneration: 1, tags: ['Common Nuzlocke MVP', 'Dragon Dance Potential', 'Needs Evolution', 'Strong Stats'], reasons: ['Dragonite is a top-tier physical attacker with Multiscale (Gen 5+).'] },
  { species: 'Dragonair', valueTier: 'high', minGeneration: 1, tags: ['Needs Evolution', 'Setup Potential'], reasons: ['Strong dragon intermediate; setup with Dragon Dance.'] },
  { species: 'Dragonite', valueTier: 'elite', minGeneration: 1, tags: ['Common Nuzlocke MVP', 'Strong Stats', 'Dragon Dance Potential'], reasons: ['Multiscale (Gen 5+) + Dragon Dance + Outrage is one of the strongest sweeping packages.'] },
  { species: 'Lapras', valueTier: 'elite', minGeneration: 1, tags: ['Bulky Water', 'Common Nuzlocke MVP', 'Status Support'], reasons: ['Water/Ice with massive HP; learns Surf, Ice Beam, Thunderbolt naturally.'] },
  { species: 'Eevee', valueTier: 'high', minGeneration: 1, tags: ['Setup Potential', 'Friendship Evolution', 'Stone Evolution'], reasons: ['Multiple evolution paths; Vaporeon/Jolteon/Espeon are all strong picks.'] },
  { species: 'Vaporeon', valueTier: 'high', minGeneration: 1, tags: ['Bulky Water', 'Stone Evolution', 'Strong Stats'], reasons: ['Huge HP + Water Absorb; great defensive pivot.'] },
  { species: 'Jolteon', valueTier: 'high', minGeneration: 1, tags: ['Fast Electric', 'Stone Evolution'], reasons: ['Very fast special Electric — pairs with Volt Absorb (Gen 3+).'] },
  { species: 'Heracross', valueTier: 'high', minGeneration: 2, tags: ['Strong Stats', 'Rare Encounter', 'Useful Before Elite Four'], reasons: ['Guts + Megahorn + Close Combat — long-term physical sweeper. Often Headbutt-only in HGSS.'] },
  { species: 'Mareep', valueTier: 'high', minGeneration: 2, tags: ['Fast Electric', 'Useful Before Water Gym'], reasons: ['Ampharos is a strong special Electric with reliable coverage.'] },
  { species: 'Ampharos', valueTier: 'high', minGeneration: 2, tags: ['Reliable Pivot', 'Strong Stats'], reasons: ['Bulky special Electric pivot.'] },
  { species: 'Wooper', valueTier: 'high', minGeneration: 2, tags: ['Ground Immunity', 'Useful Before Electric Gym', 'Common Nuzlocke MVP'], reasons: ['Quagsire — Water/Ground locks out Electric and resists Fire/Water/Steel.'] },
  { species: 'Quagsire', valueTier: 'high', minGeneration: 2, tags: ['Ground Immunity', 'Useful Before Electric Gym', 'Reliable Pivot'], reasons: ['Unaware (Gen 5+) ignores opponent setup; Earthquake/Surf coverage.'] },

  // ---- Generation-3 to Gen-9 standouts ----
  { species: 'Ralts', valueTier: 'high', minGeneration: 3, tags: ['Setup Potential', 'Strong Stats'], reasons: ['Gardevoir / Gallade are strong endgame attackers.'] },
  { species: 'Gardevoir', valueTier: 'high', minGeneration: 3, tags: ['Strong Stats'], reasons: ['Trace + special Psychic/Fairy from Gen 6+.'] },
  { species: 'Shroomish', valueTier: 'high', minGeneration: 3, tags: ['Common Nuzlocke MVP', 'Strong Stats', 'Status Support'], reasons: ['Breloom Technician + Mach Punch + Spore is a tournament-grade Nuzlocke pick.'] },
  { species: 'Breloom', valueTier: 'elite', minGeneration: 3, tags: ['Common Nuzlocke MVP', 'Strong Stats', 'Status Support'], reasons: ['Spore (sleep) + Technician + Mach Punch / Bullet Seed.'] },
  { species: 'Aron', valueTier: 'high', minGeneration: 3, tags: ['Great Defensive Typing', 'Needs Evolution'], reasons: ['Aggron line is a Steel/Rock tank with massive Defense.'] },
  { species: 'Aggron', valueTier: 'high', minGeneration: 3, tags: ['Great Defensive Typing', 'Strong Stats'], reasons: ['Rock Head + Head Smash; physical defense wall.'] },
  { species: 'Mudkip', valueTier: 'high', minGeneration: 3, tags: ['Common Nuzlocke MVP', 'Bulky Water', 'Ground Immunity'], reasons: ['Swampert — Water/Ground with EQ + Ice Beam coverage; only weak to Grass.'] },
  { species: 'Swampert', valueTier: 'elite', minGeneration: 3, tags: ['Common Nuzlocke MVP', 'Bulky Water', 'Ground Immunity', 'Strong Stats'], reasons: ['Bulky offensive Water/Ground; only one weakness.'] },
  { species: 'Trapinch', valueTier: 'high', minGeneration: 3, tags: ['Ground Immunity', 'Strong Stats'], reasons: ['Flygon is a fast Dragon/Ground with EQ/Outrage coverage.'] },
  { species: 'Flygon', valueTier: 'high', minGeneration: 3, tags: ['Ground Immunity', 'Strong Stats'], reasons: ['Levitate Ground type; only weak to Ice/Dragon/Fairy.'] },
  { species: 'Gible', valueTier: 'elite', minGeneration: 4, tags: ['Common Nuzlocke MVP', 'Strong Stats', 'Rare Encounter'], reasons: ['Garchomp — top-tier physical Dragon/Ground sweeper.'] },
  { species: 'Garchomp', valueTier: 'elite', minGeneration: 4, tags: ['Common Nuzlocke MVP', 'Strong Stats', 'Useful Before Elite Four'], reasons: ['Outrage + EQ + Fire Fang coverage; consistently one of the strongest available species.'] },
  { species: 'Staravia', valueTier: 'high', minGeneration: 4, tags: ['Strong Stats', 'Reliable Pivot'], reasons: ['Staraptor — Intimidate + Brave Bird + Close Combat.'] },
  { species: 'Staraptor', valueTier: 'high', minGeneration: 4, tags: ['Strong Stats', 'Intimidate', 'Common Nuzlocke MVP'], reasons: ['Strongest Flying physical attacker in early DPP.'] },
  { species: 'Shinx', valueTier: 'high', minGeneration: 4, tags: ['Fast Electric', 'Useful Before Water Gym'], reasons: ['Luxray — Intimidate + strong physical Electric; counters Sinnoh water gyms.'] },
  { species: 'Luxray', valueTier: 'high', minGeneration: 4, tags: ['Fast Electric', 'Intimidate', 'Strong Stats'], reasons: ['Physical Electric with coverage moves.'] },
  { species: 'Shellos', valueTier: 'solid', minGeneration: 4, tags: ['Bulky Water', 'Status Support', 'Ground Immunity'], reasons: ['Gastrodon — Storm Drain absorbs Water moves; only weak to Grass.'] },
  { species: 'Gastrodon', valueTier: 'high', minGeneration: 4, tags: ['Bulky Water', 'Ground Immunity', 'Reliable Pivot'], reasons: ['Storm Drain + Recover (in some gens) make it a defensive pivot.'] },
  { species: 'Riolu', valueTier: 'high', minGeneration: 4, tags: ['Strong Stats', 'Friendship Evolution'], reasons: ['Lucario is a versatile mixed attacker with Steel/Fighting STAB.'] },
  { species: 'Lucario', valueTier: 'high', minGeneration: 4, tags: ['Strong Stats', 'Common Nuzlocke MVP'], reasons: ['Close Combat + Aura Sphere + Steel STAB.'] },
  { species: 'Drilbur', valueTier: 'high', minGeneration: 5, tags: ['Strong Stats', 'Ground Immunity', 'Useful Before Electric Gym'], reasons: ['Excadrill — Sand Rush in sand + EQ + Iron Head.'] },
  { species: 'Excadrill', valueTier: 'elite', minGeneration: 5, tags: ['Common Nuzlocke MVP', 'Strong Stats'], reasons: ['One of the strongest sweepers in BW/B2W2.'] },
  { species: 'Sandile', valueTier: 'high', minGeneration: 5, tags: ['Intimidate', 'Strong Stats'], reasons: ['Krookodile — Moxie/Intimidate + EQ + Crunch.'] },
  { species: 'Krookodile', valueTier: 'high', minGeneration: 5, tags: ['Intimidate', 'Strong Stats', 'Common Nuzlocke MVP'], reasons: ['Bulky Dark/Ground physical sweeper.'] },
  { species: 'Darumaka', valueTier: 'high', minGeneration: 5, tags: ['Strong Stats'], reasons: ['Darmanitan — massive Atk and Sheer Force / Zen Mode.'] },
  { species: 'Darmanitan', valueTier: 'high', minGeneration: 5, tags: ['Strong Stats', 'Common Nuzlocke MVP'], reasons: ['Sheer Force + Flare Blitz/Earthquake; top-tier offense.'] },
  { species: 'Axew', valueTier: 'high', minGeneration: 5, tags: ['Strong Stats', 'Dragon Dance Potential'], reasons: ['Haxorus — Mold Breaker + Outrage + Earthquake.'] },
  { species: 'Haxorus', valueTier: 'high', minGeneration: 5, tags: ['Strong Stats'], reasons: ['One of the highest Atk stats among non-uber Dragons.'] },
  { species: 'Litwick', valueTier: 'high', minGeneration: 5, tags: ['Setup Potential', 'Strong Stats'], reasons: ['Chandelure — extreme Special Attack with Shadow Ball / Energy Ball / Flamethrower.'] },
  { species: 'Chandelure', valueTier: 'high', minGeneration: 5, tags: ['Strong Stats', 'Common Nuzlocke MVP'], reasons: ['Top-tier special Ghost/Fire attacker.'] },
  { species: 'Honedge', valueTier: 'high', minGeneration: 6, tags: ['Great Defensive Typing', 'Setup Potential', 'Strong Stats'], reasons: ['Aegislash — Stance Change makes it both wall and attacker.'] },
  { species: 'Aegislash', valueTier: 'elite', minGeneration: 6, tags: ['Strong Stats', 'Common Nuzlocke MVP', 'Setup Potential'], reasons: ['King\'s Shield + Stance Change is one of the most disruptive kits.'] },
  { species: 'Fletchling', valueTier: 'high', minGeneration: 6, tags: ['Strong Stats', 'Fast Electric'], reasons: ['Talonflame — Gale Wings priority Brave Bird (Gen 6).'] },
  { species: 'Talonflame', valueTier: 'high', minGeneration: 6, tags: ['Strong Stats'], reasons: ['Priority Brave Bird + Flare Blitz; very fast offensive Flying.'] },
  { species: 'Hawlucha', valueTier: 'high', minGeneration: 6, tags: ['Strong Stats', 'Setup Potential'], reasons: ['Unburden + Acrobatics + Swords Dance; fast offensive Fighting/Flying.'] },
  { species: 'Mareanie', valueTier: 'solid', minGeneration: 7, tags: ['Status Support', 'Great Defensive Typing'], reasons: ['Toxapex — Merciless + Regenerator + Toxic Spikes; one of the bulkiest walls in the franchise.'] },
  { species: 'Toxapex', valueTier: 'high', minGeneration: 7, tags: ['Status Support', 'Great Defensive Typing', 'Reliable Pivot'], reasons: ['Regenerator + Recover + Scald; nearly unkillable on a properly built team.'] },
  { species: 'Mimikyu', valueTier: 'high', minGeneration: 7, tags: ['Setup Potential', 'Common Nuzlocke MVP'], reasons: ['Disguise gives a free turn; Shadow Sneak + Play Rough sweep potential.'] },
  { species: 'Rookidee', valueTier: 'high', minGeneration: 8, tags: ['Strong Stats', 'Reliable Pivot'], reasons: ['Corviknight — Pressure / Mirror Armor + Iron Defense + Body Press.'] },
  { species: 'Corviknight', valueTier: 'high', minGeneration: 8, tags: ['Great Defensive Typing', 'Reliable Pivot', 'Common Nuzlocke MVP'], reasons: ['Steel/Flying with very few weaknesses.'] },
  { species: 'Dreepy', valueTier: 'high', minGeneration: 8, tags: ['Strong Stats', 'Rare Encounter'], reasons: ['Dragapult — extreme speed, mixed-attacker Dragon/Ghost.'] },
  { species: 'Dragapult', valueTier: 'elite', minGeneration: 8, tags: ['Strong Stats', 'Common Nuzlocke MVP'], reasons: ['Top-tier offensive Dragon/Ghost with multiple ability options.'] },
  { species: 'Flamigo', valueTier: 'high', minGeneration: 9, tags: ['Strong Stats'], reasons: ['Scrappy + Close Combat + Brave Bird with Costar; strong physical Flying/Fighting.'] },
  { species: 'Pawmi', valueTier: 'high', minGeneration: 9, tags: ['Fast Electric', 'Useful Before Water Gym'], reasons: ['Pawmot — Volt Absorb + dual Fighting/Electric coverage with priority.'] },
  { species: 'Nacli', valueTier: 'solid', minGeneration: 9, tags: ['Great Defensive Typing', 'Reliable Pivot'], reasons: ['Garganacl — Purifying Salt + Salt Cure + huge bulk.'] },
  { species: 'Tinkatink', valueTier: 'high', minGeneration: 9, tags: ['Great Defensive Typing', 'Common Nuzlocke MVP'], reasons: ['Tinkaton — Fairy/Steel with strong coverage and Gigaton Hammer.'] },
  { species: 'Frigibax', valueTier: 'high', minGeneration: 9, tags: ['Strong Stats'], reasons: ['Baxcalibur — Thermal Exchange + Glaive Rush / Ice Shard.'] },
  { species: 'Lotad', valueTier: 'solid', minGeneration: 3, tags: ['Bulky Water', 'Setup Potential'],
    reasons: ['Ludicolo — Swift Swim + Rain Dish; rain abuser if rain available.'] },
  { species: 'Seedot', valueTier: 'solid', minGeneration: 3, tags: ['Setup Potential', 'Stone Evolution'], reasons: ['Shiftry — Chlorophyll + Sucker Punch; solid sun abuser.'] },
  { species: 'Wingull', valueTier: 'solid', minGeneration: 3, tags: ['Bulky Water', 'Reliable Pivot'], reasons: ['Pelipper — Drizzle (Gen 7+) provides team-wide rain.'] },
  { species: 'Pelipper', valueTier: 'high', minGeneration: 3, tags: ['Status Support', 'Reliable Pivot'], reasons: ['Drizzle (Gen 7+) enables Swift Swim teammates.'] },
];

const REGISTRY_BY_KEY = new Map<string, EncounterValueProfile>();
for (const entry of REGISTRY) {
  REGISTRY_BY_KEY.set(entry.species.toLowerCase(), entry);
}

/** Game version → introduction-generation map. Used to gate which profiles apply. */
const GENERATION_BY_GAME: Partial<Record<GameVersion, number>> = {
  Red: 1, Blue: 1, Yellow: 1,
  Gold: 2, Silver: 2, Crystal: 2,
  Ruby: 3, Sapphire: 3, Emerald: 3, FireRed: 3, LeafGreen: 3,
  Diamond: 4, Pearl: 4, Platinum: 4, HeartGold: 4, SoulSilver: 4,
  Black: 5, White: 5, 'Black 2': 5, 'White 2': 5,
  X: 6, Y: 6, 'Omega Ruby': 6, 'Alpha Sapphire': 6,
  Sun: 7, Moon: 7, 'Ultra Sun': 7, 'Ultra Moon': 7,
  Sword: 8, Shield: 8, 'Brilliant Diamond': 8, 'Shining Pearl': 8, 'Legends: Arceus': 8,
  Scarlet: 9, Violet: 9,
};

export function getRunGeneration(gameVersion: GameVersion): number {
  return GENERATION_BY_GAME[gameVersion] ?? 9;
}

/**
 * Returns the curated profile for a species iff that species exists in the run's generation.
 * Undefined for species not in the registry OR introduced after the run's generation. This is
 * the only safe interface — direct array access skips generation gating.
 */
export function getEncounterValueProfile(species: string, gameVersion: GameVersion): EncounterValueProfile | undefined {
  if (!species) return undefined;
  const profile = REGISTRY_BY_KEY.get(species.toLowerCase());
  if (!profile) return undefined;
  const runGen = getRunGeneration(gameVersion);
  if (runGen < profile.minGeneration) return undefined;
  return profile;
}

/** Maps an EncounterValueTier to its scoring contribution. Caller can layer additional context. */
export function getValueTierScore(tier: EncounterValueTier): number {
  switch (tier) {
    case 'elite': return 4;
    case 'high': return 3;
    case 'solid': return 2;
    case 'niche': return 1;
  }
}

export const REGISTRY_DISCLAIMER = 'Recommendations use your current run data plus a curated Nuzlocke value list. They are guidance, not guarantees.';
