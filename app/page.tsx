"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

const TARGET_DATE = new Date(2026, 7, 23, 0, 0, 0);

type TimeLeft = {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  const originalDay = next.getDate();

  next.setMonth(next.getMonth() + months);

  if (next.getDate() !== originalDay) {
    next.setDate(0);
  }

  return next;
}

function getWholeMonthsBetween(start: Date, end: Date) {
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth();

  if (addMonths(start, months) > end) {
    months -= 1;
  }

  return Math.max(months, 0);
}

function getTimeLeft(now: Date): TimeLeft {
  if (now >= TARGET_DATE) {
    return { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const months = getWholeMonthsBetween(now, TARGET_DATE);
  const afterMonths = addMonths(now, months);
  let remainingSeconds = Math.max(
    0,
    Math.floor((TARGET_DATE.getTime() - afterMonths.getTime()) / 1000),
  );

  const weeks = Math.floor(remainingSeconds / (7 * 24 * 60 * 60));
  remainingSeconds -= weeks * 7 * 24 * 60 * 60;

  const days = Math.floor(remainingSeconds / (24 * 60 * 60));
  remainingSeconds -= days * 24 * 60 * 60;

  const hours = Math.floor(remainingSeconds / (60 * 60));
  remainingSeconds -= hours * 60 * 60;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds - minutes * 60;

  return { months, weeks, days, hours, minutes, seconds };
}

function formatUnit(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

const countdownUnits: Array<{ key: keyof TimeLeft; label: string }> = [
  { key: "months", label: "Months" },
  { key: "weeks", label: "Weeks" },
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

const photos = [
  {
    src: "/collage/photo1.jpg",
    alt: "Memory photo 1",
    rotationClass: "sm:-rotate-1",
    mobileClass: "translate-y-0",
  },
  {
    src: "/collage/photo2.jpg",
    alt: "Memory photo 2",
    rotationClass: "sm:rotate-1",
    mobileClass: "translate-y-8",
  },
  {
    src: "/collage/photo3.jpg",
    alt: "Memory photo 3",
    rotationClass: "sm:-rotate-1",
    mobileClass: "-translate-y-2",
  },
  {
    src: "/collage/photo4.jpg",
    alt: "Memory photo 4",
    rotationClass: "sm:rotate-1",
    mobileClass: "translate-y-6",
  },
  {
    src: "/collage/photo5.jpg",
    alt: "Memory photo 5",
    rotationClass: "sm:-rotate-1",
    mobileClass: "-translate-y-4",
  },
  {
    src: "/collage/photo6.jpg",
    alt: "Memory photo 6",
    rotationClass: "sm:rotate-1",
    mobileClass: "translate-y-5",
  },
];

const floatingEmojis = [
  { icon: "❤️", className: "left-8 top-8 rotate-[-14deg]" },
  { icon: "😍", className: "right-10 top-10 rotate-[12deg]" },
  { icon: "🦆", className: "left-14 bottom-10 rotate-[10deg]" },
  { icon: "❤️", className: "right-20 bottom-12 rotate-[-8deg]" },
  { icon: "😍", className: "left-1/2 top-4 -translate-x-1/2 rotate-[7deg]" },
];

export default function Home() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      setNow(Date.now());
    };

    const firstTick = window.setTimeout(updateCountdown, 0);
    const timer = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(timer);
    };
  }, []);

  const timeLeft = useMemo(() => (now ? getTimeLeft(new Date(now)) : null), [now]);
  const countdownText = timeLeft
    ? [
        formatUnit(timeLeft.months, "month"),
        formatUnit(timeLeft.weeks, "week"),
        formatUnit(timeLeft.days, "day"),
        formatUnit(timeLeft.hours, "hour"),
        formatUnit(timeLeft.minutes, "minute"),
        formatUnit(timeLeft.seconds, "second"),
      ].join(" ")
    : "Loading countdown";

  return (
    <main className="page-shell flex min-h-screen items-start justify-center bg-[#fff1f5] px-4 pb-12 pt-16 text-[#34201d] sm:px-6 sm:pt-20 md:pt-24">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center sm:gap-10">
        <h1 className="hero-title max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          Time to see each other again{" "}
          <span className="heart-hands" aria-hidden="true">
            🫶🏼
          </span>
        </h1>

        <div
          className="grid w-full grid-cols-6 gap-1.5 sm:gap-3"
          aria-live="polite"
          aria-label={`${countdownText} left`}
        >
          {countdownUnits.map(({ key, label }, index) => (
            <div
              key={key}
              className="countdown-unit flex min-w-0 flex-col items-center gap-2 sm:gap-3"
              style={{ "--stagger": `${index * 85}ms` } as CSSProperties}
            >
              <div className="countdown-tile flex aspect-square w-full items-center justify-center rounded-lg border border-[#f0c9bd] bg-white/80 shadow-[0_18px_44px_rgba(113,59,50,0.16)] backdrop-blur">
                <span className="tabular-nums text-[1.65rem] font-bold leading-none text-[#6f2f2a] sm:text-5xl md:text-6xl">
                  {timeLeft ? String(timeLeft[key]).padStart(2, "0") : "--"}
                </span>
              </div>
              <span className="max-w-full text-[0.48rem] font-semibold uppercase tracking-[0.08em] text-[#7e4944] sm:text-xs sm:tracking-[0.18em]">
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="message-line text-xl font-bold text-[#7a3833] sm:text-2xl">
          I can&apos;t wait to see you 🦩
        </p>

        <div className="photo-section w-full pt-2 sm:pt-4">
          <div className="grid w-full grid-cols-2 gap-x-3 gap-y-5 pb-8 sm:grid-cols-2 sm:gap-6 sm:pb-0 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={photo.src}
                className={`memory-card relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-white/85 bg-white p-1.5 shadow-[0_14px_34px_rgba(113,59,50,0.16)] transition-transform duration-500 hover:z-10 hover:scale-[1.02] sm:translate-y-0 sm:p-2 sm:shadow-[0_16px_38px_rgba(113,59,50,0.18)] ${photo.mobileClass} ${photo.rotationClass}`}
                style={{ "--stagger": `${index * 95}ms` } as CSSProperties}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 82vw"
                  className="memory-photo p-2 object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <section className="love-note relative mt-2 w-full max-w-4xl overflow-hidden rounded-lg border border-[#f0c9bd] bg-white/78 px-6 py-8 text-left shadow-[0_22px_60px_rgba(113,59,50,0.14)] backdrop-blur sm:mt-4 sm:px-10 sm:py-10">
          {floatingEmojis.map((emoji, index) => (
            <span
              key={`${emoji.icon}-${index}`}
              className={`floating-emoji pointer-events-none absolute hidden text-3xl sm:block ${emoji.className}`}
              style={{ "--stagger": `${index * 180}ms` } as CSSProperties}
              aria-hidden="true"
            >
              {emoji.icon}
            </span>
          ))}

          <div className="relative z-10">
            <p className="mb-6 text-2xl font-bold text-[#34201d]">Mrs. Patootie,</p>

            <p className="text-lg font-medium leading-relaxed text-[#4b302c] sm:text-xl">
              I miss you so much. I wish we could be together right now so we can
              have infinite cuddles and snuggles. You&apos;re the best girl in the
              world and you make me so happy every single day. I am counting the
              days to see you again and give you a trillion besos y abrazos. You
              really are the most beautiful girl on earth and the nicest person I
              have ever met. Pls marry me.
            </p>

            <p className="mt-8 text-right text-xl font-bold leading-snug text-[#34201d]">
              With infinite love,
              <br />
              Mr. Patootie
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
