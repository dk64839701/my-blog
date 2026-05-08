export default function FirstPost() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <p className="text-sm text-gray-400 mb-2">2026년 5월 8일</p>
      <h1 className="text-4xl font-bold mb-8">첫 번째 블로그 글</h1>
      <div className="space-y-4 text-gray-300 leading-relaxed">
        <p>
          안녕하세요, 친사입니다. 오늘부터 블로그를 시작합니다.
        </p>
        <p>
          이 블로그는 일상, 기술, 그리고 제가 배우고 경험한 것들을
          기록하는 공간입니다.
        </p>
        <p>
          앞으로 다양한 주제로 글을 써나갈 예정입니다. 잘 부탁드립니다!
        </p>
      </div>
      <div className="mt-12">
        <a href="/blog" className="text-gray-400 hover:text-white">← 블로그 목록으로</a>
      </div>
    </main>
  );
}