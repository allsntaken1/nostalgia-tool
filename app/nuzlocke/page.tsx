import { hasNuzlockePassword, isNuzlockeAuthorized } from './auth';
import { NuzlockeLogin, NuzlockeTracker } from './components';

export const dynamic = 'force-dynamic';

export default async function NuzlockePage() {
  const configured = hasNuzlockePassword();
  const authorized = configured ? await isNuzlockeAuthorized() : false;

  return (
    <main className="min-h-screen bg-[#eaf4ef] bg-[linear-gradient(90deg,rgba(24,42,64,0.05)_1px,transparent_1px),linear-gradient(rgba(24,42,64,0.05)_1px,transparent_1px)] bg-[length:18px_18px] font-mono text-[#182a40]">
      {!configured ? (
        <section className="mx-auto flex min-h-screen max-w-3xl items-center p-4">
          <div className="w-full border-4 border-[#182a40] bg-[#fffdf1] p-6 shadow-[8px_8px_0_rgba(24,42,64,0.25)]">
            <div className="mb-3 inline-block bg-[#ef5350] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
              Developer Warning
            </div>
            <h1 className="text-3xl font-black">NUZLOCKE_PASSWORD is not configured.</h1>
            <p className="mt-3 text-sm font-bold leading-6 text-[#506078]">
              Add an environment variable named <span className="bg-[#eaf4ef] px-1">NUZLOCKE_PASSWORD</span> in Vercel and locally before using this private tracker. The page is not crashing, but it will stay locked until that password exists.
            </p>
          </div>
        </section>
      ) : authorized ? (
        <NuzlockeTracker />
      ) : (
        <NuzlockeLogin />
      )}
    </main>
  );
}
