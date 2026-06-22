"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error ?? "로그인 실패");
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ backgroundColor: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
      >
        <h1
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: "#1e3a8a" }}
        >
          관리자 로그인
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: "#9ca3af" }}>
          친사's Blog
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#374151" }}>
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "#374151" }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#dc2626" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "11px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </main>
  );
}
