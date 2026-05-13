"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function EditForm() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug") || "";
  const router = useRouter();

  const [slug] = useState(slugParam);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("일상");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageSize, setImageSize] = useState("100");
  const [imageAlign, setImageAlign] = useState("center");

  useEffect(() => {
    if (slugParam) handleLoad(slugParam);
  }, [slugParam]);

  const handleLoad = async (s?: string) => {
    const targetSlug = s || slug;
    if (!targetSlug) {
      setMessage("❌ URL 주소를 입력하세요");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${targetSlug}`);
      const data = await res.json();

      if (data.error) {
        setMessage(`❌ ${data.error}`);
        return;
      }

      setTitle(data.title);
      setCategory(data.category);
      setDescription(data.description);
      setContent(data.content);
      setDate(data.date);
      setLoaded(true);
      setMessage("✅ 글을 불러왔습니다. 수정 후 저장하세요.");
    } catch {
      setMessage("❌ 글 불러오기 실패");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        let alignTag = "";
        if (imageAlign === "center") {
          alignTag = `<div style={{textAlign:'center'}}>\n<img src="${data.url}" width="${imageSize}%" />\n</div>`;
        } else if (imageAlign === "left") {
          alignTag = `<div style={{textAlign:'left'}}>\n<img src="${data.url}" width="${imageSize}%" />\n</div>`;
        } else {
          alignTag = `<div style={{textAlign:'right'}}>\n<img src="${data.url}" width="${imageSize}%" />\n</div>`;
        }
        setContent(content + `\n${alignTag}\n`);
        setMessage("✅ 사진이 추가되었습니다");
      }
    } catch {
      setMessage("❌ 사진 업로드 실패");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!title || !slug || !content) {
      setMessage("❌ 필수 항목을 모두 입력하세요");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, category, description, content, slug }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setMessage("❌ 로그인이 필요합니다");
        router.push("/admin/login");
        return;
      }
      if (data.success) {
        setMessage("✅ 글이 수정되었습니다!");
      } else {
        setMessage(`❌ ${data.error ?? "저장 실패"}`);
      }
    } catch {
      setMessage("❌ 저장 실패");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "12px",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-4">
        <a href="/admin" style={{ color: "#2563eb", fontSize: "14px" }}>
          ← 관리자 페이지로
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-6" style={{ color: "#1e3a8a" }}>
        글 수정
      </h1>

      {loaded && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="일상">일상</option>
              <option value="여행">여행</option>
              <option value="한국 & 아제르바이잔">한국 & 아제르바이잔</option>
              <option value="컴퓨터">컴퓨터</option>
              <option value="신과 자연">신과 자연</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">한 줄 요약</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div
            className="mb-4 p-4 rounded-lg"
            style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
          >
            <label className="block text-sm font-semibold mb-3">📷 사진 추가</label>
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: "#4b5563" }}>
                크기: {imageSize}%
              </label>
              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: "#4b5563" }}>
                위치
              </label>
              <div className="flex gap-2">
                {["left", "center", "right"].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setImageAlign(pos)}
                    style={{
                      backgroundColor: imageAlign === pos ? "#2563eb" : "#ffffff",
                      color: imageAlign === pos ? "#ffffff" : "#4b5563",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {pos === "left" ? "왼쪽" : pos === "center" ? "중앙" : "오른쪽"}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ fontSize: "14px" }}
            />
            {uploading && (
              <span className="ml-2 text-sm" style={{ color: "#2563eb" }}>
                업로드 중...
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              본문 (마크다운)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              style={{ ...inputStyle, fontFamily: "monospace", fontSize: "13px" }}
            />
          </div>

          <button
            onClick={handleSubmit}
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
            수정 저장하기
          </button>
        </>
      )}

      {message && (
        <p
          className="mt-4 text-sm"
          style={{ color: message.startsWith("✅") ? "#059669" : "#dc2626" }}
        >
          {message}
        </p>
      )}
    </main>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <EditForm />
    </Suspense>
  );
}
