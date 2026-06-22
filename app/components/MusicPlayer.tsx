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
  // 자동재생이 차단되어 첫 터치/클릭을 기다리는 상태
  const [waitingForTouch, setWaitingForTouch] = useState(false);

  useEffect(() => {
    if (sharedUserStopped) return;

    if (!sharedAudio) {
      sharedAudio = createAudio();
    }
    const audio = sharedAudio;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        // 모바일 포함 자동재생 차단 시: 첫 터치 또는 클릭에서 재생
        setWaitingForTouch(true);

        let started = false;
        const startMusic = () => {
          if (started || sharedUserStopped) return;
          started = true;
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              setWaitingForTouch(false);
            })
            .catch(() => {});
        };

        // touchstart: 모바일에서 가장 먼저 발생하는 이벤트
        // click: 데스크탑 및 모바일 탭 동작
        document.addEventListener("touchstart", startMusic, {
          once: true,
          passive: true,
          capture: true,
        });
        document.addEventListener("click", startMusic, {
          once: true,
          capture: true,
        });
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
      setWaitingForTouch(false);
    } else {
      audio
        .play()
        .then(() => {
          sharedUserStopped = false;
          setIsPlaying(true);
          setWaitingForTouch(false);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={waitingForTouch ? "animate-pulse" : ""}
        style={{ fontSize: "13px" }}
        title={waitingForTouch ? "화면을 터치하면 음악이 시작됩니다" : ""}
      >
        🎵
      </span>
      <button
        onClick={toggle}
        title={isPlaying ? "음악 정지" : "음악 재생"}
        className={waitingForTouch ? "animate-pulse" : ""}
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
