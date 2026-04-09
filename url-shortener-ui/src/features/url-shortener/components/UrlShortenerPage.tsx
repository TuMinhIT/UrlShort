import { useMemo } from "react";
import { useUrlHistoryQuery } from "../hooks/useUrlHistoryQuery";
import type { UrlItem } from "../types";
import { StatsGrid } from "./StatsGrid";
import { ShortenUrlForm } from "./ShortenUrlForm";
import { UrlHistory } from "./UrlHistory";

export function UrlShortenerPage() {
  const historyQuery = useUrlHistoryQuery();

  const historyItems = useMemo<UrlItem[]>(
    () =>
      (historyQuery.data ?? []).map((item: UrlItem) => ({
        ...item,
        countClick: item.countClick ?? 0,
      })),
    [historyQuery.data],
  );

  const totalClicks = useMemo(
    () => historyItems.reduce((sum, item) => sum + (item.countClick ?? 0), 0),
    [historyItems],
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:gap-10">
      <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-white/50 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.28em] text-slate-700 shadow-sm backdrop-blur">
            URL Shortener
          </p>

          <h1 className="max-w-2xl text-balance text-4xl font-black leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
            Quản lý link rút gọn
            <span className="mt-2 block bg-linear-to-r from-blue-700 via-cyan-600 to-orange-500 bg-clip-text text-transparent">
              Nhanh không tưởng
            </span>
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-7 text-slate-700 sm:text-lg">
            Nền tảng rút gọn URL hiện đại giúp bạn tạo, quản lý và theo dõi link
            một cách hiệu quả. Mọi thao tác được xử lý theo thời gian thực thông
            qua hệ thống API, cho phép bạn nhanh chóng tạo short link, xem lịch
            sử truy cập theo IP và phân tích số lượt click với độ chính xác cao.
          </p>

          <StatsGrid
            linkCount={historyItems.length}
            totalClicks={totalClicks}
          />
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-cyan-200/55 via-white/20 to-orange-200/60 blur-3xl" />
          <ShortenUrlForm />
        </div>
      </section>

      <UrlHistory
        items={historyItems}
        isLoading={historyQuery.isLoading}
        onRetry={() => {
          void historyQuery.refetch();
        }}
      />
    </div>
  );
}
