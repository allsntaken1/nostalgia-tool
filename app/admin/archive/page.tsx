'use client';

import { Check, ExternalLink, LockKeyhole, Search, Sparkles, Trash2, Wrench, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SavedItem = {
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

type SubmissionItem = Omit<SavedItem, 'savedAt'> & {
  submittedAt: string;
  status: 'pending';
};

const DECADE_OPTIONS = ['80s', '90s', '2000s', 'Not Sure'];

const CATEGORY_OPTIONS = [
  'STORES',
  'MALLS',
  'THEME PARKS',
  'RESTAURANTS',
  'HOME LIFE',
  'SCHOOLS',
  'ARCADES & GAMING',
  'MOVIES & ENTERTAINMENT',
  'TRAVEL & VACATION',
  'OUTDOORS',
  'CARS & ROAD LIFE',
  'EVERYDAY SPACES',
  'Unsorted',
];

const CHANNEL_TAGS: Record<string, string[]> = {
  STORES: ['Big Box', 'Toy Stores', 'Electronics', 'Grocery', 'Department', 'Video Stores'],
  MALLS: ['Mall Interiors', 'Food Courts', 'Anchor Stores', 'Specialty Shops', 'Kiosks', 'Mall Events'],
  'THEME PARKS': ['Rides', 'Park Areas', 'Resorts', 'Food & Dining', 'Queues', 'Maps & Signage'],
  RESTAURANTS: ['Fast Food', 'Pizza Places', 'Casual Dining', 'Play Places', 'Buffets', 'Drive-Thru'],
  'HOME LIFE': ['Living Rooms', 'Bedrooms', 'Kitchens', 'Basements', 'Game Rooms', 'Home Computers'],
  SCHOOLS: ['Classrooms', 'Cafeterias', 'Hallways', 'Playgrounds', 'Libraries', 'School Events'],
  'ARCADES & GAMING': ['Arcades', 'Store Kiosks', 'LAN Setups', 'Console Rooms', 'Prize Areas', 'Game Corners'],
  'MOVIES & ENTERTAINMENT': ['Movie Theaters', 'Drive-Ins', 'Video Rentals', 'Home Media', 'Concessions', 'Lobby Spaces'],
  'TRAVEL & VACATION': ['Airports', 'Airplanes', 'Hotels', 'Motels', 'Roadside Stops', 'Travel Interiors'],
  OUTDOORS: ['Parks', 'Neighborhoods', 'Pools', 'Playgrounds', 'Campgrounds', 'Skate Parks'],
  'CARS & ROAD LIFE': ['Car Interiors', 'Road Trips', 'Parking Lots', 'Dealerships', 'Dashboard Views', 'Car Culture'],
  'EVERYDAY SPACES': ['Waiting Rooms', 'Doctor Offices', 'Laundromats', 'Bathrooms', 'Government Buildings', 'Misc. Spaces'],
};

type AutoTagSuggestion = {
  decade: string;
  category: string;
  subTags: string[];
  extraTags: string[];
  confidence: number;
  note: string;
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeSavedItem(raw: unknown): SavedItem {
  const item = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    id: typeof item.id === 'string' ? item.id : `${Date.now()}-${Math.random()}`,
    title: typeof item.title === 'string' ? item.title : 'Untitled image',
    imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
    thumbUrl:
      typeof item.thumbUrl === 'string'
        ? item.thumbUrl
        : typeof item.imageUrl === 'string'
          ? item.imageUrl
          : '',
    source: typeof item.source === 'string' ? item.source : 'Unknown source',
    sourceUrl: typeof item.sourceUrl === 'string' ? item.sourceUrl : '',
    originalQuery: typeof item.originalQuery === 'string' ? item.originalQuery : '',
    decade: typeof item.decade === 'string' ? item.decade : 'Not Sure',
    category:
      typeof item.category === 'string'
        ? item.category
        : typeof item.channel === 'string'
          ? item.channel
          : 'Unsorted',
    subTags: toStringArray(item.subTags),
    extraTags: toStringArray(item.extraTags),
    savedAt: typeof item.savedAt === 'string' ? item.savedAt : new Date().toLocaleString(),
  };
}

function normalizeSubmissionItem(raw: unknown): SubmissionItem {
  const item = normalizeSavedItem(raw);
  const rawItem = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    ...item,
    submittedAt: typeof rawItem.submittedAt === 'string' ? rawItem.submittedAt : item.savedAt,
    status: 'pending',
  };
}

async function readResponseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function splitTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function AdminArchivePage() {
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [adminError, setAdminError] = useState('');
  const [items, setItems] = useState<SavedItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [query, setQuery] = useState('');
  const [decade, setDecade] = useState('all');
  const [category, setCategory] = useState('all');
  const [actionError, setActionError] = useState('');
  const [autoTagItem, setAutoTagItem] = useState<SavedItem | null>(null);
  const [autoTagSuggestion, setAutoTagSuggestion] = useState<AutoTagSuggestion | null>(null);
  const [autoTagLoading, setAutoTagLoading] = useState(false);
  const [autoTagError, setAutoTagError] = useState('');

  const expectedAdminPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'nostalgia';

  const refreshArchiveItems = async () => {
    const archiveResponse = await fetch('/api/archive', { cache: 'no-store' });

    if (!archiveResponse.ok) throw new Error('Could not load archive.');

    const archiveData = await readResponseJson(archiveResponse);
    setItems(Array.isArray(archiveData) ? archiveData.map(normalizeSavedItem) : []);
  };

  const refreshSubmissionItems = async (secret: string) => {
    const submissionResponse = await fetch('/api/submissions', {
      cache: 'no-store',
      headers: {
        'x-admin-secret': secret,
      },
    });

    if (!submissionResponse.ok) throw new Error('Could not load submissions.');

    const submissionData = await readResponseJson(submissionResponse);
    setSubmissions(Array.isArray(submissionData) ? submissionData.map(normalizeSubmissionItem) : []);
  };

  useEffect(() => {
    const storedSecret = sessionStorage.getItem('nostalgia-admin-secret') || '';
    if (sessionStorage.getItem('nostalgia-admin-unlocked') === 'true' && storedSecret) {
      queueMicrotask(() => {
        setAdminSecret(storedSecret);
        setAdminUnlocked(true);
      });
    }
  }, []);

  useEffect(() => {
    const loadArchive = async () => {
      try {
        await refreshArchiveItems();
        if (adminSecret) await refreshSubmissionItems(adminSecret);
      } catch {
        setItems([]);
        setSubmissions([]);
      }
    };

    loadArchive();
  }, [adminSecret]);

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return items.filter((item) => {
      const decadeMatch = decade === 'all' || item.decade === decade;
      const categoryMatch = category === 'all' || item.category === category;
      const queryMatch =
        !needle ||
        [
          item.title,
          item.source,
          item.originalQuery,
          item.category,
          item.decade,
          ...item.subTags,
          ...item.extraTags,
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle);

      return decadeMatch && categoryMatch && queryMatch;
    });
  }, [items, query, decade, category]);

  const unlockAdmin = () => {
    if (adminPasscode === expectedAdminPasscode) {
      sessionStorage.setItem('nostalgia-admin-unlocked', 'true');
      sessionStorage.setItem('nostalgia-admin-secret', adminPasscode);
      setAdminSecret(adminPasscode);
      setAdminUnlocked(true);
      setAdminError('');
      return;
    }

    setAdminError('Wrong passcode.');
  };

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/archive?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'x-admin-secret': adminSecret,
      },
    });

    if (!response.ok) return;

    setItems((archiveItems) => archiveItems.filter((item) => item.id !== id));
  };

  const runAutoTag = async (item: SavedItem) => {
    setAutoTagItem(item);
    setAutoTagSuggestion(null);
    setAutoTagError('');
    setAutoTagLoading(true);

    try {
      const response = await fetch('/api/auto-tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({
          imageUrl: item.imageUrl || item.thumbUrl,
          title: item.title,
        }),
      });
      const data = await readResponseJson(response);

      if (!response.ok) {
        throw new Error(data?.error || 'Could not auto tag this image.');
      }

      setAutoTagSuggestion(data as AutoTagSuggestion);
    } catch (error) {
      setAutoTagError(error instanceof Error ? error.message : 'Could not auto tag this image.');
    } finally {
      setAutoTagLoading(false);
    }
  };

  const acceptAutoTag = async (suggestion: AutoTagSuggestion, replaceMainTags: boolean) => {
    if (!autoTagItem) return;

    setAutoTagError('');
    const payload = {
      id: autoTagItem.id,
      decade: replaceMainTags || autoTagItem.decade === 'Not Sure' ? suggestion.decade : autoTagItem.decade,
      category: replaceMainTags || autoTagItem.category === 'Unsorted' ? suggestion.category : autoTagItem.category,
      subTags: uniqueValues([...autoTagItem.subTags, ...suggestion.subTags]),
      extraTags: uniqueValues([...autoTagItem.extraTags, ...suggestion.extraTags, 'AI Tagged']),
    };

    const response = await fetch('/api/archive', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify(payload),
    });
    const data = await readResponseJson(response);

    if (!response.ok) {
      setAutoTagError(data?.error || 'Could not save auto tags.');
      return;
    }

    const updated = normalizeSavedItem(data);
    setItems((archiveItems) => archiveItems.map((item) => (item.id === updated.id ? updated : item)));
    setAutoTagItem(null);
    setAutoTagSuggestion(null);
  };

  const approveSubmission = async (id: string) => {
    setActionError('');
    const response = await fetch('/api/submissions', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const data = await readResponseJson(response);
      setActionError(data?.error || 'Could not approve submission.');
      return;
    }

    setSubmissions((pendingItems) => pendingItems.filter((item) => item.id !== id));
    await refreshArchiveItems().catch(() => undefined);
  };

  const rejectSubmission = async (id: string) => {
    setActionError('');
    const response = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'x-admin-secret': adminSecret,
      },
    });

    if (!response.ok) {
      const data = await readResponseJson(response);
      setActionError(data?.error || 'Could not reject submission.');
      return;
    }

    setSubmissions((pendingItems) => pendingItems.filter((item) => item.id !== id));
  };

  if (!adminUnlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101426] p-4 font-mono text-black">
        <section className="w-full max-w-md border-4 border-white bg-[#f8f9fa] shadow-[8px_8px_0_rgba(0,0,0,0.45)]">
          <div className="bg-gradient-to-r from-[#ff4d6d] via-[#ffbe0b] to-[#7bdff2] px-3 py-2 font-bold">
            Nostalgia.exe Admin
          </div>
          <div className="p-5">
            <div className="mb-4 flex h-14 w-14 items-center justify-center border-4 border-[#8d99ae] bg-[#1b2a52] text-white">
              <LockKeyhole size={26} />
            </div>
            <h1 className="text-2xl font-black">ARCHIVE ACCESS</h1>
            <p className="mt-2 text-sm font-bold leading-6 text-[#495057]">
              Unlock saved archive management.
            </p>
            <input
              value={adminPasscode}
              onChange={(event) => setAdminPasscode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') unlockAdmin();
              }}
              type="password"
              className="mt-5 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
              placeholder="Passcode"
            />
            {adminError ? <div className="mt-3 border-2 border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700">{adminError}</div> : null}
            <button
              onClick={unlockAdmin}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 text-sm font-black text-white"
            >
              <LockKeyhole size={16} />
              UNLOCK ARCHIVES
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101426] p-3 font-mono text-black md:p-6">
      <div className="mx-auto max-w-7xl border-4 border-white bg-[#f8f9fa] shadow-[8px_8px_0_rgba(0,0,0,0.45)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#8d99ae] bg-gradient-to-r from-[#4361ee] via-[#4cc9f0] to-[#ffd166] px-3 py-2 font-bold">
          <div>
            <div>Nostalgia.exe Admin</div>
            <div className="text-xs font-black uppercase tracking-[0.12em] text-black/65">Saved Archives</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/auto-tag"
              className="flex h-10 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
            >
              <Sparkles size={16} />
              AUTO TAGGER
            </Link>
            <Link
              href="/admin"
              className="flex h-10 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
            >
              <Wrench size={16} />
              SOURCING TOOL
            </Link>
          </div>
        </header>

        <section className="border-b-4 border-[#8d99ae] bg-[#edf2f4] p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_180px_240px]">
            <label className="block text-sm font-black text-[#2b2d42]">
              Search archive
              <div className="mt-2 flex h-11 items-center border-2 border-[#8d99ae] bg-white px-3 focus-within:border-black">
                <Search size={16} className="mr-2 shrink-0" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
                  placeholder="title, source, tag, query..."
                />
              </div>
            </label>

            <label className="block text-sm font-black text-[#2b2d42]">
              Decade
              <select
                value={decade}
                onChange={(event) => setDecade(event.target.value)}
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
              >
                <option value="all">all</option>
                {DECADE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-black text-[#2b2d42]">
              Channel
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
              >
                <option value="all">all</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="bg-[#dfe8f6] p-4">
          <div className="mb-4 border-4 border-[#8d99ae] bg-[#fff8e8] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">Pending Community Uploads</div>
                <div className="mt-1 text-xs font-bold text-[#495057]">{submissions.length} waiting for approval</div>
              </div>
            </div>

            {actionError ? <div className="mb-3 border-2 border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700">{actionError}</div> : null}

            {submissions.length === 0 ? (
              <div className="border-2 border-dashed border-[#8d99ae] bg-white p-4 text-sm font-bold text-[#495057]">
                No community uploads are waiting right now.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {submissions.map((item) => (
                  <article key={item.id} className="overflow-hidden border-2 border-[#8d99ae] bg-white shadow-[4px_4px_0_rgba(141,153,174,0.45)]">
                    <img src={item.thumbUrl || item.imageUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                    <div className="space-y-3 p-3">
                      <div>
                        <h2 className="line-clamp-2 text-sm font-black text-[#2b2d42]">{item.title}</h2>
                        <p className="text-xs font-bold text-[#6c757d]">Submitted: {item.submittedAt}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[item.decade, item.category, ...item.subTags, ...item.extraTags].slice(0, 6).map((tag) => (
                          <span key={`${item.id}-${tag}`} className="bg-[#edf2f4] px-2 py-1 text-[11px] font-bold text-[#2b2d42]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveSubmission(item.id)}
                          className="flex h-10 flex-1 items-center justify-center gap-2 border-2 border-black bg-black px-3 text-xs font-black text-white"
                        >
                          <Check size={15} />
                          APPROVE
                        </button>
                        <button
                          onClick={() => rejectSubmission(item.id)}
                          className="flex h-10 flex-1 items-center justify-center gap-2 border-2 border-[#8d99ae] bg-white px-3 text-xs font-black text-black hover:border-black"
                        >
                          <X size={15} />
                          REJECT
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">
            {filteredItems.length} of {items.length} saved memories
          </div>

          {filteredItems.length === 0 ? (
            <div className="border-2 border-dashed border-[#8d99ae] bg-white p-6 text-sm font-bold text-[#495057]">
              No saved archive items match these filters.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <article key={item.id} className="overflow-hidden border-2 border-[#8d99ae] bg-white shadow-[4px_4px_0_rgba(141,153,174,0.45)]">
                  <img src={item.thumbUrl || item.imageUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                  <div className="space-y-3 p-3">
                    <div>
                      <h2 className="line-clamp-2 text-sm font-black text-[#2b2d42]">{item.title}</h2>
                      <p className="text-xs font-bold text-[#6c757d]">{item.savedAt}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {[item.decade, item.category, ...item.subTags, ...item.extraTags].slice(0, 6).map((tag) => (
                        <span key={`${item.id}-${tag}`} className="bg-[#edf2f4] px-2 py-1 text-[11px] font-bold text-[#2b2d42]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs font-bold text-[#6c757d]">Query: {item.originalQuery || 'unknown'}</p>

                    <div className="flex gap-2">
                      {item.sourceUrl ? (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-10 flex-1 items-center justify-center gap-2 border-2 border-[#8d99ae] bg-white px-3 text-xs font-black text-black hover:border-black"
                        >
                          <ExternalLink size={15} />
                          SOURCE
                        </a>
                      ) : null}
                      <button
                        onClick={() => runAutoTag(item)}
                        className="flex h-10 flex-1 items-center justify-center gap-2 border-2 border-[#8d99ae] bg-white px-3 text-xs font-black text-black hover:border-black"
                      >
                        <Sparkles size={15} />
                        AUTO TAG
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="flex h-10 flex-1 items-center justify-center gap-2 border-2 border-black bg-black px-3 text-xs font-black text-white"
                      >
                        <Trash2 size={15} />
                        DELETE
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {autoTagItem ? (
        <AutoTagModal
          item={autoTagItem}
          suggestion={autoTagSuggestion}
          loading={autoTagLoading}
          error={autoTagError}
          onClose={() => {
            setAutoTagItem(null);
            setAutoTagSuggestion(null);
            setAutoTagError('');
          }}
          onTryAgain={() => runAutoTag(autoTagItem)}
          onSuggestion={setAutoTagSuggestion}
          onAccept={acceptAutoTag}
        />
      ) : null}
    </main>
  );
}

function AutoTagModal({
  item,
  suggestion,
  loading,
  error,
  onClose,
  onTryAgain,
  onSuggestion,
  onAccept,
}: {
  item: SavedItem;
  suggestion: AutoTagSuggestion | null;
  loading: boolean;
  error: string;
  onClose: () => void;
  onTryAgain: () => void;
  onSuggestion: (suggestion: AutoTagSuggestion) => void;
  onAccept: (suggestion: AutoTagSuggestion, replaceMainTags: boolean) => void;
}) {
  const [replaceMainTags, setReplaceMainTags] = useState(false);
  const [extraTagDraft, setExtraTagDraft] = useState('');
  const activeSubTags = suggestion ? CHANNEL_TAGS[suggestion.category] ?? [] : [];
  const confidence = suggestion ? Math.round(suggestion.confidence * 100) : 0;

  const updateSuggestion = (updates: Partial<AutoTagSuggestion>) => {
    if (!suggestion) return;
    onSuggestion({ ...suggestion, ...updates });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto border-4 border-white bg-[#f8f9fa] p-4 text-black shadow-[8px_8px_0_rgba(0,0,0,0.55)] md:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.14em] text-[#3a0ca3]">Admin Auto Tagger</div>
            <h2 className="mt-1 text-2xl font-black">{item.title}</h2>
          </div>
          <button onClick={onClose} className="border-2 border-[#8d99ae] bg-white px-3 py-1 text-sm font-black hover:border-black">
            CLOSE
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="overflow-hidden border-4 border-[#8d99ae] bg-black">
              <img src={item.thumbUrl || item.imageUrl} alt={item.title} className="aspect-[4/3] w-full object-contain" />
            </div>
            <div className="mt-3 border-2 border-[#8d99ae] bg-white p-3 text-xs font-bold text-[#495057]">
              Existing: {item.decade} / {item.category}
              {item.subTags.length > 0 ? ` / ${item.subTags.join(', ')}` : ''}
              {item.extraTags.length > 0 ? ` / ${item.extraTags.join(', ')}` : ''}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="border-2 border-dashed border-[#8d99ae] bg-white p-5 text-sm font-bold text-[#495057]">
                Analyzing image...
              </div>
            ) : null}

            {error ? <div className="border-2 border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div> : null}

            {suggestion ? (
              <>
                <div className="border-2 border-[#8d99ae] bg-white p-3">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-[#3a0ca3]">Confidence</div>
                  <div className="mt-2 text-3xl font-black">{confidence}%</div>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#495057]">{suggestion.note}</p>
                </div>

                <EditableSingleChoice
                  title="Decade"
                  options={DECADE_OPTIONS}
                  value={suggestion.decade}
                  onPick={(decade) => updateSuggestion({ decade })}
                />
                <EditableSingleChoice
                  title="Channel"
                  options={CATEGORY_OPTIONS}
                  value={suggestion.category}
                  onPick={(category) => updateSuggestion({ category, subTags: [] })}
                />

                {activeSubTags.length > 0 ? (
                  <EditableChipGroup
                    title="Subcategory Tags"
                    options={activeSubTags}
                    values={suggestion.subTags}
                    onPick={(tag) => updateSuggestion({ subTags: toggleValue(suggestion.subTags, tag) })}
                  />
                ) : null}

                <div>
                  <div className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">Extra Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.extraTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => updateSuggestion({ extraTags: suggestion.extraTags.filter((itemTag) => itemTag !== tag) })}
                        className="border-2 border-black bg-[#ffd166] px-3 py-2 text-xs font-black text-black"
                      >
                        {tag} ×
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={extraTagDraft}
                      onChange={(event) => setExtraTagDraft(event.target.value)}
                      className="h-10 min-w-0 flex-1 border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
                      placeholder="add extra tags, comma separated"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateSuggestion({ extraTags: uniqueValues([...suggestion.extraTags, ...splitTags(extraTagDraft)]) });
                        setExtraTagDraft('');
                      }}
                      className="border-2 border-black bg-black px-4 text-xs font-black text-white"
                    >
                      ADD
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 border-2 border-[#8d99ae] bg-white p-3 text-xs font-bold text-[#2b2d42]">
                  <input
                    type="checkbox"
                    checked={replaceMainTags}
                    onChange={(event) => setReplaceMainTags(event.target.checked)}
                    className="mt-1"
                  />
                  Replace existing decade/channel. Leave unchecked to preserve manually set main tags and only add sub/extra tags.
                </label>
              </>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={onTryAgain}
                disabled={loading}
                className="flex h-11 items-center gap-2 border-2 border-[#8d99ae] bg-white px-4 text-xs font-black text-black hover:border-black disabled:opacity-50"
              >
                <Sparkles size={15} />
                {suggestion ? 'TRY AGAIN' : 'AUTO TAG'}
              </button>
              {suggestion ? (
                <button
                  onClick={() => onAccept(suggestion, replaceMainTags)}
                  className="flex h-11 items-center gap-2 border-2 border-black bg-black px-4 text-xs font-black text-white"
                >
                  <Check size={15} />
                  ACCEPT SUGGESTIONS
                </button>
              ) : null}
              <button
                onClick={onClose}
                className="flex h-11 items-center gap-2 border-2 border-[#8d99ae] bg-white px-4 text-xs font-black text-black hover:border-black"
              >
                <X size={15} />
                REJECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableSingleChoice({
  title,
  options,
  value,
  onPick,
}: {
  title: string;
  options: string[];
  value: string;
  onPick: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onPick(option)}
            className={`border-2 px-3 py-2 text-xs font-black ${
              value === option ? 'border-black bg-black text-white' : 'border-[#8d99ae] bg-white text-black hover:border-black'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function EditableChipGroup({
  title,
  options,
  values,
  onPick,
}: {
  title: string;
  options: string[];
  values: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-[#3a0ca3]">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = values.includes(option);
          return (
            <button
              key={option}
              onClick={() => onPick(option)}
              className={`border-2 px-3 py-2 text-xs font-black ${
                active ? 'border-black bg-[#3a0ca3] text-white' : 'border-[#8d99ae] bg-white text-black hover:border-black'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
