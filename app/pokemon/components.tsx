import Link from 'next/link';
import type { ReactNode } from 'react';
import type { PokemonChannel, PokemonMemory } from './data';

const channelAccent: Record<string, string> = {
  cards: 'from-[#ffcb05] to-[#f36f21]',
  'toys-merch': 'from-[#ff80bf] to-[#ffd166]',
  'gaming-setups': 'from-[#76d275] to-[#58c7f3]',
  'stores-events': 'from-[#ef5350] to-[#ffcb05]',
  'school-life': 'from-[#90caf9] to-[#c5e1a5]',
  'media-culture': 'from-[#7e57c2] to-[#42a5f5]',
};

export function PokemonShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#20304f] bg-[radial-gradient(circle_at_15%_10%,rgba(255,203,5,0.35)_0_7%,transparent_8%),radial-gradient(circle_at_86%_12%,rgba(88,199,243,0.32)_0_6%,transparent_7%),linear-gradient(135deg,#fff3b0_0%,#8bd3dd_34%,#4062a8_68%,#18213d_100%)] p-3 font-mono text-[#1d2545] sm:p-5">
      <div className="mx-auto max-w-7xl overflow-hidden border-4 border-[#fff7d6] bg-[#fef7dc] shadow-[8px_8px_0_rgba(24,33,61,0.55)]">
        {children}
      </div>
    </main>
  );
}

export function PokemonHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#26345f] bg-gradient-to-r from-[#ef5350] via-[#ffcb05] to-[#58c7f3] px-3 py-2 font-black">
      <Link href="/pokemon" className="text-lg tracking-[0.02em] sm:text-xl">
        Pokémon Nostalgia Archive
      </Link>
      <nav className="flex flex-wrap gap-2 text-xs">
        <Link className="border-2 border-[#26345f] bg-white px-3 py-2 shadow-[3px_3px_0_#26345f] hover:bg-[#fffbda]" href="/">
          RepeatChannel
        </Link>
        <Link className="border-2 border-[#26345f] bg-white px-3 py-2 shadow-[3px_3px_0_#26345f] hover:bg-[#fffbda]" href="/pokemon/upload">
          Upload Memory
        </Link>
      </nav>
    </header>
  );
}

export function PokemonMemoryVisual({ memory, channelId }: { memory?: PokemonMemory; channelId?: string }) {
  const accent = channelAccent[channelId || memory?.pokemonChannel || 'cards'] ?? channelAccent.cards;

  if (memory?.imageUrl) {
    return (
      <img
        src={memory.imageUrl}
        alt={memory.title}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className={`relative h-full min-h-[220px] overflow-hidden bg-gradient-to-br ${accent}`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:18px_18px]" />
      <div className="absolute left-5 top-5 h-20 w-20 rounded-full border-[10px] border-[#26345f] bg-white shadow-[5px_5px_0_rgba(38,52,95,0.35)]">
        <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#26345f] bg-[#fffbda]" />
      </div>
      <div className="absolute bottom-5 left-5 right-5 border-4 border-[#26345f] bg-[#fffbda]/90 p-3 shadow-[5px_5px_0_rgba(38,52,95,0.35)]">
        <div className="text-xs font-black uppercase tracking-[0.16em] text-[#ef5350]">Memory Signal</div>
        <div className="mt-1 text-lg font-black">{memory?.title || 'Awaiting First Upload'}</div>
      </div>
    </div>
  );
}

export function PokemonMemoryGrid({ memories }: { memories: PokemonMemory[] }) {
  const safeMemories = Array.isArray(memories) ? memories : [];

  if (safeMemories.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border-4 border-dashed border-[#8aa0c5] bg-[#fff7d6] p-5 shadow-[5px_5px_0_rgba(38,52,95,0.22)]">
            <div className="text-sm font-black uppercase tracking-[0.14em] text-[#4062a8]">Empty Slot</div>
            <div className="mt-3 text-xl font-black">No memories archived here yet.</div>
            <p className="mt-2 text-sm font-bold leading-6 text-[#4f5e82]">This channel is ready for binder scans, store aisles, school trades, and whatever else shakes loose.</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {safeMemories.map((memory) => (
        <article key={memory.id} className="overflow-hidden border-4 border-[#26345f] bg-white shadow-[6px_6px_0_rgba(38,52,95,0.35)]">
          <div className="aspect-[4/3] bg-[#26345f]">
            <PokemonMemoryVisual memory={memory} />
          </div>
          <div className="p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#ef5350]">
              {memory.pokemonEra} / {memory.pokemonGeneration}
            </div>
            <h3 className="mt-2 text-lg font-black">{memory.title}</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-[#4f5e82]">{memory.caption}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black">
              {[memory.pokemonContext, memory.pokemonSubcategory].filter(Boolean).map((tag) => (
                <span key={tag} className="border-2 border-[#8aa0c5] bg-[#fffbda] px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PokemonChannelCard({ channel }: { channel: PokemonChannel }) {
  const subcategories = Array.isArray(channel.subcategories) ? channel.subcategories : [];

  return (
    <Link href={`/pokemon/channel/${channel.id}`} className="block border-4 border-[#26345f] bg-white p-4 shadow-[5px_5px_0_rgba(38,52,95,0.35)] transition hover:-translate-y-1 hover:bg-[#fffbda]">
      <div className={`mb-3 h-3 bg-gradient-to-r ${channelAccent[channel.id] ?? channelAccent.cards}`} />
      <h3 className="text-xl font-black">{channel.title}</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-[#4f5e82]">{channel.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black">
        {subcategories.slice(0, 4).map((tag) => (
          <span key={tag} className="border-2 border-[#8aa0c5] bg-[#eef7ff] px-2 py-1">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
