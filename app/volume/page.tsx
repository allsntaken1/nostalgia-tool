'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SavedItem = {
  id: string;
  title: string;
  imageUrl: string;
  thumbUrl: string;
  decade: string;
  category: string;
  subTags: string[];
};

type VolumeStats = {
  id: string;
  volumeUp: number;
  volumeDown: number;
};

export default function VolumePage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [stats, setStats] = useState<Record<string, VolumeStats>>({});

  useEffect(() => {
    const load = async () => {
      const [archiveResponse, volumeResponse] = await Promise.all([
        fetch('/api/archive', { cache: 'no-store' }),
        fetch('/api/volume', { cache: 'no-store' }),
      ]);

      const archiveData = archiveResponse.ok ? await archiveResponse.json() : [];
      const volumeData = volumeResponse.ok ? await volumeResponse.json() : [];

      setItems(Array.isArray(archiveData) ? archiveData : []);
      setStats(
        Object.fromEntries(
          (Array.isArray(volumeData) ? volumeData : [])
            .filter((item): item is VolumeStats => typeof item?.id === 'string')
            .map((item) => [item.id, item])
        )
      );
    };

    load().catch(() => undefined);
  }, []);

  const loudestItems = useMemo(
    () =>
      items
        .map((item) => {
          const itemStats = stats[item.id] ?? { id: item.id, volumeUp: 0, volumeDown: 0 };
          return {
            ...item,
            volumeUp: itemStats.volumeUp,
            volumeDown: itemStats.volumeDown,
            score: itemStats.volumeUp - itemStats.volumeDown,
          };
        })
        .sort((a, b) => b.score - a.score || b.volumeUp - a.volumeUp || a.title.localeCompare(b.title)),
    [items, stats]
  );

  return (
    <main className="min-h-screen bg-[#00132e] p-4 font-mono text-black">
      <div className="mx-auto max-w-7xl overflow-hidden border-4 border-white bg-[#e6fbff] shadow-[8px_8px_0_rgba(0,0,0,0.48)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#8d99ae] bg-gradient-to-r from-[#7df9ff] via-white to-[#ff4fd8] px-3 py-2 font-bold">
          <div>
            <div>The Repeat Channel</div>
            <div className="text-xs font-black uppercase tracking-[0.12em] text-black/65">Highest Volume</div>
          </div>
          <Link
            href="/"
            className="flex h-9 items-center gap-2 border-2 border-white bg-white px-3 text-xs font-black text-black hover:border-black"
          >
            <Home size={15} />
            HOME
          </Link>
        </header>

        <section className="border-b-4 border-[#8d99ae] bg-[#001f3f] px-4 py-5 text-white">
          <div className="text-3xl font-black uppercase tracking-[0.06em] text-[#7df9ff]">Volume Chart</div>
          <p className="mt-2 max-w-2xl text-sm font-bold text-white/75">
            Photos with the loudest signal rise to the top. Volume up adds signal, volume down lowers it.
          </p>
        </section>

        <section className="grid gap-4 bg-[#dffaff] p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loudestItems.map((item, index) => (
            <article key={item.id} className="border-4 border-[#2b2d42] bg-white shadow-[5px_5px_0_#ff4fd8]">
              <div className="relative aspect-[4/3] bg-black">
                <img
                  src={item.imageUrl || item.thumbUrl}
                  alt={item.title}
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute left-2 top-2 bg-[#001f3f] px-2 py-1 text-xs font-black text-[#7df9ff]">
                  #{index + 1}
                </div>
              </div>
              <div className="p-3">
                <h2 className="line-clamp-2 min-h-10 text-sm font-black text-[#001f3f]">{item.title}</h2>
                <div className="mt-2 text-xs font-bold text-[#495057]">
                  {item.decade} / {item.category} / {item.subTags[0] || 'Unsorted'}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-black">
                  <div className="border-2 border-[#8d99ae] bg-[#edf2f4] p-2">VOL {item.score}</div>
                  <div className="border-2 border-[#8d99ae] bg-[#b8ff4d] p-2">+{item.volumeUp}</div>
                  <div className="border-2 border-[#8d99ae] bg-[#ffb3e9] p-2">-{item.volumeDown}</div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
