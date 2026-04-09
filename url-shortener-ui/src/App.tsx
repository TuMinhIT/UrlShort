import { ShortenerForm } from "./components/ShortenerForm";

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70rem_70rem_at_10%_-10%,rgba(248,150,30,0.16),transparent_55%),radial-gradient(55rem_55rem_at_95%_10%,rgba(30,108,248,0.17),transparent_60%)]" />

      <section className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-white/30 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm backdrop-blur">
            URL SHORTENER
          </p>

          <h1 className="text-balance text-4xl font-black leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
            Short links,
            <span className="block bg-linear-to-r from-blue-700 via-cyan-600 to-orange-500 bg-clip-text text-transparent">
              long impact.
            </span>
          </h1>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
            Create beautiful, shareable links in seconds. Track your campaigns,
            improve click-through rates, and keep your brand front and center.
          </p>

          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            <StatCard value="99.9%" label="Uptime" />
            <StatCard value="12M+" label="Links created" />
            <StatCard value="145" label="Countries" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-4xl bg-linear-to-br from-cyan-200/55 via-white/10 to-orange-200/60 blur-2xl" />
          <ShortenerForm />
        </div>
      </section>

      <footer className="relative mx-auto mt-10 w-full max-w-6xl text-center text-sm text-slate-500">
        @copyrigth MinhTuIt 2026
      </footer>
    </main>
  );
}

type StatCardProps = {
  value: string;
  label: string;
};

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/65 px-4 py-3 backdrop-blur-md shadow-[0_6px_30px_rgba(15,23,42,0.08)]">
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

export default App;
