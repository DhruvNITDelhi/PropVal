/**
 * Site footer with project links and disclaimer.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-navy-900 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Prop<span className="text-brand-400">Val</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed">
              AI-powered property price predictor for 100+ Indian cities.
              Get instant, transparent estimates.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://github.com/DhruvNITDelhi/PropVal" target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors">GitHub</a></li>
              <li><a href="https://github.com/DhruvNITDelhi/PropVal/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors">Contributing</a></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Disclaimer</h4>
            <p className="mt-3 text-xs leading-relaxed">
              PropVal provides estimates based on publicly available data
              and statistical models. This is not a certified valuation.
              Consult a licensed valuer for legal/financial decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-xs">
          © {new Date().getFullYear()} PropVal by{" "}
          <a href="https://github.com/DhruvNITDelhi" target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
            Dhruv
          </a>
          . Open source under MIT License.
        </div>
      </div>
    </footer>
  );
}
