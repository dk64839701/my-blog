"use client";

import { useState } from "react";

const TRACKS = [
  "https://res.cloudinary.com/dkkng85jk/video/upload/v1778415637/Beneath_the_Bamboo_Canopy_whmxtb.mp3",
  "https://res.cloudinary.com/dkkng85jk/video/upload/v1778415637/Where_the_Water_Rests_yoqqlf.mp3",
];

// 모듈 레벨: 같은 탭 내 페이지 이동 시 유지, 탭 닫으면 초기화
let sharedAudio: HTMLAudioElement | null = null;
let sharedTrackIndex = 0;

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
  const [isPlaying, setIsPlaying] = useState(() => Boolean(sharedAudio && !sharedAudio.paused));

  const toggle = () => {
    if (!sharedAudio) {
      sharedAudio = createAudio();
    }
    const audio = sharedAudio;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
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
