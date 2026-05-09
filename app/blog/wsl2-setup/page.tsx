export default function Wsl2Setup() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">

      <div className="mb-3">
        <a href="/blog" style={{color: '#2563eb', fontSize: '14px'}}>← 블로그 목록으로</a>
      </div>

      <div className="mb-3">
        <span className="text-xs px-3 py-1 rounded-full" style={{backgroundColor: '#eff6ff', color: '#2563eb'}}>
          컴퓨터
        </span>
      </div>

      <p className="text-sm mb-2" style={{color: '#9ca3af'}}>2026년 5월 7일</p>
      <h1 className="text-2xl font-bold mb-4" style={{color: '#1e3a8a'}}>WSL2 개발환경 구축기</h1>

      <div className="w-16 h-1 mb-6" style={{backgroundColor: '#2563eb'}}></div>

      <div className="space-y-2 leading-snug" style={{color: '#374151', fontSize: '16px'}}>
        <p>
          윈도우11에서 WSL2를 이용해 리눅스 개발환경을 구축했습니다.
        </p>
        <p>
          WSL2에 Ubuntu 24.04를 설치하고, Node.js, Git, VS Code까지
          연결하는 과정을 진행했습니다.
        </p>
        <p>
          리눅스 환경이 웹 개발에 더 적합한 이유는 실제 웹 서버들이
          대부분 리눅스에서 운영되기 때문입니다.
        </p>
      </div>

      <div className="mt-8 pt-4" style={{borderTop: '1px solid #e5e7eb'}}>
        <a href="/blog" style={{color: '#2563eb', fontSize: '14px', fontWeight: '600'}}>← 블로그 목록으로</a>
      </div>

    </main>
  );
}