import Link from "next/link";
import { ButtonLink } from "@/components/global";
import { SectionEyebrow } from "./SectionEyebrow";

export function FinalCta() {
  return (
    <section className="px-5 pb-10 sm:px-8 lg:px-10" id="join">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-shell bg-terracotta p-6 text-surface sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <SectionEyebrow tone="cream">Ready for kickoff</SectionEyebrow>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-none tracking-display sm:text-6xl">
            Start the group before the first predictions lock.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <ButtonLink href="/register" variant="light">
            Create group
          </ButtonLink>
          <Link
            className="rounded-full border border-surface/45 px-7 py-4 text-center text-sm font-black text-surface transition-colors hover:bg-surface/10"
            href="/login?next=/home"
          >
            Enter invite code
          </Link>
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-label text-warning lg:col-span-2">
          Sign in first, then create or join a private group.
        </p>
      </div>
    </section>
  );
}
