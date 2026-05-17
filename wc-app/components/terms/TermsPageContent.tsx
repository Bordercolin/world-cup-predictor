import Link from "next/link";
import { Footer } from "@/components/global";

export function TermsPageContent() {
  return (
    <main className="app-page px-5 py-10 text-ink sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link className="text-sm font-bold text-muted transition-colors hover:text-ink" href="/">
          Back to home
        </Link>
        <p className="mt-16 font-mono text-sm font-black uppercase tracking-eyebrow text-terracotta">
          Terms
        </p>
        <h1 className="mt-4 text-5xl font-black leading-none tracking-hero sm:text-7xl">
          Terms of service
        </h1>
        <div className="mt-10 space-y-6 text-lg leading-8 text-muted">
          <p>
            Prono Club is a friendly prediction game concept for private groups. It is not
            affiliated with FIFA, the World Cup, or any host committee.
          </p>
          <p>
            Future gameplay rules, scoring behavior, and account terms will be documented here
            before the product accepts real users.
          </p>
        </div>
      </div>
      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
