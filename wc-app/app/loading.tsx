import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-full bg-muted ${className}`} />;
}

function MatchCardSkeleton() {
  return (
    <Card className="border-primary/10 bg-card p-2">
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="grid gap-3">
            <SkeletonBlock className="h-8 w-40" />
            <SkeletonBlock className="h-4 w-24" />
          </div>

          <div className="grid justify-items-center gap-3">
            <SkeletonBlock className="h-3 w-36" />
            <div className="flex items-center gap-3">
              <SkeletonBlock className="size-12" />
              <SkeletonBlock className="h-3 w-6" />
              <SkeletonBlock className="size-12" />
            </div>
            <SkeletonBlock className="h-7 w-28" />
          </div>

          <div className="grid justify-items-start gap-3 sm:justify-items-end">
            <SkeletonBlock className="h-8 w-40" />
            <SkeletonBlock className="h-4 w-32" />
          </div>
        </div>
        <div className="mt-5 rounded-xl border border-primary/10 bg-muted/25 p-3">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-3 h-2 w-full" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="mx-auto h-8 w-20" />
            <SkeletonBlock className="ml-auto h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <Card className="border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
          <CardHeader className="gap-5">
            <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
              Loading
            </Badge>
            <CardTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Getting the latest matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="rounded-xl border border-primary/10 bg-accent/35 p-4"
                  key={index}
                >
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="mt-4 h-9 w-16" />
                  <SkeletonBlock className="mt-3 h-4 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section aria-label="Loading matches" className="grid gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="uppercase tracking-[0.18em]">
              Match day
            </Badge>
            <SkeletonBlock className="h-7 w-36" />
          </div>
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <MatchCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
