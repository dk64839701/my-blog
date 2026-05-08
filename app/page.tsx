export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4" style={{color: '#1d4ed8'}}>안녕하세요 👋</h1>
        <p className="text-lg" style={{color: '#4b5563'}}>
          저는 친사 입니다. 이곳은 제 개인 블로그입니다.
          일상, 기술, 생각들을 기록하는 공간입니다.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6" style={{color: '#1e3a8a'}}>최근 글</h2>
        <ul className="space-y-6">
          <li className="border-b pb-6" style={{borderColor: '#e5e7eb'}}>
            <p className="text-sm mb-1" style={{color: '#9ca3af'}}>2026년 5월 8일</p>
            <h3 className="text-xl font-semibold mb-2">
              <a href="/blog/first-post" style={{color: '#2563eb'}}>
                첫 번째 블로그 글
              </a>
            </h3>
            <p style={{color: '#4b5563'}}>블로그를 시작하며 첫 번째 글을 작성합니다.</p>
          </li>
          <li className="border-b pb-6" style={{borderColor: '#e5e7eb'}}>
            <p className="text-sm mb-1" style={{color: '#9ca3af'}}>2026년 5월 7일</p>
            <h3 className="text-xl font-semibold mb-2">
              <a href="/blog/wsl2-setup" style={{color: '#2563eb'}}>
                WSL2 개발환경 구축기
              </a>
            </h3>
            <p style={{color: '#4b5563'}}>윈도우에서 리눅스 개발환경을 만들어 보았습니다.</p>
          </li>
        </ul>
      </section>
    </main>
  );
}