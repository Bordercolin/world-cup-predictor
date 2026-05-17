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
    <main className="min-h-[100dvh] bg-[#f5f1e8] px-5 py-6 text-[#152016] sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid size-9 place-items-center rounded-full bg-[#165d4a] text-sm font-black text-[#f8f0df]">
            PC
          </span>
          <span className="text-sm font-semibold tracking-tight">Prono Club</span>
        </Link>
        <Link className="text-sm font-bold text-[#405143] transition-colors hover:text-[#152016]" href="/">
          Back to landing
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 py-16 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
        <div>
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#d24a2a]">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-none tracking-[-0.06em] sm:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#405143]">{text}</p>
          <div className="mt-10 grid max-w-xl gap-3 border-t border-[#152016]/12 pt-6 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#1d345e] sm:grid-cols-3">
            <span>Private groups</span>
            <span>Kickoff locks</span>
            <span>Live tables</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#152016]/12 bg-[#fff8ec]/80 p-5 shadow-[0_30px_90px_-60px_rgba(21,32,22,0.8)] sm:p-7">
          {children}
        </div>
      </section>
    </main>
  );
}
