type StatsGridProps = {
  linkCount: number;
  totalClicks: number;
};

export function StatsGrid({ linkCount, totalClicks }: StatsGridProps) {
  const items = [
    { label: "Links đã tạo", value: String(linkCount) },
    { label: "Tổng click", value: String(totalClicks) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 shadow-[0_6px_30px_rgba(15,23,42,0.08)] backdrop-blur-md"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {item.label}
          </p>
          <p className="mt-1 break-all text-xl font-extrabold text-slate-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
