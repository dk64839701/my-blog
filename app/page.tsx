export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4">안녕하세요 👋</h1>
        <p className="text-lg text-gray-600">
          친사 입니다. 이곳은 저희 부부의 개인 블로그입니다.
          일상, 기술, 생각들을 기록하는 공간입니다.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">최근 글</h2>
        <ul className="space-y-6">
          <li className="border-b pb-6">
            <p className="text-sm text-gray-400 mb-1">2026년 5월 7일</p>
            <h3 className="text-xl font-semibold mb-2">첫 번째 블로그 글</h3>
            <p className="text-gray-600">블로그를 시작하며 첫 번째 글을 작성합니다.</p>
          </li>
          <li className="border-b pb-6">
            <p className="text-sm text-gray-400 mb-1">2026년 5월 6일</p>
            <h3 className="text-xl font-semibold mb-2">WSL2 개발환경 구축기</h3>
            <p className="text-gray-600">윈도우에서 리눅스 개발환경을 만들어 보았습니다.</p>
          </li>
        </ul>
      </section>
    </main>
  );
}