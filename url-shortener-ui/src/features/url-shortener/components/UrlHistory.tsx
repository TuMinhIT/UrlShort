import { useState } from "react";
import type { UrlItem } from "../types";
import { formatDateTime } from "../../../helpers/utils";
import { appEnv } from "../../../config/env";

type UrlHistoryProps = {
  items: UrlItem[];
  isLoading: boolean;
  onRetry: () => void;
};

export function UrlHistory({ items, isLoading, onRetry }: UrlHistoryProps) {
  const [copiedKey, setCopiedKey] = useState("");

  const copyText = async (copyKey: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(copyKey);
      window.setTimeout(() => setCopiedKey(""), 1500);
    } catch {
      setCopiedKey("");
    }
  };

  const port = appEnv.apiBaseUrl;

  if (isLoading) {
    return (
      <section className="rounded-4xl border border-white/40 bg-white/70 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-7">
        <div className="space-y-3">
          <div className="h-5 w-44 rounded-full bg-slate-200/80" />
          <div className="h-4 w-72 rounded-full bg-slate-200/70" />
        </div>
        <div className="mt-5 space-y-3">
          <div className="h-28 rounded-2xl bg-slate-100/90" />
          <div className="h-28 rounded-2xl bg-slate-100/90" />
          <div className="h-28 rounded-2xl bg-slate-100/90" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-4xl border border-white/40 bg-white/70 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="mt-1 text-xl font-black text-slate-900">
            URL đã rút gọn
          </h3>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Chưa có dữ liệu nào cho IP hiện tại.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {[...items].reverse().map((item) => {
            const shortUrl = `${port}/${item.shortCode}`;

            return (
              <article
                key={item.shortCode}
                className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                        {item.shortCode}
                      </span>
                    </div>

                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block truncate text-sm font-bold text-blue-700 underline decoration-blue-200 underline-offset-4"
                    >
                      {shortUrl}
                    </a>
                    <a
                      href={item.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 break-all text-sm text-gray-500  line-clamp-2"
                    >
                      {item.originalUrl}
                    </a>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 text-xs font-semibold text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      Clicks: {item.countClick ?? 0}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      Created: {formatDateTime(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copyText(`short-${item.shortCode}`, shortUrl)
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100"
                  >
                    {copiedKey === `short-${item.shortCode}`
                      ? "Copied"
                      : "Copy short"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(`origin-${item.shortCode}`, item.originalUrl)
                    }
                    className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-700 transition hover:bg-cyan-100"
                  >
                    {copiedKey === `origin-${item.shortCode}`
                      ? "Copied"
                      : "Copy original"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
