"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/lib/supabase";

const categories = ['전체', '일상', '여행', '한국 & 아제르바이잔', '컴퓨터', '신과 자연'];

const emojiMap: { [key: string]: string } = {
  '일상': '✍️',
  '여행': '✈️',
  '한국 & 아제르바이잔': '🌏',
  '컴퓨터': '💻',
  '신과 자연': '🌿',
};

export default function BlogList({ posts, initialCategory }: { posts: Post[]; initialCategory?: string }) {
  const [selected, setSelected] = useState(
    initialCategory && categories.includes(initialCategory) ? initialCategory : '전체'
  );

  const filtered = selected === '전체'
    ? posts
    : posts.filter((p) => p.category === selected);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8">
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
            <li key={post.slug} className="p-6 rounded-xl shadow-sm" style={{border: '1px solid #e5e7eb'}}>
              <p className="text-sm mb-2" style={{color: '#9ca3af'}}>{post.date}</p>
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} style={{color: '#2563eb'}}>
                  {emojiMap[post.category] || '📝'} {post.title}
                </Link>
              </h2>
              <p className="mb-4" style={{color: '#4b5563', fontSize: '15px'}}>{post.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full" style={{backgroundColor: '#eff6ff', color: '#2563eb'}}>
                  {post.category}
                </span>
                <Link href={`/blog/${post.slug}`} className="text-sm font-semibold" style={{color: '#2563eb'}}>
                  더 읽기 →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}