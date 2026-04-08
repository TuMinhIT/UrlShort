import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

const HISTORY_KEY = "url-shortener-history";

type LinkItem = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  expiresAt: string | null;
  clicks: number;
};

function createShortCode() {
  return Math.random().toString(36).slice(2, 8);
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isAliasValid(alias: string) {
  return /^[a-zA-Z0-9_-]{4,20}$/.test(alias);
}

function nowIsoDateString() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

function toShortUrl(shortCode: string) {
  return `https://sho.rt/${shortCode}`;
}

export function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (!stored) return;
      const parsed: LinkItem[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setLinks(parsed);
      }
    } catch {
      setLinks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(links));
  }, [links]);

  const shortUrl = useMemo(() => {
    if (!links.length) return "";
    return toShortUrl(links[0].shortCode);
  }, [links]);

  const totalClicks = useMemo(() => {
    return links.reduce((sum, item) => sum + item.clicks, 0);
  }, [links]);

  const activeLinks = useMemo(() => {
    const now = Date.now();
    return links.filter(
      (item) => !item.expiresAt || new Date(item.expiresAt).getTime() > now,
    ).length;
  }, [links]);

  const isAliasDuplicated = (alias: string) => {
    return links.some(
      (item) => item.shortCode.toLowerCase() === alias.toLowerCase(),
    );
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = url.trim();
    const alias = customAlias.trim();

    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }

    if (!isValidHttpUrl(trimmed)) {
      setError("URL must start with http:// or https://");
      return;
    }

    if (alias && !isAliasValid(alias)) {
      setError(
        "Alias should be 4-20 chars and only include letters, numbers, _ or -",
      );
      return;
    }

    if (alias && isAliasDuplicated(alias)) {
      setError("This alias already exists. Please choose another one.");
      return;
    }

    if (expiresOn && expiresOn < nowIsoDateString()) {
      setError("Expiration date must be today or in the future.");
      return;
    }

    const nextShortCode = alias || createShortCode();
    const link: LinkItem = {
      id: crypto.randomUUID(),
      originalUrl: trimmed,
      shortCode: nextShortCode,
      createdAt: new Date().toISOString(),
      expiresAt: expiresOn
        ? new Date(`${expiresOn}T23:59:59`).toISOString()
        : null,
      clicks: 0,
    };

    setError("");
    setLinks((prev) => [link, ...prev].slice(0, 10));
    setCustomAlias("");
    setExpiresOn("");
  };

  const onDelete = (id: string) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const onSimulateClick = (id: string) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, clicks: item.clicks + 1 } : item,
      ),
    );
  };

  const onCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 1800);
    } catch {
      setError("Could not copy link. Please copy it manually.");
    }
  };

  return (
    <section className="rounded-4xl border border-white/35 bg-white/70 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-7">
      <div className="mb-5 space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Create Short Link
        </h2>
        <p className="text-sm text-slate-600 sm:text-base">
          Paste your long URL below and generate a concise, share-ready link.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="url"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
          >
            Destination URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/your-super-long-link"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            autoComplete="off"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="alias"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
            >
              Custom alias (optional)
            </label>
            <input
              id="alias"
              type="text"
              value={customAlias}
              onChange={(event) => setCustomAlias(event.target.value)}
              placeholder="my-campaign"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor="expires-on"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
            >
              Expiration date
            </label>
            <input
              id="expires-on"
              type="date"
              min={nowIsoDateString()}
              value={expiresOn}
              onChange={(event) => setExpiresOn(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-linear-to-r from-blue-700 via-cyan-600 to-orange-500 px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] hover:shadow-xl"
        >
          Shorten URL
        </button>
      </form>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      {shortUrl ? (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 sm:p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Latest short link
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="truncate font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4"
            >
              {shortUrl}
            </a>
            <button
              type="button"
              onClick={() => onCopy("latest", shortUrl)}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-emerald-700 transition hover:bg-emerald-100"
            >
              {copiedId === "latest" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Active links
          </p>
          <p className="text-2xl font-black text-slate-900">{activeLinks}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Total clicks
          </p>
          <p className="text-2xl font-black text-slate-900">{totalClicks}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-700">
            Recent links
          </h3>
          <button
            type="button"
            onClick={() => setLinks([])}
            className="text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-700"
            disabled={links.length === 0}
          >
            Clear all
          </button>
        </div>

        {links.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-3 py-4 text-sm text-slate-500">
            No links yet. Create one to see history and quick actions.
          </p>
        ) : (
          <ul className="space-y-2">
            {links.map((item) => {
              const link = toShortUrl(item.shortCode);
              const isExpired = Boolean(
                item.expiresAt &&
                new Date(item.expiresAt).getTime() <= Date.now(),
              );

              return (
                <li
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white/85 p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-sm font-bold text-blue-700 underline decoration-blue-200 underline-offset-4"
                      >
                        {link}
                      </a>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.originalUrl}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                        isExpired
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isExpired ? "Expired" : "Active"}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span>Created: {formatDate(item.createdAt)}</span>
                    <span>Clicks: {item.clicks}</span>
                    <span>
                      Expires:{" "}
                      {item.expiresAt ? formatDate(item.expiresAt) : "Never"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onCopy(item.id, link)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 hover:bg-slate-100"
                    >
                      {copiedId === item.id ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSimulateClick(item.id)}
                      className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-cyan-700 hover:bg-cyan-100"
                    >
                      Simulate click
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-rose-700 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
