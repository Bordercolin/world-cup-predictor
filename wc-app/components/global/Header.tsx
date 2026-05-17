import Link from "next/link";
import { ButtonLink } from "./Buttons";

export function Header() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#152016]/15 bg-[#f9f4ea]/80 px-4 py-3 shadow-[0_24px_80px_-48px_rgba(21,32,22,0.55)] backdrop-blur md:px-6">
      <Link href="/" className="flex items-center gap-3" aria-label="Prono Club home">
        <span className="grid size-9 place-items-center rounded-full bg-[#165d4a] text-sm font-black text-[#f8f0df]">
          PC
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">Prono Club</span>
          <span className="mt-1 font-mono text-[0.58rem] font-black uppercase tracking-[0.22em] text-[#1d345e]">
            USA 2026
          </span>
        </span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-medium text-[#405143] md:flex">
        <a className="transition-colors hover:text-[#152016]" href="#how-it-works">
          How it works
        </a>
        <a className="transition-colors hover:text-[#152016]" href="#matches">
          Fixtures
        </a>
        <a className="transition-colors hover:text-[#152016]" href="#leaderboard">
          Leaderboard
        </a>
      </nav>
      <div className="flex items-center gap-2">
        <ButtonLink href="/login" size="sm" variant="outline">
          Login
        </ButtonLink>
        <ButtonLink href="/register" size="sm" variant="terracotta">
          Register
        </ButtonLink>
      </div>
    </div>
  );
}
