"use client";

import { useState } from "react";

const posts = [
  {
    date: '2026년 5월 8일',
    title: '첫 번째 블로그 글',
    description: '블로그를 시작하며 첫 번째 글을 작성합니다.',
    href: '/blog/first-post',
    emoji: '✍️',
    category: '일상',
  },
  {
    date: '2026년 5월 7일',
    title: 'WSL2 개발환경 구축기',
    description: '윈도우에서 리눅스 개발환경을 만들어 보았습니다.',
    href: '/blog/wsl2-setup',
    emoji: '💻',
    category: '컴퓨터',
  },
];

const categories = ['전체', '일상', '여행', '한국 & 아제르바이잔', '컴퓨터', '신과 자연'];

export default function BlogPage() {
  const [selected, setSelected] = useState('전체');

  const filtered = selected === '전체'
    ? posts
    : posts.filter((p) => p.category === selected);

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            style={{
              backgroundColor: selected === cat ? '#2563eb' : '#f3f4f6',
              color: selected === cat ? '#ffffff' : '#4b5563',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '14px',
              fontWeight: selected === cat ? '600' : '400',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{color: '#9ca3af'}}>아직 이 주제의 글이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((post) => (
            <li key={post.href} className="p-6 rounded-xl shadow-sm" style={{border: '1px solid #e5e7eb'}}>
              <p className="text-sm mb-2" style={{color: '#9ca3af'}}>{post.date}</p>
              <h2 className="text-2xl font-semibold mb-3">
                <a href={post.href} style={{color: '#2563eb'}}>
                  {post.emoji} {post.title}
                </a>
              </h2>
              <p style={{color: '#4b5563'}}>{post.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full" style={{backgroundColor: '#eff6ff', color: '#2563eb'}}>
                  {post.category}
                </span>
                <a href={post.href} className="text-sm font-semibold" style={{color: '#2563eb'}}>
                  더 읽기 →
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}