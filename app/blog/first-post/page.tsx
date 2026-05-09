export default function FirstPost() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">

      <div className="mb-3">
        <a href="/blog" style={{color: '#2563eb', fontSize: '14px'}}>← 블로그 목록으로</a>
      </div>

      <div className="mb-3">
        <span className="text-xs px-3 py-1 rounded-full" style={{backgroundColor: '#eff6ff', color: '#2563eb'}}>
          일상
        </span>
      </div>

      <p className="text-sm mb-2" style={{color: '#9ca3af'}}>2026년 5월 8일</p>
      <h1 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>첫 번째 블로그 글</h1>

      <div className="w-16 h-1 mb-6" style={{backgroundColor: '#2563eb'}}></div>

      <div className="space-y-2 leading-snug" style={{color: '#374151', fontSize: '16px'}}>
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

      <div className="mt-8 pt-4" style={{borderTop: '1px solid #e5e7eb'}}>
        <a href="/blog" style={{color: '#2563eb', fontSize: '14px', fontWeight: '600'}}>← 블로그 목록으로</a>
      </div>

    </main>
  );
}