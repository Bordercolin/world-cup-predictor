import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";

import { saveNickname } from "./actions";

export default async function NicknamePage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <main className="grid min-h-screen place-items-center bg-background bg-[image:var(--gradient-page)] px-5 py-10 text-foreground">
      <Card className="w-full max-w-md border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
        <CardHeader className="gap-4">
          <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
            Step 1 of 2
          </Badge>
          <CardTitle className="text-4xl font-semibold tracking-tight">
            Choose a nickname
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveNickname} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="nickname">
                Nickname
              </label>
              <Input
                autoComplete="nickname"
                defaultValue={profile?.nickname ?? ""}
                id="nickname"
                maxLength={32}
                minLength={2}
                name="nickname"
                placeholder="Username"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use 2 to 32 letters, numbers, spaces, hyphens, or underscores.
              </p>
            </div>

            {params?.error ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                Could not save that nickname. It may already be taken.
              </p>
            ) : null}

            <Button size="lg" type="submit">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
