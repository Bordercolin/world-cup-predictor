import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { requestPasswordReset } from "./actions";

const errorMessages: Record<string, string> = {
  missing: "Enter the email address for your account.",
  reset: "We could not send a reset link. Try again in a moment.",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const sent = params?.message === "sent";

  return (
    <main className="grid min-h-screen place-items-center bg-background bg-[image:var(--gradient-page)] px-5 py-10 text-foreground">
      <Card className="w-full max-w-md border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
        <CardHeader className="gap-4">
          <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
            Password reset
          </Badge>
          <CardTitle className="text-4xl font-semibold tracking-tight">
            Get back in before kickoff.
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Enter your account email and we will send a link to choose a new password.
          </p>

          {errorMessage ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
          {sent ? (
            <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
              If an account exists for that email, a reset link is on its way.
            </p>
          ) : null}

          <form action={requestPasswordReset} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input autoComplete="email" id="email" name="email" required type="email" />
            </div>
            <Button className="w-full" size="lg" type="submit">
              Send reset link
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">
              Back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
