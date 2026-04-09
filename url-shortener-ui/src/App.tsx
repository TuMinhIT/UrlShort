import { UrlShortenerPage } from "./features/url-shortener/components/UrlShortenerPage";

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70rem_70rem_at_10%_-10%,rgba(248,150,30,0.16),transparent_55%),radial-gradient(55rem_55rem_at_95%_10%,rgba(30,108,248,0.17),transparent_60%)]" />

      <section className="relative mx-auto w-full max-w-6xl">
        <UrlShortenerPage />
      </section>

      <footer className="relative mx-auto mt-10 w-full max-w-6xl text-center text-sm text-slate-500">
        Copyright MinhTuIt 2026
      </footer>
    </main>
  );
}

export default App;
