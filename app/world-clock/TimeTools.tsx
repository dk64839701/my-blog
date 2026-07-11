"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WorldClock from "./WorldClock";

type Tool = "clock" | "alarm" | "timer" | "stopwatch";

type Alarm = {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  lastTriggeredDate?: string;
};

type Lap = {
  id: string;
  elapsedMs: number;
};

type NotificationSettings = {
  sound: boolean;
  screen: boolean;
};

const ALARM_STORAGE_KEY = "world-clock-alarms";
const ALARM_NOTIFICATION_STORAGE_KEY = "world-clock-alarm-notifications";
const TIMER_NOTIFICATION_STORAGE_KEY = "world-clock-timer-notifications";
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  sound: true,
  screen: true,
};
const TOOL_ITEMS: { id: Tool; label: string }[] = [
  { id: "clock", label: "세계시간" },
  { id: "alarm", label: "알람" },
  { id: "timer", label: "타이머" },
  { id: "stopwatch", label: "스톱워치" },
];

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatStopwatch(ms: number) {
  const totalCentiseconds = Math.floor(ms / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getTimeKey(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function isAlarm(value: unknown): value is Alarm {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.time === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.enabled === "boolean" &&
    (candidate.lastTriggeredDate === undefined || typeof candidate.lastTriggeredDate === "string")
  );
}

function readStoredAlarms() {
  try {
    const storedAlarms = window.localStorage.getItem(ALARM_STORAGE_KEY);
    if (!storedAlarms) {
      return [];
    }

    const parsedAlarms: unknown = JSON.parse(storedAlarms);
    return Array.isArray(parsedAlarms) && parsedAlarms.every(isAlarm) ? parsedAlarms : [];
  } catch {
    return [];
  }
}

function isNotificationSettings(value: unknown): value is NotificationSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.sound === "boolean" && typeof candidate.screen === "boolean";
}

function readStoredNotificationSettings(storageKey: string) {
  try {
    const storedSettings = window.localStorage.getItem(storageKey);
    if (!storedSettings) {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }

    const parsedSettings: unknown = JSON.parse(storedSettings);
    return isNotificationSettings(parsedSettings) ? parsedSettings : DEFAULT_NOTIFICATION_SETTINGS;
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

function NotificationSettingsControls({
  settings,
  onChange,
}: {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl p-4" style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
      {[
        { key: "sound" as const, label: "소리 알림" },
        { key: "screen" as const, label: "화면 알림" },
      ].map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange({ ...settings, [item.key]: !settings[item.key] })}
          className="rounded-lg px-4 py-2 text-sm font-semibold"
          style={{
            backgroundColor: settings[item.key] ? "#eff6ff" : "#f9fafb",
            border: `1px solid ${settings[item.key] ? "#bfdbfe" : "#e5e7eb"}`,
            color: settings[item.key] ? "#2563eb" : "#6b7280",
          }}
        >
          {item.label} {settings[item.key] ? "켜짐" : "꺼짐"}
        </button>
      ))}
    </div>
  );
}

function usePersistentBeep(isActive: boolean) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    playBeep();
    const timer = window.setInterval(() => {
      playBeep();
    }, 1200);

    return () => window.clearInterval(timer);
  }, [isActive]);
}

function useFlashingTitle(isActive: boolean, message: string) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const originalTitle = document.title;
    let showMessage = true;
    document.title = message;

    const timer = window.setInterval(() => {
      showMessage = !showMessage;
      document.title = showMessage ? message : originalTitle;
    }, 900);

    return () => {
      window.clearInterval(timer);
      document.title = originalTitle;
    };
  }, [isActive, message]);
}

function NotificationBanner({
  title,
  detail,
  screenEnabled,
  onConfirm,
}: {
  title: string;
  detail: string;
  screenEnabled: boolean;
  onConfirm: () => void;
}) {
  return (
    <div
      className={screenEnabled ? "sticky top-3 z-10 rounded-xl p-4 shadow-lg" : "rounded-xl p-4"}
      style={{
        border: screenEnabled ? "2px solid #2563eb" : "1px solid #e5e7eb",
        backgroundColor: screenEnabled ? "#eff6ff" : "#ffffff",
      }}
    >
      <p className="text-sm font-semibold" style={{ color: screenEnabled ? "#1d4ed8" : "#6b7280" }}>
        {title}
      </p>
      <p className="mt-1 text-xl font-bold" style={{ color: "#111827" }}>
        {detail}
      </p>
      <button
        type="button"
        onClick={onConfirm}
        className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold"
        style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
      >
        확인
      </button>
    </div>
  );
}

function playBeep() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.7);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.75);
  } catch {
    // Some browsers block audio until the user interacts with the page.
  }
}

function AlarmTool() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [alarmTime, setAlarmTime] = useState("07:00");
  const [alarmLabel, setAlarmLabel] = useState("");
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const shouldShowAlarmNotification = Boolean(triggeredAlarm);

  usePersistentBeep(shouldShowAlarmNotification && notificationSettings.sound);
  useFlashingTitle(shouldShowAlarmNotification && notificationSettings.screen, "● 알람 시간이 되었습니다");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAlarms(readStoredAlarms());
      setNotificationSettings(readStoredNotificationSettings(ALARM_NOTIFICATION_STORAGE_KEY));
      setIsStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    window.localStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));
    window.localStorage.setItem(ALARM_NOTIFICATION_STORAGE_KEY, JSON.stringify(notificationSettings));
  }, [alarms, isStorageReady, notificationSettings]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = new Date();
      const today = getDateKey(now);
      const currentTime = getTimeKey(now);

      setAlarms((currentAlarms) =>
        currentAlarms.map((alarm) => {
          if (!alarm.enabled || alarm.time !== currentTime || alarm.lastTriggeredDate === today) {
            return alarm;
          }

          const triggered = { ...alarm, lastTriggeredDate: today };
          setTriggeredAlarm(triggered);
          return triggered;
        })
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [notificationSettings]);

  const sortedAlarms = useMemo(() => {
    return [...alarms].sort((firstAlarm, secondAlarm) => firstAlarm.time.localeCompare(secondAlarm.time));
  }, [alarms]);

  const handleAddAlarm = () => {
    setAlarms((currentAlarms) => [
      ...currentAlarms,
      {
        id: crypto.randomUUID(),
        time: alarmTime,
        label: alarmLabel.trim() || "알람",
        enabled: true,
      },
    ]);
    setAlarmLabel("");
  };

  return (
    <section className="space-y-5">
      <NotificationSettingsControls settings={notificationSettings} onChange={setNotificationSettings} />

      {triggeredAlarm ? (
        <NotificationBanner
          title="알람 시간이 되었습니다"
          detail={`${triggeredAlarm.time} · ${triggeredAlarm.label}`}
          screenEnabled={notificationSettings.screen}
          onConfirm={() => setTriggeredAlarm(null)}
        />
      ) : null}

      <div className="grid gap-3 rounded-xl p-4 sm:grid-cols-[140px_minmax(0,1fr)_auto]" style={{ border: "1px solid #e5e7eb" }}>
        <input
          type="time"
          value={alarmTime}
          onChange={(event) => setAlarmTime(event.target.value)}
          className="h-11 rounded-lg px-3 text-sm"
          style={{ border: "1px solid #d1d5db" }}
        />
        <input
          type="text"
          value={alarmLabel}
          onChange={(event) => setAlarmLabel(event.target.value)}
          placeholder="알람 이름"
          className="h-11 rounded-lg px-3 text-sm"
          style={{ border: "1px solid #d1d5db" }}
        />
        <button
          type="button"
          onClick={handleAddAlarm}
          className="h-11 whitespace-nowrap rounded-lg px-5 text-sm font-semibold"
          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
        >
          알람 추가
        </button>
      </div>

      <div className="space-y-3">
        {sortedAlarms.length === 0 ? (
          <p className="rounded-xl p-5 text-center text-sm" style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}>
            설정된 알람이 없습니다.
          </p>
        ) : (
          sortedAlarms.map((alarm) => (
            <article key={alarm.id} className="flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between" style={{ border: "1px solid #e5e7eb" }}>
              <div>
                <p className="text-2xl font-bold tabular-nums" style={{ color: "#111827" }}>
                  {alarm.time}
                </p>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  {alarm.label}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAlarms((currentAlarms) => currentAlarms.map((item) => (item.id === alarm.id ? { ...item, enabled: !item.enabled } : item)))}
                  className="rounded-lg px-4 py-2 text-sm font-semibold"
                  style={{ border: "1px solid #d1d5db", color: alarm.enabled ? "#2563eb" : "#6b7280" }}
                >
                  {alarm.enabled ? "켜짐" : "꺼짐"}
                </button>
                <button
                  type="button"
                  onClick={() => setAlarms((currentAlarms) => currentAlarms.filter((item) => item.id !== alarm.id))}
                  className="rounded-lg px-4 py-2 text-sm font-semibold"
                  style={{ border: "1px solid #fecaca", color: "#b91c1c" }}
                >
                  삭제
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function TimerTool() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const shouldShowTimerNotification = isFinished;

  usePersistentBeep(shouldShowTimerNotification && notificationSettings.sound);
  useFlashingTitle(shouldShowTimerNotification && notificationSettings.screen, "● 타이머가 끝났습니다");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNotificationSettings(readStoredNotificationSettings(TIMER_NOTIFICATION_STORAGE_KEY));
      setIsStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    window.localStorage.setItem(TIMER_NOTIFICATION_STORAGE_KEY, JSON.stringify(notificationSettings));
  }, [isStorageReady, notificationSettings]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, notificationSettings]);

  const configuredSeconds = hours * 3600 + minutes * 60 + seconds;

  const handleApply = () => {
    setRemainingSeconds(configuredSeconds);
    setIsFinished(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemainingSeconds(configuredSeconds);
  };

  return (
    <section className="space-y-5">
      <NotificationSettingsControls settings={notificationSettings} onChange={setNotificationSettings} />

      {isFinished ? (
        <NotificationBanner
          title="타이머가 끝났습니다"
          detail={formatDuration(configuredSeconds)}
          screenEnabled={notificationSettings.screen}
          onConfirm={() => setIsFinished(false)}
        />
      ) : null}

      <div className="rounded-xl p-6 text-center" style={{ border: "1px solid #e5e7eb" }}>
        <p className="text-5xl font-bold tabular-nums" style={{ color: "#111827" }}>
          {formatDuration(remainingSeconds)}
        </p>
      </div>

      <div className="grid gap-3 rounded-xl p-4 sm:grid-cols-3" style={{ border: "1px solid #e5e7eb" }}>
        {[
          { label: "시", value: hours, setter: setHours, max: 23 },
          { label: "분", value: minutes, setter: setMinutes, max: 59 },
          { label: "초", value: seconds, setter: setSeconds, max: 59 },
        ].map((field) => (
          <label key={field.label} className="text-sm font-semibold" style={{ color: "#374151" }}>
            {field.label}
            <input
              type="number"
              min={0}
              max={field.max}
              value={field.value}
              onChange={(event) => field.setter(Math.min(field.max, Math.max(0, Number(event.target.value))))}
              className="mt-2 h-11 w-full rounded-lg px-3 text-sm"
              style={{ border: "1px solid #d1d5db" }}
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={handleApply} className="rounded-lg px-5 py-2 text-sm font-semibold" style={{ border: "1px solid #d1d5db", color: "#374151" }}>
          시간 적용
        </button>
        <button
          type="button"
          onClick={() => {
            if (remainingSeconds > 0) {
              setIsRunning((currentValue) => !currentValue);
            }
          }}
          className="rounded-lg px-5 py-2 text-sm font-semibold"
          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
        >
          {isRunning ? "일시정지" : "시작"}
        </button>
        <button type="button" onClick={handleReset} className="rounded-lg px-5 py-2 text-sm font-semibold" style={{ border: "1px solid #fecaca", color: "#b91c1c" }}>
          초기화
        </button>
      </div>
    </section>
  );
}

function StopwatchTool() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      lastTickRef.current = null;
      return;
    }

    lastTickRef.current = Date.now();
    const timer = window.setInterval(() => {
      const previousTick = lastTickRef.current ?? Date.now();
      const currentTick = Date.now();
      lastTickRef.current = currentTick;
      setElapsedMs((currentElapsedMs) => currentElapsedMs + currentTick - previousTick);
    }, 50);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setElapsedMs(0);
    setLaps([]);
  };

  return (
    <section className="space-y-5">
      <div className="rounded-xl p-6 text-center" style={{ border: "1px solid #e5e7eb" }}>
        <p className="text-4xl font-bold tabular-nums sm:text-5xl" style={{ color: "#111827" }}>
          {formatStopwatch(elapsedMs)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setIsRunning((currentValue) => !currentValue)} className="rounded-lg px-5 py-2 text-sm font-semibold" style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
          {isRunning ? "정지" : "시작"}
        </button>
        <button
          type="button"
          onClick={() => setLaps((currentLaps) => [{ id: crypto.randomUUID(), elapsedMs }, ...currentLaps])}
          disabled={elapsedMs === 0}
          className="rounded-lg px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          style={{ border: "1px solid #d1d5db", color: "#374151" }}
        >
          랩
        </button>
        <button type="button" onClick={handleReset} className="rounded-lg px-5 py-2 text-sm font-semibold" style={{ border: "1px solid #fecaca", color: "#b91c1c" }}>
          초기화
        </button>
      </div>

      <div className="space-y-2">
        {laps.length === 0 ? (
          <p className="rounded-xl p-5 text-center text-sm" style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}>
            기록된 랩이 없습니다.
          </p>
        ) : (
          laps.map((lap, index) => (
            <div key={lap.id} className="flex items-center justify-between rounded-xl p-4" style={{ border: "1px solid #e5e7eb" }}>
              <span className="text-sm font-semibold" style={{ color: "#4b5563" }}>
                랩 {laps.length - index}
              </span>
              <span className="font-mono text-sm font-semibold" style={{ color: "#111827" }}>
                {formatStopwatch(lap.elapsedMs)}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function TimeTools() {
  const [activeTool, setActiveTool] = useState<Tool>("clock");

  return (
    <div className="space-y-6">
      <div className="grid gap-2 rounded-xl p-2 sm:grid-cols-4" style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
        {TOOL_ITEMS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setActiveTool(tool.id)}
            className="h-11 whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: activeTool === tool.id ? "#2563eb" : "#f3f4f6",
              color: activeTool === tool.id ? "#ffffff" : "#374151",
            }}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {activeTool === "clock" ? <WorldClock /> : null}
      {activeTool === "alarm" ? <AlarmTool /> : null}
      {activeTool === "timer" ? <TimerTool /> : null}
      {activeTool === "stopwatch" ? <StopwatchTool /> : null}
    </div>
  );
}
