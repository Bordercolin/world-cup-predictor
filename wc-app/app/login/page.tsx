import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { signInWithPassword } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-background bg-[image:var(--gradient-page)] px-5 py-10 text-foreground">
      <Card className="w-full max-w-md border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
        <CardHeader className="gap-4">
          <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
            World Cup 2026
          </Badge>
          <CardTitle className="text-4xl font-semibold tracking-tight">
            Log in to predict
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Use your email and password to continue to your prediction group.
          </p>

          {params?.error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              We could not log you in with those details.
            </p>
          ) : null}

          <form action={signInWithPassword} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input autoComplete="email" id="email" name="email" required type="email" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                autoComplete="current-password"
                id="password"
                name="password"
                required
                type="password"
              />
            </div>
            <Button className="w-full" size="lg" type="submit">
              Log in
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            No account yet?{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/register">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
