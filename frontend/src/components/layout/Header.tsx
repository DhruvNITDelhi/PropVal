"use client";

import Link from "next/link";

/**
 * Site header with logo and navigation.
 * Fixed at top, clean white with subtle border.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold text-lg">
            P
          </div>
          <span className="text-xl font-bold text-navy-800 tracking-tight">
            Prop<span className="text-brand-600">Val</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link
            href="/valuation"
            className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-semibold"
          >
            Get Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}
