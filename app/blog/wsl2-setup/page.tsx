export default function Wsl2Setup() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <p className="text-sm text-gray-400 mb-2">2026년 5월 7일</p>
      <h1 className="text-4xl font-bold mb-8">WSL2 개발환경 구축기</h1>
      <div className="space-y-4 text-gray-300 leading-relaxed">
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
      <div className="mt-12">
        <a href="/blog" className="text-gray-400 hover:text-white">← 블로그 목록으로</a>
      </div>
    </main>
  );
}