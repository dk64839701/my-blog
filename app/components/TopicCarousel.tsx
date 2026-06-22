"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const topics = [
  {
    title: '여행',
    category: '여행',
    description: '세상 곳곳의 아름다운 이야기',
    emoji: '✈️',
    images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'],
  },
  {
    title: '한국 & 아제르바이잔',
    category: '한국 & 아제르바이잔',
    description: '두 나라의 언어와 문화',
    emoji: '🌏',
    images: [
      'https://images.unsplash.com/photo-1591273688202-4cfb3531c7a0?w=800&q=80',
      'https://images.unsplash.com/photo-1674857977971-131936c7b5ea?w=800&q=80',
    ],
  },
  {
    title: '컴퓨터',
    category: '컴퓨터',
    description: '기술과 개발 이야기',
    emoji: '💻',
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80'],
  },
  {
    title: '신과 자연',
    category: '신과 자연',
    description: '신과 자연과의 관계',
    emoji: '🌿',
    images: ['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80'],
  },
];

export default function TopicCarousel() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % topics.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + topics.length) % topics.length);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, [autoPlay, next]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoPlay(false);
    prev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoPlay(false);
    next();
  };

  const topic = topics[current];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-lg cursor-pointer select-none"
      style={{ height: '420px' }}
      onClick={() => router.push(`/blog?category=${encodeURIComponent(topic.category)}`)}
    >
      {/* 배경 이미지 */}
      {topic.images.length === 2 ? (
        <div className="flex w-full h-full">
          <img src={topic.images[0]} alt="한국" className="w-1/2 h-full object-cover" />
          <img src={topic.images[1]} alt="아제르바이잔" className="w-1/2 h-full object-cover" />
        </div>
      ) : (
        <img src={topic.images[0]} alt={topic.title} className="w-full h-full object-cover" />
      )}

      {/* 그라디언트 오버레이 */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }}
      />

      {/* 제목/설명 */}
      <div className="absolute bottom-0 left-0 p-8">
        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow">
          {topic.emoji} {topic.title}
        </h2>
        <p className="text-lg drop-shadow" style={{ color: '#e5e7eb' }}>
          {topic.description}
        </p>
        <p className="mt-3 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          글 목록 보기 →
        </p>
      </div>

      {/* 왼쪽 화살표 */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all"
        style={{
          width: '48px',
          height: '48px',
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(4px)',
          color: 'white',
          fontSize: '28px',
          lineHeight: 1,
          border: '1px solid rgba(255,255,255,0.3)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.5)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
        aria-label="이전"
      >
        ‹
      </button>

      {/* 오른쪽 화살표 */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all"
        style={{
          width: '48px',
          height: '48px',
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(4px)',
          color: 'white',
          fontSize: '28px',
          lineHeight: 1,
          border: '1px solid rgba(255,255,255,0.3)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.5)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
        aria-label="다음"
      >
        ›
      </button>

      {/* 인디케이터 도트 */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {topics.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: i === current ? '20px' : '8px',
              height: '8px',
              backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>

      {/* 자동재생 상태 표시 */}
      {!autoPlay && (
        <div
          className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)' }}
        >
          수동 전환 중
        </div>
      )}
    </div>
  );
}
