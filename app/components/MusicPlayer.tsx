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

function createAudio(): HTMLAudioElement {
  const audio = new Audio(TRACKS[sharedTrackIndex]);
  audio.addEventListener("ended", () => {
    sharedTrackIndex = (sharedTrackIndex + 1) % TRACKS.length;
    if (sharedAudio) {
      sharedAudio.src = TRACKS[sharedTrackIndex];
      sharedAudio.play().catch(() => {});
    }
  });
  return audio;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (sharedUserStopped) return;

    if (!sharedAudio) {
      sharedAudio = createAudio();
    }
    const audio = sharedAudio;

    // 자동재생 시도
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // 자동재생 차단됨 — 페이지의 첫 번째 click 이벤트에서 재생 시도
        // (버블 방식: 버튼 클릭 시에는 toggle()이 먼저 처리하고 이 리스너는 정리만 함)
        const startOnFirstClick = () => {
          if (sharedUserStopped || !audio.paused) {
            document.removeEventListener("click", startOnFirstClick);
            return;
          }
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              document.removeEventListener("click", startOnFirstClick);
            })
            .catch(() => {
              // 이 click에서도 실패하면 다음 click에서 재시도
            });
        };
        document.addEventListener("click", startOnFirstClick);
      });
  }, []);

  const toggle = () => {
    if (!sharedAudio) {
      sharedAudio = createAudio();
    }
    const audio = sharedAudio;

    if (isPlaying) {
      audio.pause();
      sharedUserStopped = true;
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          sharedUserStopped = false;
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: "13px", color: isPlaying ? "#6b7280" : "#d1d5db" }}>
        🎵
      </span>
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
