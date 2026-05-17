import Link from "next/link";
import { ButtonLink } from "./Buttons";

export function Header() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-ink/15 bg-surface/80 px-4 py-3 shadow-nav backdrop-blur md:px-6">
      <Link href="/" className="flex items-center gap-3" aria-label="Prono Club home">
        <span className="grid size-9 place-items-center rounded-full bg-green text-sm font-black text-cream">
          PC
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">Prono Club</span>
          <span className="ui-label mt-1 text-navy">
            USA 2026
          </span>
        </span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
        <a className="transition-colors hover:text-ink" href="#how-it-works">
          How it works
        </a>
        <a className="transition-colors hover:text-ink" href="#matches">
          Fixtures
        </a>
        <a className="transition-colors hover:text-ink" href="#leaderboard">
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
