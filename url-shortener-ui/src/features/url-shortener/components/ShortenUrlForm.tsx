import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useCreateShortUrlMutation } from "../hooks/useCreateShortUrlMutation";

import { getErrorMessage, isValidHttpUrl } from "../../../helpers/utils";

export function ShortenUrlForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [localError, setLocalError] = useState("");
  const [copied, setCopied] = useState(false);

  const createMutation = useCreateShortUrlMutation();

  const latestResult = createMutation.data;
  const shortUrl = latestResult?.shortUrl ?? "";

  useEffect(() => {
    if (!copied) return undefined;

    const timeoutId = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedUrl = originalUrl.trim();

    if (!trimmedUrl) {
      setLocalError("Vui lòng nhập URL gốc.");
      return;
    }

    if (!isValidHttpUrl(trimmedUrl)) {
      setLocalError("URL phải bắt đầu bằng http:// hoặc https://.");
      return;
    }

    setLocalError("");

    try {
      await createMutation.mutateAsync({
        originalUrl: trimmedUrl,
      });

      //   // Hứng kết quả trả về từ API
      //   console.log("Short code:", result.shortCode);
      //   console.log("Short URL:", result.shortUrl);
      setOriginalUrl("");
    } catch (error) {
      setLocalError(getErrorMessage(error, "Không thể tạo short URL."));
    }
  };

  const copyShortUrl = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
    } catch {
      setLocalError("Không thể sao chép liên kết.");
    }
  };

  const isSubmitting = createMutation.isPending;

  return (
    <section className="rounded-4xl border border-white/40 bg-white/78 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-7">
      <div className="space-y-2">
        <p className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
          Shorten API
        </p>
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
          Tạo short URL
        </h2>
        <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          Dán URL gốc, hệ thống sẽ rút gọn nhanh chóng, theo dõi lượt truy cập
          realtime và quản lý toàn bộ URL của bạn trong một nền tảng đơn giản
          nhưng mạnh mẽ.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="original-url"
            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500"
          >
            Original URL
          </label>
          <input
            id="original-url"
            type="url"
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            placeholder="https://example.com/very-long-url"
            autoComplete="off"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-blue-700 via-cyan-600 to-orange-500 px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Đang xử lý..." : "Shorten URL"}
        </button>
      </form>

      {(localError || createMutation.error) && (
        <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {localError ||
            getErrorMessage(createMutation.error, "Không thể tạo short URL.")}
        </div>
      )}

      {shortUrl ? (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            Short URL mới nhất
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 flex-1 truncate text-sm font-semibold text-emerald-950 underline decoration-emerald-300 underline-offset-4"
            >
              {shortUrl}
            </a>
            <button
              type="button"
              onClick={copyShortUrl}
              className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 transition hover:bg-emerald-100"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
