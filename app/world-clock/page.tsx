import WorldClock from "./WorldClock";

export const metadata = {
  title: "세계 시간 | 친사's Blog",
  description: "주요 도시의 현재 시간을 한눈에 확인합니다.",
};

export default function WorldClockPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold" style={{ color: "#1d4ed8" }}>
        세계 시간
      </h1>
      <div className="mb-10 h-1 w-16" style={{ backgroundColor: "#2563eb" }} />

      <section className="mb-8 rounded-xl p-6" style={{ backgroundColor: "#eff6ff", borderLeft: "4px solid #2563eb" }}>
        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "#1e3a8a" }}>
          주요 도시 현재 시간
        </h2>
        <p className="leading-relaxed" style={{ color: "#374151" }}>
          로컬 시간과 주요 도시 시간을 실시간으로 확인하고, 브라우저가 지원하는 전세계 시간대를 추가할 수 있습니다.
        </p>
      </section>

      <WorldClock />
    </main>
  );
}
