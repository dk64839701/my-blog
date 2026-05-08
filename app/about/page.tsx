export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">소개</h1>
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">안녕하세요 👋</h2>
          <p>
            저는 친사입니다. 이 블로그는 제가 배우고 경험한 것들을
            기록하는 개인 공간입니다.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">관심사</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>웹 개발</li>
            <li>새로운 기술 배우기</li>
            <li>일상 기록</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">연락처</h2>
          <p>이메일: your@email.com</p>
        </section>
      </div>
    </main>
  );
}