import Link from "next/link";
import type { ReactNode } from "react";

import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/",
    label: "Homepage",
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
  },
  {
    href: "/played-matches",
    label: "Played matches",
  },
  {
    href: "/rules",
    label: "Rules",
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background bg-[image:var(--gradient-page)] text-foreground md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-sidebar-border bg-sidebar/95 bg-[image:var(--gradient-sidebar)] px-4 py-3 text-sidebar-foreground backdrop-blur supports-backdrop-filter:bg-sidebar/80 sm:px-6 md:static md:min-h-screen md:border-b-0 md:border-r md:px-6 md:py-8 md:backdrop-blur-none">
        <div className="flex flex-col gap-3 md:sticky md:top-8 md:min-h-[calc(100dvh-4rem)] md:gap-5">
          <div className="flex items-center justify-between gap-3">
            <Link
              className="flex min-w-0 items-center gap-2.5 text-lg font-semibold tracking-tight text-sidebar-foreground sm:gap-3 sm:text-xl"
              href="/"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-sidebar-border bg-sidebar-accent/75 font-mono text-sm font-bold text-sidebar-accent-foreground shadow-sm">
                26
              </span>
              <span className="truncate">World Cup Predictor</span>
            </Link>
            <form action={signOut} className="shrink-0 md:hidden">
              <Button
                className="border-sidebar-border bg-sidebar/60 hover:bg-sidebar-accent"
                size="sm"
                type="submit"
                variant="outline"
              >
                Logout
              </Button>
            </form>
          </div>
          <nav className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] md:mx-0 md:grid md:gap-1 md:overflow-visible md:px-0 md:pb-0">
            {navItems.map((item) => (
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={signOut} className="mt-auto hidden md:block">
            <Button
              className="w-full border-sidebar-border bg-sidebar/60 hover:bg-sidebar-accent"
              type="submit"
              variant="outline"
            >
              Logout
            </Button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
