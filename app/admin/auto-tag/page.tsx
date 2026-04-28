'use client';

import { ArrowLeft, ImagePlus, LockKeyhole, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type AutoTagSuggestion = {
  decade: string;
  category: string;
  subTags: string[];
  extraTags: string[];
  confidence: number;
  note: string;
};

export default function AdminAutoTagPage() {
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [adminError, setAdminError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [suggestion, setSuggestion] = useState<AutoTagSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const expectedAdminPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'nostalgia';
  const previewUrl = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

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

  useEffect(() => {
    const storedSecret = sessionStorage.getItem('nostalgia-admin-secret') || '';
    if (sessionStorage.getItem('nostalgia-admin-unlocked') === 'true' && storedSecret) {
      queueMicrotask(() => {
        setAdminSecret(storedSecret);
        setAdminUnlocked(true);
      });
    }
  }, []);

  const runAutoTag = async () => {
    if (!file || loading) return;

    const formData = new FormData();
    formData.set('image', file);
    formData.set('title', title);

    setLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const response = await fetch('/api/auto-tag', {
        method: 'POST',
        headers: {
          'x-admin-secret': adminSecret,
        },
        body: formData,
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || 'Could not auto tag this image.');
      }

      setSuggestion(data as AutoTagSuggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not auto tag this image.');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-black">AUTO TAG ACCESS</h1>
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
              UNLOCK AUTO TAGGER
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101426] p-3 font-mono text-black md:p-6">
      <div className="mx-auto max-w-6xl border-4 border-white bg-[#f8f9fa] shadow-[8px_8px_0_rgba(0,0,0,0.45)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#8d99ae] bg-gradient-to-r from-[#ff4d6d] via-[#ffbe0b] to-[#7bdff2] px-3 py-2 font-bold">
          <div>
            <div>Nostalgia.exe Admin</div>
            <div className="text-xs font-black uppercase tracking-[0.12em] text-black/65">Auto Tagger Test Bench</div>
          </div>
          <Link
            href="/admin/archive"
            className="flex h-10 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
          >
            <ArrowLeft size={16} />
            SAVED ARCHIVES
          </Link>
        </header>

        <section className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b-4 border-[#8d99ae] bg-black p-3 lg:border-b-0 lg:border-r-4">
            <div className="flex min-h-[460px] items-center justify-center border-4 border-[#2b2d42] bg-[#0b0636] text-white">
              {previewUrl ? (
                <img src={previewUrl} alt="Auto tag preview" className="max-h-[76vh] w-full object-contain" />
              ) : (
                <div className="p-8 text-center">
                  <ImagePlus size={50} className="mx-auto mb-4 text-[#ffd166]" />
                  <div className="text-2xl font-black">TEST AN IMAGE</div>
                  <p className="mt-3 max-w-sm text-sm font-bold leading-6 text-white/70">
                    Upload a local image to preview AI suggestions before archiving.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 bg-[#dff7ff] p-4 md:p-6">
            <label className="block text-sm font-black text-[#2b2d42]">
              Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setSuggestion(null);
                  setError('');
                }}
                className="mt-2 w-full border-2 border-[#8d99ae] bg-white p-3 text-sm font-bold outline-none file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-black"
              />
            </label>

            <label className="block text-sm font-black text-[#2b2d42]">
              Optional title/context
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
                placeholder="Walmart toy aisle, 1998"
              />
            </label>

            <button
              onClick={runAutoTag}
              disabled={!file || loading}
              className="flex h-12 w-full items-center justify-center gap-2 border-4 border-black bg-[#ff4d6d] px-5 text-sm font-black text-white shadow-[5px_5px_0_#3a0ca3] hover:bg-[#ffbe0b] hover:text-black disabled:opacity-50"
            >
              <Sparkles size={17} />
              {loading ? 'ANALYZING' : 'AUTO TAG'}
            </button>

            {error ? <div className="border-2 border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div> : null}

            {suggestion ? (
              <div className="space-y-3 border-4 border-[#8d99ae] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-[#3a0ca3]">Suggestion</div>
                    <div className="mt-1 text-3xl font-black">{Math.round(suggestion.confidence * 100)}%</div>
                  </div>
                  <button
                    onClick={() => setSuggestion(null)}
                    className="flex h-9 w-9 items-center justify-center border-2 border-[#8d99ae] bg-white hover:border-black"
                    title="Reject suggestion"
                  >
                    <X size={15} />
                  </button>
                </div>
                <p className="text-sm font-bold leading-6 text-[#495057]">{suggestion.note}</p>
                <div className="flex flex-wrap gap-2">
                  {[suggestion.decade, suggestion.category, ...suggestion.subTags, ...suggestion.extraTags].map((tag) => (
                    <span key={tag} className="border-2 border-[#8d99ae] bg-[#edf2f4] px-3 py-2 text-xs font-black text-[#2b2d42]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs font-bold text-[#6c757d]">
                  This page is for testing only. Use Auto Tag on a saved archive card to accept tags into the archive.
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
