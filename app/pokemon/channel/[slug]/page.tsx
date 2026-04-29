'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  getPokemonChannel,
  getPokemonMemoriesByChannel,
  pokemonContexts,
  pokemonEras,
  pokemonGenerations,
} from '../../data';
import { PokemonHeader, PokemonMemoryGrid, PokemonShell } from '../../components';

function ChipSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div>
      <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#332070]">{label}</div>
      <div className="flex flex-wrap gap-2">
        {['All', ...safeOptions].map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`border-2 px-3 py-2 text-xs font-black shadow-[3px_3px_0_rgba(38,52,95,0.25)] transition hover:-translate-y-0.5 ${
                active
                  ? 'border-[#10172f] bg-[#332070] text-[#ffcb05]'
                  : 'border-[#8aa0c5] bg-white text-[#10172f] hover:border-[#10172f]'
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

export default function PokemonChannelPage() {
  const params = useParams<{ slug?: string }>();
  const searchParams = useSearchParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug ?? '';
  const channel = getPokemonChannel(slug);
  const initialEra = searchParams.get('era') || 'All';

  const [era, setEra] = useState(initialEra);
  const [generation, setGeneration] = useState('All');
  const [subcategory, setSubcategory] = useState('All');
  const [context, setContext] = useState('All');

  const channelMemories = useMemo(() => getPokemonMemoriesByChannel(slug), [slug]);
  const filteredMemories = useMemo(() => {
    return channelMemories.filter((memory) => {
      if (era !== 'All' && memory.pokemonEra !== era) return false;
      if (generation !== 'All' && memory.pokemonGeneration !== generation) return false;
      if (subcategory !== 'All' && memory.pokemonSubcategory !== subcategory) return false;
      if (context !== 'All' && memory.pokemonContext !== context) return false;
      return true;
    });
  }, [channelMemories, context, era, generation, subcategory]);

  if (!channel) {
    return (
      <PokemonShell>
        <PokemonHeader />
        <section className="bg-[#dff6ff] p-8">
          <div className="border-4 border-[#26345f] bg-white p-6 shadow-[6px_6px_0_rgba(38,52,95,0.35)]">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-[#ef5350]">No Signal</div>
            <h1 className="mt-2 text-3xl font-black">That Pokémon channel does not exist yet.</h1>
            <Link href="/pokemon" className="mt-5 inline-block border-4 border-[#10172f] bg-[#ffcb05] px-5 py-3 text-sm font-black shadow-[5px_5px_0_#332070]">
              Back to Pokémon Archive
            </Link>
          </div>
        </section>
      </PokemonShell>
    );
  }

  return (
    <PokemonShell>
      <PokemonHeader />
      <section className="grid gap-0 bg-[#dff6ff] lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="border-b-4 border-[#26345f] bg-[#141a30] p-4 text-white lg:border-b-0 lg:border-r-4">
          <div className="mb-3 inline-block bg-[#ffcb05] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#141a30]">
            Poke Channel
          </div>
          <h1 className="text-4xl font-black">{channel.title}</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-white/75">{channel.description}</p>
          <Link
            href="/pokemon/upload"
            className="mt-5 inline-block border-4 border-white bg-[#ef5350] px-5 py-3 text-sm font-black text-white shadow-[5px_5px_0_#ffcb05] transition hover:-translate-y-1"
          >
            Upload to This Channel
          </Link>
          <div className="mt-6 grid gap-2 text-xs font-black">
            {(channel.subcategories || []).map((tag) => (
              <button
                key={tag}
                onClick={() => setSubcategory(tag)}
                className="border-2 border-white/40 bg-white/10 px-3 py-2 text-left hover:bg-white hover:text-[#141a30]"
              >
                {tag}
              </button>
            ))}
          </div>
        </aside>

        <div className="p-4">
          <div className="mb-4 border-4 border-[#26345f] bg-[#fff7d6] p-4 shadow-[5px_5px_0_rgba(38,52,95,0.25)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[#ef5350]">Filter Signal</div>
                <div className="mt-1 text-lg font-black">
                  {era} / {generation} / {subcategory} / {context}
                </div>
              </div>
              <button
                onClick={() => {
                  setEra('All');
                  setGeneration('All');
                  setSubcategory('All');
                  setContext('All');
                }}
                className="border-2 border-[#10172f] bg-white px-3 py-2 text-xs font-black shadow-[3px_3px_0_rgba(38,52,95,0.25)]"
              >
                Clear Filters
              </button>
            </div>
            <div className="grid gap-5">
              <ChipSelect label="Era" options={pokemonEras} value={era} onChange={setEra} />
              <ChipSelect label="Generation" options={pokemonGenerations} value={generation} onChange={setGeneration} />
              <ChipSelect label="Subcategory" options={channel.subcategories || []} value={subcategory} onChange={setSubcategory} />
              <ChipSelect label="Location / Context" options={pokemonContexts} value={context} onChange={setContext} />
            </div>
          </div>

          <PokemonMemoryGrid memories={filteredMemories} />
        </div>
      </section>
    </PokemonShell>
  );
}
