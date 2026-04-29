'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  pokemonChannels,
  pokemonEras,
  pokemonMockMemories,
  type PokemonChannel,
} from './data';
import {
  PokemonHeader,
  PokemonMemoryGrid,
  PokemonMemoryVisual,
  PokemonShell,
} from './components';

function PokemonChannelGuide({
  channels,
  selectedId,
  onSelect,
}: {
  channels: PokemonChannel[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const safeChannels = Array.isArray(channels) ? channels : [];

  return (
    <div className="border-4 border-[#26345f] bg-[#17213d] p-3 text-white shadow-inner">
      <div className="grid grid-cols-[66px_1fr_74px] border-b-2 border-[#7fc8d8] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#ffcb05]">
        <span>Slot</span>
        <span>Channel</span>
        <span className="text-right">Signal</span>
      </div>
      <div className="max-h-[390px] overflow-hidden">
        {safeChannels.map((channel, index) => {
          const selected = channel.id === selectedId;

          return (
            <Link
              key={channel.id}
              href={`/pokemon/channel/${channel.id}`}
              onMouseEnter={() => onSelect(channel.id)}
              onFocus={() => onSelect(channel.id)}
              className={`grid grid-cols-[66px_1fr_74px] items-center border-b-2 border-[#17213d] px-3 py-4 text-left transition ${
                selected
                  ? 'bg-[#ffcb05] text-[#17213d]'
                  : index % 2 === 0
                    ? 'bg-[#2e4a9b] text-white hover:bg-[#4166c5]'
                    : 'bg-[#332070] text-white hover:bg-[#4a2d99]'
              }`}
            >
              <span className="text-sm font-black">#{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="block text-base font-black">{channel.title}</span>
                <span className={`block text-xs font-bold ${selected ? 'text-[#26345f]' : 'text-white/65'}`}>
                  {(channel.subcategories || []).slice(0, 3).join(' / ')}
                </span>
              </span>
              <span className="text-right text-xs font-black">{selected ? 'LIVE' : 'READY'}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function PokemonPage() {
  const [selectedId, setSelectedId] = useState(pokemonChannels[0]?.id ?? 'cards');
  const selectedChannel = pokemonChannels.find((channel) => channel.id === selectedId) ?? pokemonChannels[0];

  const featuredMemory = useMemo(() => {
    return pokemonMockMemories.find((memory) => memory.pokemonChannel === selectedId) ?? pokemonMockMemories[0];
  }, [selectedId]);

  const featuredMemories = pokemonMockMemories.slice(0, 3);

  return (
    <PokemonShell>
      <PokemonHeader />

      <section className="grid min-h-[560px] bg-[#fff7d6] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b-4 border-[#26345f] bg-[#141a30] p-4 lg:border-b-0 lg:border-r-4">
          <div className="relative aspect-[4/3] overflow-hidden border-4 border-[#8aa0c5] bg-black shadow-[8px_8px_0_rgba(0,0,0,0.35)]">
            <PokemonMemoryVisual memory={featuredMemory} channelId={selectedChannel?.id} />
            <div className="absolute left-4 top-4 bg-[#17213d]/90 px-3 py-2 text-xl font-black text-[#ffcb05] shadow-[4px_4px_0_rgba(0,0,0,0.45)]">
              POKE CH {String(pokemonChannels.findIndex((channel) => channel.id === selectedId) + 1).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#dff6ff] p-5">
          <div className="absolute right-10 top-10 h-14 w-14 rounded-full bg-[#ffcb05]/45" />
          <div className="absolute bottom-12 right-16 h-28 w-28 rotate-12 border-8 border-[#ef5350]/25" />
          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 inline-block bg-[#332070] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#ffcb05]">
              Side Archive
            </div>
            <h1 className="text-4xl font-black leading-tight text-[#10172f] sm:text-6xl">
              Pokémon Nostalgia Archive
            </h1>
            <p className="mt-4 text-lg font-bold leading-8 text-[#26345f]">
              Cards, toys, stores, school trades, Game Boy nights, and the tiny electric memories we never really put away.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/pokemon/channel/${selectedChannel?.id ?? 'cards'}`}
                className="border-4 border-[#10172f] bg-[#ef5350] px-5 py-3 text-sm font-black text-white shadow-[5px_5px_0_#332070] transition hover:-translate-y-1 hover:bg-[#ffcb05] hover:text-[#10172f]"
              >
                Enter Selected Channel
              </Link>
              <Link
                href="/pokemon/upload"
                className="border-4 border-[#10172f] bg-white px-5 py-3 text-sm font-black text-[#10172f] shadow-[5px_5px_0_#58c7f3] transition hover:-translate-y-1 hover:bg-[#fffbda]"
              >
                Upload Your Memory
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-4 border-[#ef5350] bg-[#fff7d6] p-4">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#332070]">
              Browse by Channel
            </div>
            <PokemonChannelGuide channels={pokemonChannels} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <div>
            <div className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#332070]">
              Featured Memories
            </div>
            <PokemonMemoryGrid memories={featuredMemories} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-t-4 border-[#26345f] bg-[#dff6ff] p-4 lg:grid-cols-[1fr_0.75fr]">
        <div>
          <div className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#332070]">Browse by Era</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pokemonEras.slice(0, 4).map((era) => (
              <Link
                key={era}
                href={`/pokemon/channel/${selectedChannel?.id ?? 'cards'}?era=${encodeURIComponent(era)}`}
                className="border-4 border-[#26345f] bg-white p-4 text-left shadow-[5px_5px_0_rgba(38,52,95,0.3)] transition hover:-translate-y-1 hover:bg-[#fffbda]"
              >
                <div className="text-lg font-black">{era}</div>
                <div className="mt-2 text-xs font-bold text-[#4f5e82]">Tune the archive by era.</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="border-4 border-[#26345f] bg-[#ffcb05] p-5 shadow-[6px_6px_0_rgba(38,52,95,0.35)]">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-[#332070]">Upload Your Memory CTA</div>
          <h2 className="mt-2 text-2xl font-black">Got a binder photo, store display, or Game Boy setup?</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-[#26345f]">
            Send it into the Pokémon side archive with its own channel, era, generation, and context fields.
          </p>
          <Link
            href="/pokemon/upload"
            className="mt-4 inline-block border-4 border-[#10172f] bg-white px-5 py-3 text-sm font-black text-[#10172f] shadow-[5px_5px_0_#ef5350] transition hover:-translate-y-1"
          >
            Submit a Pokémon Memory
          </Link>
        </div>
      </section>
    </PokemonShell>
  );
}
