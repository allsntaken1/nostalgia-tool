'use client';

import { useEffect, useMemo, useState } from 'react';
import { nuzlockeStorageKey } from '../data';

type SettingsStatus = {
  connected: boolean;
  totalRuns: number;
  storageMode: string;
  error?: string;
};

function readLocalRuns() {
  try {
    const raw = window.localStorage.getItem(nuzlockeStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getOrCreateClientId() {
  const key = `${nuzlockeStorageKey}_client_id`;
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const generated = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(key, generated);
    return generated;
  } catch {
    return '';
  }
}

export function NuzlockeSettings() {
  const [status, setStatus] = useState<SettingsStatus>({ connected: false, totalRuns: 0, storageMode: 'Checking...' });
  const [localRuns, setLocalRuns] = useState<unknown[]>([]);
  const [message, setMessage] = useState('');
  const localImported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(`${nuzlockeStorageKey}_imported`) === 'true';
  }, []);

  const refresh = () => {
    setLocalRuns(readLocalRuns());
    const clientId = getOrCreateClientId();
    const query = clientId ? `?client_id=${encodeURIComponent(clientId)}` : '';
    fetch(`/api/nuzlocke/settings${query}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => setStatus(payload))
      .catch(() => setStatus({ connected: false, totalRuns: 0, storageMode: 'localStorage fallback', error: 'Could not reach settings API.' }));
  };

  useEffect(() => {
    const timeout = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const importLocalRuns = () => {
    const runs = readLocalRuns();
    if (runs.length === 0) {
      setMessage('No local runs found to import.');
      return;
    }

    fetch('/api/nuzlocke/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: getOrCreateClientId(), runs }),
    })
      .then((response) => response.json())
      .then((payload) => {
        if (!payload?.configured) throw new Error('Dedicated Nuzlocke Supabase is not configured.');
        if (!payload?.verified) throw new Error('Import ran, but verification failed.');
        window.localStorage.setItem(`${nuzlockeStorageKey}_imported`, 'true');
        setMessage(`Imported ${payload.imported} local run(s). Local backup was not deleted.`);
        refresh();
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Import failed.'));
  };

  const exportLocalBackup = () => {
    const data = JSON.stringify(readLocalRuns(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'repeatchannel_nuzlocke_runs_backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-white/75 bg-white/90 p-4 shadow-[0_18px_50px_rgba(24,42,64,0.10)]">
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-[#e83f6f]">Trainer Log Settings</div>
        <h1 className="text-3xl font-black">Nuzlocke Storage</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Nuzlocke Supabase" value={status.connected ? 'Connected' : 'Not connected'} />
        <Info label="Storage Mode" value={status.storageMode} />
        <Info label="Database Runs" value={String(status.totalRuns ?? 0)} />
        <Info label="Local Backup" value={localRuns.length > 0 ? `${localRuns.length} run(s)` : 'None found'} />
        <Info label="Local Import Marker" value={localImported ? 'Imported' : 'Not imported'} />
      </div>

      {status.error ? <div className="mt-3 rounded-xl bg-[#fff2f0] p-3 text-sm font-black text-[#9f2c24]">{status.error}</div> : null}
      {message ? <div className="mt-3 rounded-xl bg-[#f7f9fc] p-3 text-sm font-black">{message}</div> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={refresh} className="rounded-lg border border-[#c9d4e2] bg-white px-3 py-2 text-xs font-black shadow-sm">Refresh</button>
        <button type="button" onClick={importLocalRuns} className="rounded-lg bg-[#ffe1ea] px-3 py-2 text-xs font-black shadow-sm">Import Existing Local Runs</button>
        <button type="button" onClick={exportLocalBackup} className="rounded-lg border border-[#c9d4e2] bg-white px-3 py-2 text-xs font-black shadow-sm">Export Local Backup</button>
        <a href="/nuzlocke" className="rounded-lg border border-[#c9d4e2] bg-white px-3 py-2 text-xs font-black shadow-sm">Back to Tracker</a>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/75 p-3 shadow-sm">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#e83f6f]">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
    </div>
  );
}
