"use client";

import { useState, useEffect } from "react";

const TRACKS = [
  "https://res.cloudinary.com/dkkng85jk/video/upload/v1778415637/Beneath_the_Bamboo_Canopy_whmxtb.mp3",
  "https://res.cloudinary.com/dkkng85jk/video/upload/v1778415637/Where_the_Water_Rests_yoqqlf.mp3",
];

// 모듈 레벨: 같은 탭 내 페이지 이동 시 유지, 탭 닫으면 초기화
let sharedAudio: HTMLAudioElement | null = null;
let sharedTrackIndex = 0;
let sharedUserStopped = false;

function createAudio(onEnded: () => void): HTMLAudioElement {
  const audio = new Audio(TRACKS[sharedTrackIndex]);
  audio.addEventListener("ended", onEnded);
  return audio;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (sharedUserStopped) {
      setIsPlaying(false);
      return;
    }

    const onEnded = () => {
      sharedTrackIndex = (sharedTrackIndex + 1) % TRACKS.length;
      if (sharedAudio) {
        sharedAudio.src = TRACKS[sharedTrackIndex];
        sharedAudio.play().catch(() => {});
      }
    };

    if (!sharedAudio) {
      sharedAudio = createAudio(onEnded);

      sharedAudio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // 브라우저 자동재생 차단 시 첫 번째 사용자 상호작용에서 재생
          const startOnFirstInteraction = () => {
            if (!sharedUserStopped && sharedAudio?.paused) {
              sharedAudio.play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
            }
            document.removeEventListener("click", startOnFirstInteraction, true);
            document.removeEventListener("keydown", startOnFirstInteraction, true);
          };
          document.addEventListener("click", startOnFirstInteraction, true);
          document.addEventListener("keydown", startOnFirstInteraction, true);
        });
    } else {
      // 레이아웃이 유지되므로 실제로 여기 도달하지 않지만 방어 코드
      setIsPlaying(!sharedAudio.paused);
    }
  }, []);

  const toggle = () => {
    const onEnded = () => {
      sharedTrackIndex = (sharedTrackIndex + 1) % TRACKS.length;
      if (sharedAudio) {
        sharedAudio.src = TRACKS[sharedTrackIndex];
        sharedAudio.play().catch(() => {});
      }
    };

    if (!sharedAudio) {
      sharedAudio = createAudio(onEnded);
    }

    if (isPlaying) {
      sharedAudio.pause();
      sharedUserStopped = true;
      setIsPlaying(false);
    } else {
      sharedAudio.play()
        .then(() => {
          sharedUserStopped = false;
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
