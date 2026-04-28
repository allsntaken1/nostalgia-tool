'use client';

import { ArrowLeft, ImagePlus, Send } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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

export default function SubmitMemoryPage() {
  const [title, setTitle] = useState('');
  const [decade, setDecade] = useState('90s');
  const [category, setCategory] = useState('MALLS');
  const [subTags, setSubTags] = useState('');
  const [extraTags, setExtraTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

  const submitMemory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || loading) return;

    const formData = new FormData();
    formData.set('image', file);
    formData.set('title', title);
    formData.set('decade', decade);
    formData.set('category', category);
    formData.set('subTags', subTags);
    formData.set('extraTags', extraTags);

    setLoading(true);
    setError('');
    setStatus('');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Could not submit memory.');
      }

      setStatus('Submitted for admin review.');
      setTitle('');
      setSubTags('');
      setExtraTags('');
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit memory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,#7bdff2_0%,#4361ee_32%,#3a0ca3_62%,#16002f_100%)] p-3 font-mono text-black md:p-6">
      <div className="mx-auto max-w-6xl overflow-hidden border-4 border-white bg-[#fff8e8] shadow-[8px_8px_0_rgba(0,0,0,0.48)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#8d99ae] bg-gradient-to-r from-[#ff4d6d] via-[#ffbe0b] to-[#7bdff2] px-3 py-2 font-bold">
          <div>
            <div>Nostalgia.exe</div>
            <div className="text-xs font-black uppercase tracking-[0.12em] text-black/65">Community Upload</div>
          </div>
          <Link
            href="/"
            className="flex h-10 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
          >
            <ArrowLeft size={16} />
            HOME
          </Link>
        </header>

        <section className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b-4 border-[#8d99ae] bg-black p-3 lg:border-b-0 lg:border-r-4">
            <div className="flex min-h-[420px] items-center justify-center border-4 border-[#2b2d42] bg-[#0b0636] text-white">
              {previewUrl ? (
                <img src={previewUrl} alt="Upload preview" className="max-h-[70vh] w-full object-contain" />
              ) : (
                <div className="p-8 text-center">
                  <ImagePlus size={48} className="mx-auto mb-4 text-[#ffd166]" />
                  <div className="text-2xl font-black">ADD A MEMORY</div>
                  <p className="mt-3 max-w-sm text-sm font-bold leading-6 text-white/70">
                    Upload a photo from your own collection. It will stay pending until the admin approves it.
                  </p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={submitMemory} className="space-y-4 bg-[#dff7ff] p-5 md:p-7">
            <div>
              <h1 className="text-3xl font-black">SUBMIT A MEMORY</h1>
              <p className="mt-2 text-sm font-bold leading-6 text-[#495057]">
                Add the basics so it lands in the right channel after approval.
              </p>
            </div>

            <label className="block text-sm font-black text-[#2b2d42]">
              Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="mt-2 w-full border-2 border-[#8d99ae] bg-white p-3 text-sm font-bold outline-none file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-black"
              />
              <span className="mt-2 block text-xs font-bold text-[#495057]">JPG, PNG, or WebP. 8 MB max.</span>
            </label>

            <label className="block text-sm font-black text-[#2b2d42]">
              Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
                placeholder="Pizza Hut dining room, 1997"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-black text-[#2b2d42]">
                Decade
                <select
                  value={decade}
                  onChange={(event) => setDecade(event.target.value)}
                  className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
                >
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
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-sm font-black text-[#2b2d42]">
              Sub-tags
              <input
                value={subTags}
                onChange={(event) => setSubTags(event.target.value)}
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
                placeholder="Food Courts, Sbarro"
              />
            </label>

            <label className="block text-sm font-black text-[#2b2d42]">
              Extra tags
              <input
                value={extraTags}
                onChange={(event) => setExtraTags(event.target.value)}
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
                placeholder="location, store name, year"
              />
            </label>

            {error ? <div className="border-2 border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div> : null}
            {status ? <div className="border-2 border-[#7bdff2] bg-[#e8fbff] p-3 text-sm font-bold text-[#1b2a52]">{status}</div> : null}

            <button
              type="submit"
              disabled={!file || loading}
              className="flex h-12 w-full items-center justify-center gap-2 border-4 border-black bg-[#ff4d6d] px-5 text-sm font-black text-white shadow-[5px_5px_0_#3a0ca3] hover:bg-[#ffbe0b] hover:text-black disabled:opacity-50"
            >
              <Send size={17} />
              {loading ? 'SENDING' : 'SEND FOR APPROVAL'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
