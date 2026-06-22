"use client";

import { useState, useEffect, useRef } from "react";

const TRACKS = [
  "https://res.cloudinary.com/dkkng85jk/video/upload/v1778415637/Beneath_the_Bamboo_Canopy_whmxtb.mp3",
  "https://res.cloudinary.com/dkkng85jk/video/upload/v1778415637/Where_the_Water_Rests_yoqqlf.mp3",
];

const STORAGE_KEY = "bg-music-stopped";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);
  const userStoppedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 사용자가 이전에 명시적으로 정지했으면 자동재생하지 않음
    userStoppedRef.current = localStorage.getItem(STORAGE_KEY) === "true";
    if (userStoppedRef.current) return;

    const audio = new Audio(TRACKS[0]);
    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      trackIndexRef.current = (trackIndexRef.current + 1) % TRACKS.length;
      audio.src = TRACKS[trackIndexRef.current];
      audio.play().catch(() => {});
    });

    // 자동재생 시도
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // 브라우저 정책으로 자동재생 차단됨 — 첫 사용자 상호작용 시 재생
        const startOnFirstInteraction = () => {
          if (!userStoppedRef.current && audio.paused) {
            audio
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }
          document.removeEventListener("click", startOnFirstInteraction, true);
          document.removeEventListener("keydown", startOnFirstInteraction, true);
        };
        document.addEventListener("click", startOnFirstInteraction, true);
        document.addEventListener("keydown", startOnFirstInteraction, true);
      });
  }, []);

  const toggle = () => {
    // 오디오가 아직 생성되지 않은 경우 (userStopped 상태로 시작한 경우)
    if (!audioRef.current) {
      const audio = new Audio(TRACKS[trackIndexRef.current]);
      audioRef.current = audio;
      audio.addEventListener("ended", () => {
        trackIndexRef.current = (trackIndexRef.current + 1) % TRACKS.length;
        audio.src = TRACKS[trackIndexRef.current];
        audio.play().catch(() => {});
      });
    }

    const audio = audioRef.current!;

    if (isPlaying) {
      audio.pause();
      userStoppedRef.current = true;
      localStorage.setItem(STORAGE_KEY, "true");
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          userStoppedRef.current = false;
          localStorage.setItem(STORAGE_KEY, "false");
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: "11px", color: "#6b7280" }}>🎵</span>
      <button
        onClick={toggle}
        title={isPlaying ? "음악 정지" : "음악 재생"}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
    </div>
  );
}
