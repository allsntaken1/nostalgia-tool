'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import {
  pokemonChannels,
  pokemonContexts,
  pokemonEras,
  pokemonGenerations,
} from '../data';
import { PokemonHeader, PokemonMemoryVisual, PokemonShell } from '../components';

export default function PokemonUploadPage() {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [channelId, setChannelId] = useState(pokemonChannels[0]?.id ?? 'cards');
  const [era, setEra] = useState('Not Sure');
  const [generation, setGeneration] = useState('Mixed / Not Sure');
  const [context, setContext] = useState('Not Sure');
  const [subcategory, setSubcategory] = useState(pokemonChannels[0]?.subcategories?.[0] ?? '');
  const [submitted, setSubmitted] = useState(false);

  const channel = useMemo(() => pokemonChannels.find((item) => item.id === channelId) ?? pokemonChannels[0], [channelId]);
  const subcategories = channel?.subcategories || [];

  const handleChannelChange = (nextChannel: string) => {
    const found = pokemonChannels.find((item) => item.id === nextChannel);
    setChannelId(nextChannel);
    setSubcategory(found?.subcategories?.[0] ?? '');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <PokemonShell>
      <PokemonHeader />
      <section className="grid gap-0 bg-[#dff6ff] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b-4 border-[#26345f] bg-[#141a30] p-4 lg:border-b-0 lg:border-r-4">
          <div className="aspect-[4/3] overflow-hidden border-4 border-[#8aa0c5] bg-black shadow-[8px_8px_0_rgba(0,0,0,0.35)]">
            <PokemonMemoryVisual
              channelId={channelId}
              memory={{
                id: 'pokemon-upload-preview',
                archiveType: 'pokemon',
                title: title || 'Pokemon Upload Preview',
                pokemonChannel: channelId,
                pokemonEra: era,
                pokemonGeneration: generation,
                pokemonContext: context,
                pokemonSubcategory: subcategory,
                caption,
                imageUrl,
                createdAt: 'Pending',
              }}
            />
          </div>
          <div className="mt-4 border-4 border-[#8aa0c5] bg-[#fff7d6] p-4 text-[#10172f]">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#ef5350]">Archive Type</div>
            <div className="mt-1 text-lg font-black">pokemon</div>
            <p className="mt-2 text-sm font-bold leading-6 text-[#4f5e82]">
              This keeps Pokémon memories separate from the main RepeatChannel archive and search flow.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-5">
            <div className="inline-block bg-[#332070] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#ffcb05]">
              Upload Memory
            </div>
            <h1 className="mt-3 text-4xl font-black text-[#10172f]">Submit a Pokémon memory</h1>
            <p className="mt-2 text-sm font-bold leading-6 text-[#4f5e82]">
              MVP form for Pokémon-specific tagging. Backend persistence can hook into the existing approval flow next.
            </p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-black">
              Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="border-4 border-[#8aa0c5] bg-white px-3 py-3 font-bold outline-none focus:border-[#26345f]" placeholder="Toy Store Pokemon Display" />
            </label>
            <label className="grid gap-2 text-sm font-black">
              Image URL
              <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="border-4 border-[#8aa0c5] bg-white px-3 py-3 font-bold outline-none focus:border-[#26345f]" placeholder="https://..." />
            </label>
            <label className="grid gap-2 text-sm font-black">
              Caption
              <textarea value={caption} onChange={(event) => setCaption(event.target.value)} className="min-h-24 border-4 border-[#8aa0c5] bg-white px-3 py-3 font-bold outline-none focus:border-[#26345f]" placeholder="What memory does this unlock?" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">
                Pokémon Channel
                <select value={channelId} onChange={(event) => handleChannelChange(event.target.value)} className="border-4 border-[#8aa0c5] bg-white px-3 py-3 font-bold">
                  {pokemonChannels.map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Subcategory
                <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} className="border-4 border-[#8aa0c5] bg-white px-3 py-3 font-bold">
                  {subcategories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Era
                <select value={era} onChange={(event) => setEra(event.target.value)} className="border-4 border-[#8aa0c5] bg-white px-3 py-3 font-bold">
                  {pokemonEras.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Generation
                <select value={generation} onChange={(event) => setGeneration(event.target.value)} className="border-4 border-[#8aa0c5] bg-white px-3 py-3 font-bold">
                  {pokemonGenerations.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black sm:col-span-2">
                Location / Context
                <select value={context} onChange={(event) => setContext(event.target.value)} className="border-4 border-[#8aa0c5] bg-white px-3 py-3 font-bold">
                  {pokemonContexts.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit" className="border-4 border-[#10172f] bg-[#ef5350] px-5 py-4 text-sm font-black text-white shadow-[5px_5px_0_#332070] transition hover:-translate-y-1 hover:bg-[#ffcb05] hover:text-[#10172f]">
              Mark as Pokémon Submission
            </button>
            {submitted && (
              <div className="border-4 border-[#26345f] bg-[#ffcb05] p-4 text-sm font-black text-[#10172f]">
                Memory staged as archiveType: pokemon. Next step is wiring this page into the live approval database.
              </div>
            )}
            <Link href="/pokemon" className="text-sm font-black underline">Back to Pokémon Archive</Link>
          </div>
        </form>
      </section>
    </PokemonShell>
  );
}
