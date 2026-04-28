'use client';

import { ArrowLeft, Check, ImagePlus, Send, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type ChannelOption = {
  number: string;
  title: string;
  category: string;
  subs: string[];
};

const DECADE_OPTIONS = ['80s', '90s', '2000s', 'Not Sure'];

const CHANNEL_OPTIONS: ChannelOption[] = [
  {
    number: '01',
    title: 'Stores',
    category: 'STORES',
    subs: ['Big Box', 'Toy Stores', 'Electronics', 'Grocery', 'Department', 'Video Stores'],
  },
  {
    number: '02',
    title: 'Malls',
    category: 'MALLS',
    subs: ['Mall Interiors', 'Food Courts', 'Anchor Stores', 'Specialty Shops', 'Kiosks', 'Mall Events'],
  },
  {
    number: '03',
    title: 'Theme Parks',
    category: 'THEME PARKS',
    subs: ['Rides', 'Park Areas', 'Resorts', 'Food & Dining', 'Queues', 'Maps & Signage'],
  },
  {
    number: '04',
    title: 'Restaurants',
    category: 'RESTAURANTS',
    subs: ['Fast Food', 'Pizza Places', 'Casual Dining', 'Play Places', 'Buffets', 'Drive-Thru'],
  },
  {
    number: '05',
    title: 'Home Life',
    category: 'HOME LIFE',
    subs: ['Living Rooms', 'Bedrooms', 'Kitchens', 'Basements', 'Game Rooms', 'Home Computers'],
  },
  {
    number: '06',
    title: 'Schools',
    category: 'SCHOOLS',
    subs: ['Classrooms', 'Cafeterias', 'Hallways', 'Playgrounds', 'Libraries', 'School Events'],
  },
  {
    number: '07',
    title: 'Arcades & Gaming',
    category: 'ARCADES & GAMING',
    subs: ['Arcades', 'Store Kiosks', 'LAN Setups', 'Console Rooms', 'Prize Areas', 'Game Corners'],
  },
  {
    number: '08',
    title: 'Movies & Entertainment',
    category: 'MOVIES & ENTERTAINMENT',
    subs: ['Movie Theaters', 'Drive-Ins', 'Video Rentals', 'Home Media', 'Concessions', 'Lobby Spaces'],
  },
  {
    number: '09',
    title: 'Travel & Vacation',
    category: 'TRAVEL & VACATION',
    subs: ['Airports', 'Airplanes', 'Hotels', 'Motels', 'Roadside Stops', 'Travel Interiors'],
  },
  {
    number: '10',
    title: 'Outdoors',
    category: 'OUTDOORS',
    subs: ['Parks', 'Neighborhoods', 'Pools', 'Playgrounds', 'Campgrounds', 'Skate Parks'],
  },
  {
    number: '11',
    title: 'Cars & Road Life',
    category: 'CARS & ROAD LIFE',
    subs: ['Car Interiors', 'Road Trips', 'Parking Lots', 'Dealerships', 'Dashboard Views', 'Car Culture'],
  },
  {
    number: '12',
    title: 'Everyday Spaces',
    category: 'EVERYDAY SPACES',
    subs: ['Waiting Rooms', 'Doctor Offices', 'Laundromats', 'Bathrooms', 'Government Buildings', 'Misc. Spaces'],
  },
];

const EXTRA_TAG_PRESETS = [
  'Walmart',
  'Kmart',
  'Target',
  'Toys R Us',
  'Pizza Hut',
  "McDonald's",
  'Food Court',
  'Mall',
  'Arcade',
  'Bedroom',
  'Classroom',
  'Road Trip',
];

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function splitCustomTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function SubmitMemoryPage() {
  const [title, setTitle] = useState('');
  const [decade, setDecade] = useState('90s');
  const [category, setCategory] = useState('STORES');
  const [selectedSubTags, setSelectedSubTags] = useState<string[]>(['Big Box']);
  const [selectedExtraTags, setSelectedExtraTags] = useState<string[]>([]);
  const [customExtraTags, setCustomExtraTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const activeChannel = CHANNEL_OPTIONS.find((channel) => channel.category === category) ?? CHANNEL_OPTIONS[0];
  const allExtraTags = [...selectedExtraTags, ...splitCustomTags(customExtraTags)];

  const previewUrl = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

  const chooseChannel = (channel: ChannelOption) => {
    setCategory(channel.category);
    setSelectedSubTags([channel.subs[0]]);
  };

  const submitMemory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || loading) return;

    const formData = new FormData();
    formData.set('image', file);
    formData.set('title', title);
    formData.set('decade', decade);
    formData.set('category', category);
    formData.set('subTags', selectedSubTags.join(', '));
    formData.set('extraTags', allExtraTags.join(', '));

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
      setSelectedSubTags([activeChannel.subs[0]]);
      setSelectedExtraTags([]);
      setCustomExtraTags('');
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit memory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,#7bdff2_0%,#4361ee_32%,#3a0ca3_62%,#16002f_100%)] p-3 font-mono text-black md:p-6">
      <div className="mx-auto max-w-7xl overflow-hidden border-4 border-white bg-[#fff8e8] shadow-[8px_8px_0_rgba(0,0,0,0.48)]">
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

        <section className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b-4 border-[#8d99ae] bg-black p-3 lg:border-b-0 lg:border-r-4">
            <div className="flex min-h-[460px] items-center justify-center border-4 border-[#2b2d42] bg-[#0b0636] text-white">
              {previewUrl ? (
                <img src={previewUrl} alt="Upload preview" className="max-h-[76vh] w-full object-contain" />
              ) : (
                <div className="p-8 text-center">
                  <ImagePlus size={50} className="mx-auto mb-4 text-[#ffd166]" />
                  <div className="text-2xl font-black">ADD A MEMORY</div>
                  <p className="mt-3 max-w-sm text-sm font-bold leading-6 text-white/70">
                    Pick a photo, tap the channel, then add the tags that fit.
                  </p>
                </div>
              )}
            </div>

            <label className="mt-3 block text-sm font-black text-white">
              Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="mt-2 w-full border-2 border-[#8d99ae] bg-white p-3 text-sm font-bold text-black outline-none file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-[#ffd166]"
              />
              <span className="mt-2 block text-xs font-bold text-white/65">JPG, PNG, or WebP. 8 MB max.</span>
            </label>
          </div>

          <form onSubmit={submitMemory} className="space-y-5 bg-[#dff7ff] p-4 md:p-6">
            <div>
              <h1 className="text-3xl font-black">SUBMIT A MEMORY</h1>
              <p className="mt-2 text-sm font-bold leading-6 text-[#495057]">
                Most of this should be clicking now. Only type the title and any very specific tags.
              </p>
            </div>

            <label className="block text-sm font-black text-[#2b2d42]">
              Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
                placeholder="Walmart toy aisle, 1998"
              />
            </label>

            <section>
              <div className="mb-2 text-sm font-black text-[#2b2d42]">Decade</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DECADE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDecade(option)}
                    className={`flex h-10 items-center justify-center border-2 text-sm font-black ${
                      decade === option
                        ? 'border-black bg-[#ffbe0b] text-black shadow-[3px_3px_0_#3a0ca3]'
                        : 'border-[#8d99ae] bg-white text-[#2b2d42] hover:border-black'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-2 text-sm font-black text-[#2b2d42]">Channel</div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {CHANNEL_OPTIONS.map((channel) => (
                  <button
                    key={channel.category}
                    type="button"
                    onClick={() => chooseChannel(channel)}
                    className={`min-h-[70px] border-2 p-3 text-left transition ${
                      category === channel.category
                        ? 'border-black bg-[#ff4d6d] text-white shadow-[4px_4px_0_#3a0ca3]'
                        : 'border-[#8d99ae] bg-white text-[#2b2d42] hover:border-black'
                    }`}
                  >
                    <span className="block text-xs font-black uppercase tracking-[0.12em]">CH {channel.number}</span>
                    <span className="mt-1 block text-sm font-black">{channel.title}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-2 text-sm font-black text-[#2b2d42]">{activeChannel.title} Tags</div>
              <div className="flex flex-wrap gap-2">
                {activeChannel.subs.map((tag) => {
                  const active = selectedSubTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedSubTags((tags) => toggleValue(tags, tag))}
                      className={`flex h-9 items-center gap-2 border-2 px-3 text-xs font-black ${
                        active
                          ? 'border-black bg-[#3a0ca3] text-white'
                          : 'border-[#8d99ae] bg-white text-[#2b2d42] hover:border-black'
                      }`}
                    >
                      {active ? <Check size={14} /> : null}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="mb-2 text-sm font-black text-[#2b2d42]">Extra Tags</div>
              <div className="flex flex-wrap gap-2">
                {EXTRA_TAG_PRESETS.map((tag) => {
                  const active = selectedExtraTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedExtraTags((tags) => toggleValue(tags, tag))}
                      className={`flex h-9 items-center gap-2 border-2 px-3 text-xs font-black ${
                        active
                          ? 'border-black bg-[#ffd166] text-black'
                          : 'border-[#8d99ae] bg-white text-[#2b2d42] hover:border-black'
                      }`}
                    >
                      {active ? <X size={13} /> : null}
                      {tag}
                    </button>
                  );
                })}
              </div>
              <input
                value={customExtraTags}
                onChange={(event) => setCustomExtraTags(event.target.value)}
                className="mt-3 h-11 w-full border-2 border-[#8d99ae] bg-white px-3 text-sm font-bold outline-none focus:border-black"
                placeholder="Add anything else, separated by commas"
              />
            </section>

            <div className="border-2 border-[#8d99ae] bg-white p-3 text-xs font-bold text-[#2b2d42]">
              <span className="font-black">Review:</span> CH {activeChannel.number} {activeChannel.title} / {decade}
              {selectedSubTags.length > 0 ? ` / ${selectedSubTags.join(', ')}` : ''}
              {allExtraTags.length > 0 ? ` / ${allExtraTags.join(', ')}` : ''}
            </div>

            {error ? <div className="border-2 border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div> : null}
            {status ? <div className="border-2 border-[#7bdff2] bg-[#e8fbff] p-3 text-sm font-bold text-[#1b2a52]">{status}</div> : null}

            <button
              type="submit"
              disabled={!file || loading || selectedSubTags.length === 0}
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
