import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import path from 'path';

export type ArchiveItem = {
  id: string;
  title: string;
  imageUrl: string;
  thumbUrl: string;
  source: string;
  sourceUrl?: string;
  originalQuery: string;
  decade: string;
  category: string;
  subTags: string[];
  extraTags: string[];
  savedAt: string;
};

export type SubmissionItem = Omit<ArchiveItem, 'savedAt'> & {
  submittedAt: string;
  status: 'pending';
};

type SupabaseArchiveRow = {
  id: string;
  title: string;
  image_url: string;
  thumb_url: string;
  source: string;
  source_url?: string;
  original_query: string;
  decade: string;
  category: string;
  sub_tags: string[];
  extra_tags: string[];
  saved_at: string;
};

type SupabaseSubmissionRow = Omit<SupabaseArchiveRow, 'saved_at'> & {
  submitted_at: string;
  status: 'pending';
};

const archivePath = path.join(process.cwd(), 'data', 'archive.json');
const submissionsPath = path.join(process.cwd(), 'data', 'submissions.json');
const pendingUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'pending');

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export function normalizeTagInput(value: FormDataEntryValue | null) {
  return typeof value === 'string'
    ? value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
}

export function normalizeArchiveItem(raw: unknown): ArchiveItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    id: typeof item.id === 'string' && item.id.trim() ? item.id : crypto.randomUUID(),
    title: typeof item.title === 'string' && item.title ? item.title : 'Untitled image',
    imageUrl:
      typeof item.imageUrl === 'string'
        ? item.imageUrl
        : typeof item.image_url === 'string'
          ? item.image_url
          : '',
    thumbUrl:
      typeof item.thumbUrl === 'string'
        ? item.thumbUrl
        : typeof item.thumb_url === 'string'
          ? item.thumb_url
          : typeof item.imageUrl === 'string'
            ? item.imageUrl
            : typeof item.image_url === 'string'
              ? item.image_url
              : '',
    source: typeof item.source === 'string' ? item.source : 'Unknown source',
    sourceUrl:
      typeof item.sourceUrl === 'string'
        ? item.sourceUrl
        : typeof item.source_url === 'string'
          ? item.source_url
          : '',
    originalQuery:
      typeof item.originalQuery === 'string'
        ? item.originalQuery
        : typeof item.original_query === 'string'
          ? item.original_query
          : '',
    decade: typeof item.decade === 'string' ? item.decade : 'Not Sure',
    category:
      typeof item.category === 'string'
        ? item.category
        : typeof item.channel === 'string'
          ? item.channel
          : 'Unsorted',
    subTags: toStringArray(item.subTags ?? item.sub_tags),
    extraTags: toStringArray(item.extraTags ?? item.extra_tags),
    savedAt:
      typeof item.savedAt === 'string'
        ? item.savedAt
        : typeof item.saved_at === 'string'
          ? item.saved_at
          : new Date().toLocaleString(),
  };
}

export function normalizeSubmissionItem(raw: unknown): SubmissionItem {
  const item = normalizeArchiveItem(raw);
  const rawItem = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    ...item,
    submittedAt:
      typeof rawItem.submittedAt === 'string'
        ? rawItem.submittedAt
        : typeof rawItem.submitted_at === 'string'
          ? rawItem.submitted_at
          : item.savedAt,
    status: 'pending',
  };
}

function archiveToRow(item: ArchiveItem): SupabaseArchiveRow {
  return {
    id: item.id,
    title: item.title,
    image_url: item.imageUrl,
    thumb_url: item.thumbUrl,
    source: item.source,
    source_url: item.sourceUrl ?? '',
    original_query: item.originalQuery,
    decade: item.decade,
    category: item.category,
    sub_tags: item.subTags,
    extra_tags: item.extraTags,
    saved_at: item.savedAt,
  };
}

function submissionToRow(item: SubmissionItem): SupabaseSubmissionRow {
  const row = archiveToRow({
    ...item,
    savedAt: item.submittedAt,
  });

  return {
    id: row.id,
    title: row.title,
    image_url: row.image_url,
    thumb_url: row.thumb_url,
    source: row.source,
    source_url: row.source_url,
    original_query: row.original_query,
    decade: row.decade,
    category: row.category,
    sub_tags: row.sub_tags,
    extra_tags: row.extra_tags,
    submitted_at: item.submittedAt,
    status: 'pending',
  };
}

function normalizeComparableUrl(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

function getArchiveKeys(item: Pick<ArchiveItem, 'imageUrl' | 'thumbUrl' | 'sourceUrl'>) {
  const imageKeys = [normalizeComparableUrl(item.imageUrl), normalizeComparableUrl(item.thumbUrl)].filter(Boolean);

  return imageKeys.length > 0 ? imageKeys : [normalizeComparableUrl(item.sourceUrl)].filter(Boolean);
}

export function findDuplicateArchiveItem(item: ArchiveItem, items: ArchiveItem[]) {
  const incomingKeys = new Set(getArchiveKeys(item));

  if (incomingKeys.size === 0) return undefined;

  return items.find((archiveItem) => getArchiveKeys(archiveItem).some((key) => incomingKeys.has(key)));
}

async function readJsonArray<T>(filePath: string, normalize: (item: unknown) => T) {
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalize) : [];
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : '';

    if (code === 'ENOENT') return [];
    throw error;
  }
}

async function writeJson(filePath: string, items: unknown[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
}

function supabaseConfig() {
  const rawUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  let url = rawUrl;

  if (url) {
    url = url
      .replace(/\/rest\/v1$/i, '')
      .replace(/\/storage\/v1$/i, '')
      .replace(/\/auth\/v1$/i, '');
  }

  return url && serviceRoleKey && bucket ? { url, serviceRoleKey, bucket } : null;
}

function supabaseHeaders(prefer?: string) {
  const config = supabaseConfig();

  if (!config) throw new Error('Supabase is not configured.');

  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

async function supabaseRequest<T>(pathName: string, init: RequestInit = {}) {
  const config = supabaseConfig();

  if (!config) throw new Error('Supabase is not configured.');

  const response = await fetch(`${config.url}${pathName}`, {
    ...init,
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function listArchiveItems() {
  if (!supabaseConfig()) return readJsonArray(archivePath, normalizeArchiveItem);

  const rows = await supabaseRequest<SupabaseArchiveRow[]>(
    '/rest/v1/archive_items?select=*&order=saved_at.desc',
    { headers: supabaseHeaders() }
  );

  return rows.map(normalizeArchiveItem);
}

export async function createArchiveItem(item: ArchiveItem) {
  const savedItem = {
    ...item,
    id: `${item.id}-${Date.now()}`,
    savedAt: new Date().toLocaleString(),
  };

  if (!supabaseConfig()) {
    const items = await listArchiveItems();
    const updated = [savedItem, ...items];
    await writeJson(archivePath, updated);
    return savedItem;
  }

  const rows = await supabaseRequest<SupabaseArchiveRow[]>('/rest/v1/archive_items?select=*', {
    method: 'POST',
    headers: supabaseHeaders('return=representation'),
    body: JSON.stringify(archiveToRow(savedItem)),
  });

  return normalizeArchiveItem(rows[0]);
}

export async function deleteArchiveItem(id: string) {
  if (!supabaseConfig()) {
    const items = await listArchiveItems();
    await writeJson(
      archivePath,
      items.filter((item) => item.id !== id)
    );
    return;
  }

  await supabaseRequest(`/rest/v1/archive_items?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: supabaseHeaders(),
  });
}

export async function listSubmissionItems() {
  if (!supabaseConfig()) return readJsonArray(submissionsPath, normalizeSubmissionItem);

  const rows = await supabaseRequest<SupabaseSubmissionRow[]>(
    '/rest/v1/submissions?select=*&status=eq.pending&order=submitted_at.desc',
    { headers: supabaseHeaders() }
  );

  return rows.map(normalizeSubmissionItem);
}

function getUploadExtension(file: File) {
  const fromName = file.name.includes('.') ? file.name.split('.').pop() : '';
  const fromType = file.type.split('/')[1];
  return (fromName || fromType || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase();
}

async function uploadLocalPendingFile(file: File, id: string) {
  const extension = getUploadExtension(file);
  const filename = `${id}.${extension}`;
  const publicUrl = `/uploads/pending/${filename}`;

  await mkdir(pendingUploadsDir, { recursive: true });
  await writeFile(path.join(pendingUploadsDir, filename), Buffer.from(await file.arrayBuffer()));

  return publicUrl;
}

async function uploadSupabasePendingFile(file: File, id: string) {
  const config = supabaseConfig();

  if (!config) throw new Error('Supabase is not configured.');

  const extension = getUploadExtension(file);
  const objectPath = `pending/${id}.${extension}`;
  const response = await fetch(`${config.url}/storage/v1/object/${config.bucket}/${objectPath}`, {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase upload failed: ${response.status}`);
  }

  return `${config.url}/storage/v1/object/public/${config.bucket}/${objectPath}`;
}

export async function uploadPendingImage(file: File, id: string) {
  return supabaseConfig() ? uploadSupabasePendingFile(file, id) : uploadLocalPendingFile(file, id);
}

export async function createSubmissionItem(item: SubmissionItem) {
  if (!supabaseConfig()) {
    const items = await listSubmissionItems();
    await writeJson(submissionsPath, [item, ...items]);
    return item;
  }

  const rows = await supabaseRequest<SupabaseSubmissionRow[]>('/rest/v1/submissions?select=*', {
    method: 'POST',
    headers: supabaseHeaders('return=representation'),
    body: JSON.stringify(submissionToRow(item)),
  });

  return normalizeSubmissionItem(rows[0]);
}

export async function approveSubmissionItem(id: string) {
  const submissions = await listSubmissionItems();
  const submission = submissions.find((item) => item.id === id);

  if (!submission) return null;

  const archiveItem = await createArchiveItem({
    ...submission,
    id: submission.id,
    savedAt: new Date().toLocaleString(),
  });

  await deleteSubmissionItem(id, false);

  return archiveItem;
}

function imageUrlToLocalPublicPath(imageUrl: string) {
  return imageUrl.startsWith('/uploads/pending/') ? path.join(process.cwd(), 'public', imageUrl) : '';
}

export async function deleteSubmissionItem(id: string, deleteFile = true) {
  const submissions = await listSubmissionItems();
  const rejected = submissions.find((item) => item.id === id);

  if (!supabaseConfig()) {
    if (deleteFile && rejected) {
      const uploadPath = imageUrlToLocalPublicPath(rejected.imageUrl);
      if (uploadPath) await unlink(uploadPath).catch(() => undefined);
    }

    await writeJson(
      submissionsPath,
      submissions.filter((item) => item.id !== id)
    );
    return;
  }

  await supabaseRequest(`/rest/v1/submissions?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: supabaseHeaders(),
  });
}
