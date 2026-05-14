import Link from "next/link";

/**
 * Landing page — the hero and feature highlights.
 * Designed to build trust and drive users to the valuation form.
 */
export default function HomePage() {
  return (
    <div>
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 text-white">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-50" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
              100+ Indian Cities Covered
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Know Your Property&apos;s
              <br />
              <span className="text-brand-400">True Worth</span> — Instantly
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300 leading-relaxed">
              Get transparent, AI-powered property valuations for land, houses,
              apartments, and commercial buildings across India. Answer 6 simple
              questions, get your estimate in seconds.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/valuation"
                className="btn-gradient rounded-xl px-8 py-4 text-center text-lg font-bold shadow-lg shadow-brand-600/30"
              >
                Start Free Valuation →
              </Link>
              <a
                href="https://github.com/DhruvNITDelhi/PropVal"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-medium text-white/80 transition hover:bg-white/5"
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {[
            { value: "100+", label: "Cities" },
            { value: "6", label: "Quick Steps" },
            { value: "12+", label: "Price Factors" },
            { value: "<2s", label: "Result Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-brand-600 sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-navy-800">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-500">
            Three simple stages. Under 90 seconds. Full transparency.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Answer Questions",
                desc: "Tell us about your property — type, location, size, and features. Only 3 fields required, rest is optional.",
                icon: "📝",
              },
              {
                step: "02",
                title: "AI Analyzes",
                desc: "Our hybrid engine combines circle rates, market data, and 12+ pricing factors to compute your estimate.",
                icon: "🧠",
              },
              {
                step: "03",
                title: "Get Your Range",
                desc: "Receive a transparent price range with confidence score and a full breakdown of every factor affecting value.",
                icon: "📊",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy-800">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Key Features ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-navy-800">
            Why PropVal?
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Transparent Pricing", desc: "See exactly how each factor (age, floor, metro proximity) affects your price. No black boxes.", icon: "🔍" },
              { title: "Confidence Scoring", desc: "Every estimate comes with a confidence percentage and market volatility indicator.", icon: "📈" },
              { title: "Pan-India Coverage", desc: "100+ cities across all 28 states. From metros to Tier-3 towns.", icon: "🇮🇳" },
              { title: "Hybrid AI Engine", desc: "Combines rule-based valuation, ML estimation, and geo-intelligence for accuracy.", icon: "🧠" },
              { title: "No Login Required", desc: "Get instant results without creating an account. Your data stays in your browser.", icon: "🔒" },
              { title: "Mobile Ready", desc: "Works perfectly on phones and tablets. Install as an app from your browser.", icon: "📱" },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 rounded-xl p-5 transition hover:bg-slate-50">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-navy-800">{f.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold">Ready to Know Your Property&apos;s Value?</h2>
          <p className="mt-3 text-brand-100">
            Free. Instant. No sign-up needed.
          </p>
          <Link
            href="/valuation"
            className="mt-8 inline-block rounded-xl bg-white px-10 py-4 text-lg font-bold text-brand-700 shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Valuation →
          </Link>
        </div>
      </section>
    </div>
  );
}
