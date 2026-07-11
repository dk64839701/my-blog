"use client";

import { useEffect, useMemo, useState } from "react";

type TimeFormat = "24" | "12";

type CityClock = {
  city: string;
  country: string;
  timeZone: string;
  note: string;
};

const CLOCK_STORAGE_KEY = "world-clock-clocks";

const DEFAULT_CLOCKS: CityClock[] = [
  {
    city: "서울",
    country: "대한민국",
    timeZone: "Asia/Seoul",
    note: "한국 표준시",
  },
  {
    city: "뉴욕",
    country: "미국",
    timeZone: "America/New_York",
    note: "미 동부 시간",
  },
  {
    city: "로스앤젤레스",
    country: "미국",
    timeZone: "America/Los_Angeles",
    note: "미 서부 시간",
  },
  {
    city: "런던",
    country: "영국",
    timeZone: "Europe/London",
    note: "영국 현지 시간",
  },
  {
    city: "이스탄불",
    country: "튀르키예",
    timeZone: "Europe/Istanbul",
    note: "튀르키예 시간",
  },
  {
    city: "바쿠",
    country: "아제르바이잔",
    timeZone: "Asia/Baku",
    note: "아제르바이잔 시간",
  },
];

const FALLBACK_TIME_ZONES = [
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Dubai",
  "Europe/Paris",
  "Europe/Berlin",
  "America/Toronto",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Australia/Sydney",
];

function getSupportedTimeZones() {
  if (typeof Intl.supportedValuesOf === "function") {
    return Intl.supportedValuesOf("timeZone");
  }

  return FALLBACK_TIME_ZONES;
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatTimeZoneCity(timeZone: string) {
  const parts = timeZone.split("/");
  const city = parts.at(-1) ?? timeZone;
  return toTitleCase(city.replaceAll("_", " "));
}

function formatTimeZoneRegion(timeZone: string) {
  const [region] = timeZone.split("/");
  return region.replaceAll("_", " ");
}

function createClockFromTimeZone(timeZone: string): CityClock {
  return {
    city: formatTimeZoneCity(timeZone),
    country: formatTimeZoneRegion(timeZone),
    timeZone,
    note: timeZone,
  };
}

function getTimeParts(date: Date, timeZone: string, timeFormat: TimeFormat) {
  const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: timeFormat === "12",
  });

  const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return {
    time: timeFormatter.format(date),
    date: dateFormatter.format(date),
  };
}

function getHour(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);

  return Number(parts.find((part) => part.type === "hour")?.value ?? 0);
}

function getTimeOfDay(hour: number) {
  if (hour >= 6 && hour < 12) {
    return { label: "아침", color: "#b45309", background: "#fffbeb" };
  }

  if (hour >= 12 && hour < 18) {
    return { label: "낮", color: "#2563eb", background: "#eff6ff" };
  }

  if (hour >= 18 && hour < 22) {
    return { label: "저녁", color: "#7c3aed", background: "#f5f3ff" };
  }

  return { label: "밤", color: "#475569", background: "#f8fafc" };
}

function moveClock(clocks: CityClock[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= clocks.length) {
    return clocks;
  }

  const nextClocks = [...clocks];
  const [selectedClock] = nextClocks.splice(fromIndex, 1);
  nextClocks.splice(toIndex, 0, selectedClock);
  return nextClocks;
}

function isCityClock(value: unknown): value is CityClock {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.city === "string" &&
    typeof candidate.country === "string" &&
    typeof candidate.timeZone === "string" &&
    typeof candidate.note === "string"
  );
}

function readStoredClocks() {
  try {
    const storedClocks = window.localStorage.getItem(CLOCK_STORAGE_KEY);
    if (!storedClocks) {
      return null;
    }

    const parsedClocks: unknown = JSON.parse(storedClocks);
    if (!Array.isArray(parsedClocks) || !parsedClocks.every(isCityClock)) {
      return null;
    }

    return parsedClocks;
  } catch {
    return null;
  }
}

export default function WorldClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [localTimeZone, setLocalTimeZone] = useState("로컬 시간");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("24");
  const [clocks, setClocks] = useState<CityClock[]>(DEFAULT_CLOCKS);
  const [addableClocks, setAddableClocks] = useState<CityClock[]>([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      const storedClocks = readStoredClocks();
      setLocalTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
      setAddableClocks(
        getSupportedTimeZones()
          .map(createClockFromTimeZone)
          .sort((firstClock, secondClock) => firstClock.city.localeCompare(secondClock.city))
      );
      if (storedClocks) {
        setClocks(storedClocks);
      }
      setIsStorageReady(true);
      setNow(new Date());
    }, 0);
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    window.localStorage.setItem(CLOCK_STORAGE_KEY, JSON.stringify(clocks));
  }, [clocks, isStorageReady]);

  const availableClocks = useMemo(() => {
    const selectedZones = new Set(clocks.map((clock) => clock.timeZone));
    return addableClocks.filter((clock) => !selectedZones.has(clock.timeZone));
  }, [addableClocks, clocks]);

  const activeSelectedTimeZone = selectedTimeZone || availableClocks[0]?.timeZone || "";

  const localClock = useMemo(() => {
    if (!now || localTimeZone === "로컬 시간") {
      return {
        time: "--:--:--",
        date: "불러오는 중",
        timeOfDay: { label: "로컬", color: "#2563eb", background: "#eff6ff" },
      };
    }

    return {
      ...getTimeParts(now, localTimeZone, timeFormat),
      timeOfDay: getTimeOfDay(getHour(now, localTimeZone)),
    };
  }, [localTimeZone, now, timeFormat]);

  const renderedClocks = useMemo(() => {
    if (!now) {
      return clocks.map((clock) => ({
        ...clock,
        time: "--:--:--",
        date: "불러오는 중",
        timeOfDay: { label: "대기", color: "#6b7280", background: "#f9fafb" },
      }));
    }

    return clocks.map((clock) => {
      const hour = getHour(now, clock.timeZone);
      return {
        ...clock,
        ...getTimeParts(now, clock.timeZone, timeFormat),
        timeOfDay: getTimeOfDay(hour),
      };
    });
  }, [clocks, now, timeFormat]);

  const handleAddClock = () => {
    const selectedClock = availableClocks.find((clock) => clock.timeZone === activeSelectedTimeZone);
    if (!selectedClock) {
      return;
    }

    setClocks((currentClocks) => [...currentClocks, selectedClock]);

    const nextAvailableClock = availableClocks.find((clock) => clock.timeZone !== activeSelectedTimeZone);
    setSelectedTimeZone(nextAvailableClock?.timeZone ?? "");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl p-6 text-center shadow-sm" style={{ border: "1px solid #dbeafe", backgroundColor: "#f8fbff" }}>
        <p className="text-sm font-medium" style={{ color: "#2563eb" }}>
          현재 위치
        </p>
        <h2 className="mt-1 text-xl font-semibold" style={{ color: "#1e3a8a" }}>
          {localTimeZone}
        </h2>
        <p className="mt-4 text-4xl font-bold tabular-nums" style={{ color: "#111827" }}>
          {localClock.time}
        </p>
        <p className="mt-2 text-sm" style={{ color: "#4b5563" }}>
          {localClock.date}
        </p>
      </section>

      <div className="flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between" style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
        <div className="inline-flex w-full rounded-lg p-1 sm:w-auto" style={{ backgroundColor: "#f3f4f6" }}>
          <button
            type="button"
            onClick={() => setTimeFormat("24")}
            className="flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors sm:flex-none"
            style={{
              backgroundColor: timeFormat === "24" ? "#2563eb" : "transparent",
              color: timeFormat === "24" ? "#ffffff" : "#4b5563",
            }}
          >
            24시간
          </button>
          <button
            type="button"
            onClick={() => setTimeFormat("12")}
            className="flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors sm:flex-none"
            style={{
              backgroundColor: timeFormat === "12" ? "#2563eb" : "transparent",
              color: timeFormat === "12" ? "#ffffff" : "#4b5563",
            }}
          >
            오전/오후
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={activeSelectedTimeZone}
            onChange={(event) => setSelectedTimeZone(event.target.value)}
            disabled={!now || availableClocks.length === 0}
            className="h-10 min-w-0 rounded-lg px-3 text-sm sm:w-80"
            style={{ border: "1px solid #d1d5db", color: "#374151", backgroundColor: "#ffffff" }}
          >
            {!now ? (
              <option value="">시간대 불러오는 중</option>
            ) : (
              availableClocks.map((clock) => (
                <option key={clock.timeZone} value={clock.timeZone}>
                  {clock.city} ({clock.timeZone})
                </option>
              ))
            )}
          </select>
          <button
            type="button"
            onClick={handleAddClock}
            disabled={!now || availableClocks.length === 0}
            className="h-10 shrink-0 whitespace-nowrap rounded-lg px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
          >
            도시/시간대 추가
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {renderedClocks.map((clock, index) => (
          <article
            key={clock.timeZone}
            className="rounded-xl p-5 shadow-sm"
            style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: "#1e3a8a" }}>
                  {clock.city}
                </h2>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  {clock.country}
                </p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  color: clock.timeOfDay.color,
                  backgroundColor: clock.timeOfDay.background,
                }}
              >
                {clock.timeOfDay.label}
              </span>
            </div>

            <p className="text-3xl font-bold tabular-nums" style={{ color: "#111827" }}>
              {clock.time}
            </p>
            <p className="mt-2 text-sm" style={{ color: "#4b5563" }}>
              {clock.date}
            </p>
            <p className="mt-4 text-sm" style={{ color: "#6b7280" }}>
              {clock.note}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setClocks((currentClocks) => moveClock(currentClocks, index, index - 1))}
                disabled={index === 0}
                className="rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                style={{ border: "1px solid #d1d5db", color: "#374151" }}
              >
                위로
              </button>
              <button
                type="button"
                onClick={() => setClocks((currentClocks) => moveClock(currentClocks, index, index + 1))}
                disabled={index === renderedClocks.length - 1}
                className="rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                style={{ border: "1px solid #d1d5db", color: "#374151" }}
              >
                아래로
              </button>
              <button
                type="button"
                onClick={() => setClocks((currentClocks) => currentClocks.filter((item) => item.timeZone !== clock.timeZone))}
                className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ border: "1px solid #fecaca", color: "#b91c1c" }}
              >
                삭제
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
