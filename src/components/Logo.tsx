import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg" aria-label="StayWorth home">
      <span className="grid size-8 place-items-center rounded-[10px] bg-brand-700 text-white shadow-[0_1px_2px_rgb(11_95_86/0.3)]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          {/* roofline that doubles as a rising trend */}
          <path d="M2.5 9.5 9 3.5l6.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 14.5v-3M9 14.5V9M13 14.5v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[17px] font-bold tracking-[-0.02em] text-ink">StayWorth</span>
    </Link>
  );
}
