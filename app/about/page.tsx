export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">

      <h1 className="text-4xl font-bold mb-2" style={{color: '#1d4ed8'}}>소개</h1>
      <div className="w-16 h-1 mb-10" style={{backgroundColor: '#2563eb'}}></div>

      <div className="space-y-10" style={{color: '#374151'}}>

        <section className="p-6 rounded-xl" style={{backgroundColor: '#eff6ff', borderLeft: '4px solid #2563eb'}}>
          <h2 className="text-2xl font-semibold mb-4" style={{color: '#1e3a8a'}}>안녕하세요 🙋</h2>
          <p className="leading-relaxed">
            저는 친사입니다. 아제르바이잔 바쿠에서 작은 사업을 하며 살고 있습니다.
          </p>
          <p className="leading-relaxed mt-3">인생에서 중요한 것은 <strong>관계</strong>라고 생각합니다.</p>
          <p className="leading-relaxed mt-2">사람들과의 관계, 신과의 관계, 그리고 자연과의 관계.</p>
          <p className="leading-relaxed mt-2">이러한 관계에 대해서 나누는 장소가 되길 바라면서 이 블로그를 만들었습니다.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" style={{color: '#1e3a8a'}}>관심사 🌱</h2>
          <ul className="space-y-3">
            {[
              { emoji: '✈️', text: '여행' },
              { emoji: '🍳', text: '요리' },
              { emoji: '🌏', text: '한국과 아제르바이잔 — 언어와 문화' },
              { emoji: '💻', text: '컴퓨터 / 우분투' },
              { emoji: '✝️', text: '종교' },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 p-3 rounded-lg" style={{backgroundColor: '#f9fafb'}}>
                <span className="text-2xl">{item.emoji}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </main>
  );
}