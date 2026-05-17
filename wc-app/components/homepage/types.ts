export type Match = {
  date: string;
  time: string;
  fixture: string;
  stage: string;
  matchday: string;
  group: string;
  venue: string;
  status: string;
};

export type Step = {
  kicker: string;
  title: string;
  text: string;
};

export type LeaderboardPlayer = {
  rank: string;
  name: string;
  points: string;
  form: string;
};
