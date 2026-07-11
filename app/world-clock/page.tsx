import TimeTools from "./TimeTools";

export const metadata = {
  title: "시간 도구 | 친사's Blog",
  description: "세계 시간, 알람, 타이머, 스톱워치를 사용할 수 있습니다.",
};

export default function WorldClockPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold" style={{ color: "#1d4ed8" }}>
        시간 도구
      </h1>
      <div className="mb-10 h-1 w-16" style={{ backgroundColor: "#2563eb" }} />

      <section className="mb-8 rounded-xl p-6" style={{ backgroundColor: "#eff6ff", borderLeft: "4px solid #2563eb" }}>
        <h2 className="mb-3 text-2xl font-semibold" style={{ color: "#1e3a8a" }}>
          세계시간 · 알람 · 타이머 · 스톱워치
        </h2>
        <p className="leading-relaxed" style={{ color: "#374151" }}>
          필요한 시간 기능을 선택해서 사용할 수 있습니다. 세계시간은 기존 설정과 도시 목록을 그대로 유지합니다.
        </p>
      </section>

      <TimeTools />
    </main>
  );
}
