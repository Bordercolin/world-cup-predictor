import { ButtonLink, Header } from "@/components/global";
import { PredictionPreview } from "./PredictionPreview";
import { SectionEyebrow } from "./SectionEyebrow";
import type { LeaderboardPlayer } from "./types";

type HeroSectionProps = {
  hostCities: string[];
  leaderboard: LeaderboardPlayer[];
};

export function HeroSection({ hostCities, leaderboard }: HeroSectionProps) {
  return (
    <section className="relative isolate min-h-[100dvh] px-5 py-5 sm:px-8 lg:px-10">
      <div className="hero-gradient absolute inset-0 -z-10" />
      <div className="absolute left-1/2 top-10 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-ink/10" />
      <Header />

      <div className="mx-auto grid max-w-7xl gap-12 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pb-28 lg:pt-24">
        <div>
          <p className="mb-7 inline-flex rounded-full border border-ink/15 bg-surface/70 px-4 py-2 text-xs font-bold uppercase tracking-eyebrow text-green">
            World Cup pronostiek, coast to coast
          </p>
          <h1 className="hero-heading max-w-5xl text-5xl leading-[0.92] text-ink sm:text-7xl lg:text-8xl">
            Predict every match. Own the group table.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
            Create a private football predictor league, lock in scores before kickoff, and follow a
            U.S. summer of host-city match nights from the first whistle to the final.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/register">Create your group</ButtonLink>
            <ButtonLink href="#matches" variant="outline">
              View match flow
            </ButtonLink>
          </div>
          <HostCityPills cities={hostCities} />
        </div>

        <PredictionPreview players={leaderboard} />
      </div>
    </section>
  );
}

type HostCityPillsProps = {
  cities: string[];
};

function HostCityPills({ cities }: HostCityPillsProps) {
  return (
    <div className="mt-10 max-w-2xl border-t border-ink/12 pt-5">
      <SectionEyebrow size="xs" tone="navy">
        Host-city pulse
      </SectionEyebrow>
      <div className="mt-4 flex flex-wrap gap-2">
        {cities.map((city) => (
          <span
            className="rounded-full border border-navy/18 bg-surface/55 px-3 py-1.5 text-xs font-bold text-ocean-ink"
            key={city}
          >
            {city}
          </span>
        ))}
      </div>
    </div>
  );
}
