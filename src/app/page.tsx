import { Estimator } from "@/components/Estimator";
import { Logo } from "@/components/Logo";
import { MODEL } from "@/lib/config";

const steps = [
  {
    title: "Nightly rate",
    body: `Starts at $${MODEL.adr.base}, adds $${MODEL.adr.perBedroom} per bedroom, a small premium for extra beds and flat amenity premiums — then applies location and property-type multipliers.`,
  },
  {
    title: "Occupancy",
    body: "The rate is multiplied by the share of nights booked to get RevPAN — revenue per available night.",
  },
  {
    title: "Seasonality",
    body: "A summer-weighted curve shifts revenue across the 12 months; the months are summed into an annual figure.",
  },
  {
    title: "Fees & pricing",
    body: "Management fees come off the top to get net to owner. Dynamic pricing, when on, adds a modeled uplift.",
  },
];

export default function Home() {
  return (
    <>
      <a
        href="#estimator"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to estimator
      </a>

      <header className="border-b border-line/70 bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav aria-label="Primary" className="flex items-center gap-1 text-[13px] font-medium text-ink-soft">
            <a href="#how-it-works" className="rounded-lg px-3 py-2 transition-colors hover:bg-surface hover:text-ink">
              How it works
            </a>
            <span className="ml-1 hidden rounded-full border border-line bg-surface px-2.5 py-1 text-[12px] text-muted sm:inline">
              Illustrative model
            </span>
          </nav>
        </div>
      </header>

      <main id="estimator" className="mx-auto max-w-[1320px] px-4 pb-28 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-16">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="mb-3 text-[13px] font-semibold text-brand-700">Vacation rental revenue estimator</p>
          <h1 className="text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[46px]">
            What could your rental earn?
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
            Describe your property and get an instant, explainable projection: nightly rate, revenue through the
            seasons, and what lands with the owner after fees.
          </p>
        </div>

        <Estimator />

        <section id="how-it-works" aria-labelledby="how-title" className="mt-20 scroll-mt-8">
          <h2 id="how-title" className="text-[22px] font-bold tracking-[-0.02em] text-ink">
            How this estimate works
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            No black box. The estimator runs a simple, transparent model in your browser — no data leaves this page.
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-surface p-5">
                <span className="text-[12px] font-semibold text-brand-700 tabular">0{i + 1}</span>
                <h3 className="mt-2 text-[15px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-4 py-8 text-[12.5px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            <span className="font-semibold text-ink-soft">Illustrative estimate</span> based on general market
            heuristics. Not a guaranteed projection.
          </p>
          <p>StayWorth · A portfolio concept</p>
        </div>
      </footer>
    </>
  );
}
