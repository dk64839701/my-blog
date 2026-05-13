"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
};

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`"${title}" 글을 정말 삭제하시겠습니까?`)) return;

    setDeletingSlug(slug);
    setMessage("");

    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        setMessage("✅ 삭제되었습니다");
      } else {
        setMessage(`❌ ${data.error ?? "삭제 실패"}`);
      }
    } catch {
      setMessage("❌ 삭제 실패");
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
          관리자 페이지
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f3f4f6",
            color: "#4b5563",
            border: "none",
            borderRadius: "6px",
            padding: "7px 16px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          로그아웃
        </button>
      </div>

      <div className="mb-8">
        <button
          onClick={() => router.push("/admin/write")}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ✏️ 새 글 작성
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4" style={{ color: "#1e3a8a" }}>
        글 목록
      </h2>

      {message && (
        <p
          className="mb-4 text-sm"
          style={{ color: message.startsWith("✅") ? "#059669" : "#dc2626" }}
        >
          {message}
        </p>
      )}

      {loading ? (
        <p style={{ color: "#9ca3af" }}>불러오는 중...</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="p-4 rounded-xl flex justify-between items-center"
              style={{ border: "1px solid #e5e7eb" }}
            >
              <div>
                <p className="font-semibold" style={{ color: "#1e3a8a" }}>
                  {post.title}
                </p>
                <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                  {post.date} · {post.category}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/edit?slug=${post.slug}`)}
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#4b5563",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(post.slug, post.title)}
                  disabled={deletingSlug === post.slug}
                  style={{
                    backgroundColor:
                      deletingSlug === post.slug ? "#f9a8a8" : "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    fontSize: "13px",
                    cursor:
                      deletingSlug === post.slug ? "not-allowed" : "pointer",
                  }}
                >
                  {deletingSlug === post.slug ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
