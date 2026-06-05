import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const groupStageRules = [
  {
    points: "+10",
    title: "Bullseye!",
    text: "You predicted the exact match score.",
  },
  {
    points: "+7",
    title: "Not perfect, but close!",
    text: "The score is not exact, but your goal difference is correct.",
    example: "Example: you predict 3-1 and the result is 2-0.",
  },
  {
    points: "+5",
    title: "You picked the right winner!",
    text: "Your score and goal difference are not correct, but you do know who takes the three points.",
    example: "Example: you predict 1-0 and the result is 3-0.",
  },
  {
    points: "+1",
    title: "Scoring starts with taking part.",
    text: "You get one point for submitting your prediction.",
  },
];

const knockoutRules = [
  {
    points: "+10",
    title: "You know who advanced!",
    text: "You predicted the winning country correctly, even if the match is only decided by a penalty shootout.",
    example: "Example: your chosen country wins the match after penalties.",
  },
  {
    points: "+6",
    title: "Fortune teller!",
    text: "You predicted the exact score after 90 minutes, or after 120 minutes if extra time is played.",
  },
  {
    points: "+4",
    title: "Bonus!",
    text: "In addition to the winner, your predicted goal difference is also correct. This is the difference in goals between both teams after 90 or 120 minutes.",
    example: "Example: you predict 3-1 and the result is 2-0.",
  },
  {
    points: "+1",
    title: "Submitting pays off.",
    text: "Here too, you get one point for submitting your prediction.",
  },
];

const bonusRules = [
  {
    points: "+5",
    title: "First goalscorer bonus.",
    text: "Pick the player who scores the first goal of the match. If you are right, you get five extra points on top of your score prediction.",
    example: "If the match ends 0-0, there is no first goalscorer bonus.",
  },
];

function RuleList({
  rules,
}: {
  rules: {
    points: string;
    title: string;
    text: string;
    example?: string;
  }[];
}) {
  return (
    <div className="grid gap-3">
      {rules.map((rule) => (
        <div
          className="grid gap-3 rounded-xl border border-primary/10 bg-muted/35 p-4 sm:grid-cols-[auto_1fr]"
          key={`${rule.points}-${rule.title}`}
        >
          <div className="grid size-14 place-items-center rounded-xl border border-primary/15 bg-primary/10 bg-[image:var(--gradient-score)] font-mono text-lg font-bold text-primary">
            {rule.points}
          </div>
          <div>
            <p className="font-semibold tracking-tight">{rule.title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{rule.text}</p>
            {rule.example ? (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{rule.example}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RulesPage() {
  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-4xl gap-6">
        <Card className="border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
          <CardHeader className="gap-4">
            <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
              Rules
            </Badge>
            <CardTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
              How points work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Group-stage predictions use the best matching score category. From the Round of 16,
              points are added together: submitting, winner, exact score, and goal difference can all
              count. The first goalscorer bonus is added on top when you pick the right player.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-primary/10 bg-card p-2 sm:p-4">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                During the Group Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RuleList rules={groupStageRules} />
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-card p-2 sm:p-4">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                From the Round of 16
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RuleList rules={knockoutRules} />
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/10 bg-card p-2 sm:p-4">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Bonus Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RuleList rules={bonusRules} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
