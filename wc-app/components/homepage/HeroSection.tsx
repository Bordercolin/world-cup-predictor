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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_18%,rgba(210,74,42,0.24),transparent_26%),radial-gradient(circle_at_88%_10%,rgba(29,52,94,0.2),transparent_24%),radial-gradient(circle_at_78%_78%,rgba(22,93,74,0.18),transparent_26%),linear-gradient(135deg,#f5f1e8_0%,#efe4d1_52%,#d9e3cf_100%)]" />
      <div className="absolute left-1/2 top-10 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-[#152016]/10" />
      <Header />

      <div className="mx-auto grid max-w-7xl gap-12 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pb-28 lg:pt-24">
        <div>
          <p className="mb-7 inline-flex rounded-full border border-[#152016]/15 bg-[#fff8ec]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.26em] text-[#165d4a]">
            World Cup pronostiek, coast to coast
          </p>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.065em] text-[#152016] sm:text-7xl lg:text-8xl">
            Predict every match. Own the group table.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#405143] sm:text-xl">
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
    <div className="mt-10 max-w-2xl border-t border-[#152016]/12 pt-5">
      <SectionEyebrow size="xs" tone="navy">
        Host-city pulse
      </SectionEyebrow>
      <div className="mt-4 flex flex-wrap gap-2">
        {cities.map((city) => (
          <span
            className="rounded-full border border-[#1d345e]/18 bg-[#fff8ec]/55 px-3 py-1.5 text-xs font-bold text-[#263b62]"
            key={city}
          >
            {city}
          </span>
        ))}
      </div>
    </div>
  );
}
