import {
  FinalCta,
  HeroSection,
  HowItWorksSection,
  LeaderboardSection,
  MatchScheduleSection,
  TickerStrip,
} from "@/components/homepage";
import { Footer } from "@/components/global";

const matches = [
  {
    date: "13 Jun",
    time: "18:00",
    fixture: "Brazil vs Morocco",
    stage: "Group Stage",
    matchday: "Matchday 1",
    group: "Group C",
    venue: "NY/NJ",
    status: "Open",
  },
  {
    date: "16 Jun",
    time: "15:00",
    fixture: "France vs Senegal",
    stage: "Group Stage",
    matchday: "Matchday 1",
    group: "Group D",
    venue: "Los Angeles",
    status: "Open",
  },
  {
    date: "22 Jun",
    time: "20:00",
    fixture: "Norway vs Senegal",
    stage: "Group Stage",
    matchday: "Matchday 2",
    group: "Group D",
    venue: "Seattle",
    status: "Soon",
  },
  {
    date: "25 Jun",
    time: "16:00",
    fixture: "Ecuador vs Germany",
    stage: "Group Stage",
    matchday: "Matchday 3",
    group: "Group E",
    venue: "Dallas",
    status: "Locked",
  },
];

const steps = [
  {
    kicker: "01",
    title: "Create a private group",
    text: "Start a league for friends, family, colleagues, or your football group chat.",
  },
  {
    kicker: "02",
    title: "Predict before kickoff",
    text: "Enter exact scores while fixtures are open. Every match locks automatically at start time.",
  },
  {
    kicker: "03",
    title: "Climb the table",
    text: "Correct calls earn points, close calls keep you alive, and the leaderboard updates all tournament.",
  },
];

const leaderboard = [
  { rank: "01", name: "Mara De Wit", points: "47", form: "+9" },
  { rank: "02", name: "Jonas Ribeiro", points: "43", form: "+6" },
  { rank: "03", name: "Nina Hofstad", points: "39", form: "+7" },
  { rank: "04", name: "Olivier Mensah", points: "34", form: "+3" },
];

const hostCities = ["NY/NJ", "Miami", "Dallas", "Kansas City", "Seattle", "Los Angeles"];

const scoringRules = [
  "5 pts for an exact score",
  "3 pts for the right result",
  "1 pt for goal difference",
  "Bonus streaks during knockout rounds",
];

export default function Home() {
  return (
    <main
      className="min-h-[100dvh] overflow-hidden bg-[#f5f1e8] text-[#152016]"
      id="main-content"
    >
      <HeroSection hostCities={hostCities} leaderboard={leaderboard} />
      <TickerStrip />
      <HowItWorksSection steps={steps} />
      <MatchScheduleSection matches={matches} />
      <LeaderboardSection players={leaderboard} scoringRules={scoringRules} />
      <FinalCta />
      <Footer />
    </main>
  );
}
