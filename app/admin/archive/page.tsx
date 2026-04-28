'use client';

import { Check, ExternalLink, LockKeyhole, Search, Trash2, Wrench, X } from 'lucide-react';
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
          <Link
            href="/admin"
            className="flex h-10 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
          >
            <Wrench size={16} />
            SOURCING TOOL
          </Link>
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
    </main>
  );
}
