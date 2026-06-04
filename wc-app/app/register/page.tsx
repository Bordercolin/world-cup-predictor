import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { registerWithPassword } from "./actions";

const errorMessages: Record<string, string> = {
  missing: "Fill in all fields to register.",
  "short-password": "Use a password of at least 6 characters.",
  "password-match": "The passwords do not match.",
  register: "We could not create that account. Try a different email.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error ? errorMessages[params.error] : null;

  return (
    <main className="grid min-h-screen place-items-center bg-background bg-[image:var(--gradient-page)] px-5 py-10 text-foreground">
      <Card className="w-full max-w-md border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
        <CardHeader className="gap-4">
          <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
            World Cup 2026
          </Badge>
          <CardTitle className="text-4xl font-semibold tracking-tight">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Register with your email and password. Then you will choose a nickname and join or
            create a prediction group.
          </p>

          {errorMessage ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <form action={registerWithPassword} className="grid gap-4">
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
                autoComplete="new-password"
                id="password"
                minLength={6}
                name="password"
                required
                type="password"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="repeatPassword">
                Repeat password
              </label>
              <Input
                autoComplete="new-password"
                id="repeatPassword"
                minLength={6}
                name="repeatPassword"
                required
                type="password"
              />
            </div>
            <Button className="w-full" size="lg" type="submit">
              Register
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
