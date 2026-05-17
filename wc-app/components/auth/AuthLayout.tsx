import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  text: string;
};

export function AuthLayout({ children, eyebrow, title, text }: AuthLayoutProps) {
  return (
    <main className="app-page px-5 py-6 text-ink sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid size-9 place-items-center rounded-full bg-green text-sm font-black text-cream">
            PC
          </span>
          <span className="text-sm font-semibold tracking-tight">Prono Club</span>
        </Link>
        <Link className="text-sm font-bold text-muted transition-colors hover:text-ink" href="/">
          Back to landing
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 py-16 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
        <div>
          <p className="font-mono text-sm font-black uppercase tracking-eyebrow text-terracotta">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-none tracking-hero sm:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted">{text}</p>
          <div className="mt-10 grid max-w-xl gap-3 border-t border-ink/12 pt-6 font-mono text-xs font-black uppercase tracking-label text-navy sm:grid-cols-3">
            <span>Private groups</span>
            <span>Kickoff locks</span>
            <span>Live tables</span>
          </div>
        </div>

        <div className="rounded-shell border border-ink/12 bg-surface/80 p-5 shadow-panel sm:p-7">
          {children}
        </div>
      </section>
    </main>
  );
}
