export default function Home() {
  const topics = [
    {
      title: '여행',
      description: '세상 곳곳의 아름다운 이야기',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
      emoji: '✈️',
    },
    {
      title: '한국 & 아제르바이잔',
      description: '두 나라의 언어와 문화',
      image: '',
      emoji: '🌏',
    },
    {
      title: '컴퓨터 / 우분투',
      description: '기술과 개발 이야기',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
      emoji: '💻',
    },
    {
      title: '신과 자연',
      description: '신과 자연과의 관계',
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
      emoji: '🌿',
    },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <section className="mb-16">
        <div className="grid grid-cols-2 gap-4">
          {topics.map((topic) => (
            <div key={topic.title} className="rounded-xl overflow-hidden shadow-sm" style={{border: '1px solid #e5e7eb'}}>
              {topic.title === '한국 & 아제르바이잔' ? (
                <div className="flex" style={{height: '140px'}}>
                  <img
                    src="https://images.unsplash.com/photo-1591273688202-4cfb3531c7a0?w=300&q=80"
                    alt="경복궁"
                    className="w-1/2 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1674857977971-131936c7b5ea?w=300&q=80"
                    alt="바쿠 야경"
                    className="w-1/2 object-cover"
                  />
                </div>
              ) : (
                <img
                  src={topic.image}
                  alt={topic.title}
                  className="w-full object-cover"
                  style={{height: '140px'}}
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1" style={{color: '#1e3a8a'}}>
                  {topic.emoji} {topic.title}
                </h3>
                <p className="text-sm" style={{color: '#6b7280'}}>{topic.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2" style={{color: '#1e3a8a'}}>최근 글</h2>
        <div className="w-12 h-1 mb-6" style={{backgroundColor: '#2563eb'}}></div>
        <ul className="space-y-6">
          <li className="p-6 rounded-xl shadow-sm" style={{border: '1px solid #e5e7eb'}}>
            <p className="text-sm mb-1" style={{color: '#9ca3af'}}>2026년 5월 8일</p>
            <h3 className="text-xl font-semibold mb-2">
              <a href="/blog/first-post" style={{color: '#2563eb'}}>
                첫 번째 블로그 글
              </a>
            </h3>
            <p style={{color: '#4b5563'}}>블로그를 시작하며 첫 번째 글을 작성합니다.</p>
          </li>
          <li className="p-6 rounded-xl shadow-sm" style={{border: '1px solid #e5e7eb'}}>
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