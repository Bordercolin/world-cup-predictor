import { SectionEyebrow } from "./SectionEyebrow";
import type { Step } from "./types";

type HowItWorksSectionProps = {
  steps: Step[];
};

export function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  return (
    <section
      className="mx-auto grid max-w-7xl gap-6 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10"
      id="how-it-works"
    >
      <div>
        <SectionEyebrow>How it works</SectionEyebrow>
        <h2 className="mt-4 max-w-xl text-4xl font-black leading-none tracking-[-0.045em] sm:text-6xl">
          A private tournament inside the tournament.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <StepCard step={step} key={step.kicker} />
        ))}
      </div>
    </section>
  );
}

type StepCardProps = {
  step: Step;
};

function StepCard({ step }: StepCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-[#152016]/12 bg-[#fff8ec]/65 p-6 shadow-[0_24px_70px_-56px_rgba(21,32,22,0.65)]">
      <p className="font-mono text-sm font-black text-[#d24a2a]">{step.kicker}</p>
      <h3 className="mt-8 text-xl font-black tracking-tight">{step.title}</h3>
      <p className="mt-4 text-sm leading-6 text-[#405143]">{step.text}</p>
    </article>
  );
}
