"use client";

import { useState, useEffect, useRef } from "react";

const tracks = [
  "https://res.cloudinary.com/dkkng85jk/video/upload/v1778415637/Beneath_the_Bamboo_Canopy_whmxtb.mp3",
  "https://res.cloudinary.com/dkkng85jk/video/upload/v1778415637/Where_the_Water_Rests_yoqqlf.mp3",
];

let globalAudio: HTMLAudioElement | null = null;
let globalIndex = 0;
let globalPlaying = false;

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!globalAudio) {
      globalAudio = new Audio(tracks[globalIndex]);
      globalAudio.addEventListener("ended", () => {
        globalIndex = (globalIndex + 1) % tracks.length;
        if (globalAudio) {
          globalAudio.src = tracks[globalIndex];
          globalAudio.play();
        }
        forceUpdate((n) => n + 1);
      });
    }

    setIsPlaying(globalPlaying);
  }, []);

  const togglePlay = () => {
    if (!globalAudio) return;
    if (globalPlaying) {
      globalAudio.pause();
      globalPlaying = false;
    } else {
      globalAudio.play();
      globalPlaying = true;
    }
    setIsPlaying(globalPlaying);
  };

  return (
    <div className="flex items-center gap-2">
      <span style={{fontSize: '11px', color: '#6b7280'}}>🎵</span>
      <button
        onClick={togglePlay}
        title={isPlaying ? '음악 정지' : '음악 재생'}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
    </div>
  );
}