import { NuzlockeTracker } from './components';

export default function NuzlockePage() {
  return (
    <main className="min-h-screen bg-[#eaf4ef] bg-[linear-gradient(90deg,rgba(24,42,64,0.05)_1px,transparent_1px),linear-gradient(rgba(24,42,64,0.05)_1px,transparent_1px)] bg-[length:18px_18px] font-mono text-[#182a40]">
      <NuzlockeTracker />
    </main>
  );
}
