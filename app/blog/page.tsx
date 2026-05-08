export default function BlogPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-10">블로그</h1>
      <ul className="space-y-8">
        <li className="border-b pb-8">
          <p className="text-sm text-gray-400 mb-1">2026년 5월 8일</p>
          <h2 className="text-2xl font-semibold mb-2">
            <a href="/blog/first-post" className="hover:text-gray-400">
              첫 번째 블로그 글
            </a>
          </h2>
          <p className="text-gray-600">블로그를 시작하며 첫 번째 글을 작성합니다.</p>
        </li>
        <li className="border-b pb-8">
          <p className="text-sm text-gray-400 mb-1">2026년 5월 7일</p>
          <h2 className="text-2xl font-semibold mb-2">
            <a href="/blog/wsl2-setup" className="hover:text-gray-400">
              WSL2 개발환경 구축기
            </a>
          </h2>
          <p className="text-gray-600">윈도우에서 리눅스 개발환경을 만들어 보았습니다.</p>
        </li>
      </ul>
    </main>
  );
}