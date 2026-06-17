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
      <aside className="border-b border-sidebar-border bg-sidebar bg-[image:var(--gradient-sidebar)] px-5 py-4 text-sidebar-foreground md:min-h-screen md:border-b-0 md:border-r md:px-6 md:py-8">
        <div className="flex gap-4 md:sticky md:top-8 md:min-h-[calc(100dvh-4rem)] md:flex-col">
          <div className="min-w-0 flex-1">
            <Link
              className="flex items-center gap-3 text-xl font-semibold tracking-tight text-sidebar-foreground"
              href="/"
            >
              <span className="grid size-9 place-items-center rounded-xl border border-sidebar-border bg-sidebar-accent/75 font-mono text-sm font-bold text-sidebar-accent-foreground shadow-sm">
                26
              </span>
              <span>World Cup Predictor</span>
            </Link>
            <nav className="mt-5 flex gap-2 md:grid">
              {navItems.map((item) => (
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action={signOut} className="self-start md:w-full">
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
