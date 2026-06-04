import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";

import { createGroup, joinGroup } from "./actions";

export default async function GroupOnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{
    created?: string;
    group?: string;
    email?: string;
    joinError?: string;
    createError?: string;
  }>;
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
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding/nickname");
  }

  const { data: membership } = await supabase
    .from("prediction_group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membership && !params?.created) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-background bg-[image:var(--gradient-page)] px-5 py-10 text-foreground sm:px-8">
      <div className="mx-auto grid max-w-4xl gap-6">
        <Card className="border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
          <CardHeader className="gap-4">
            <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
              Step 2 of 2
            </Badge>
            <CardTitle className="text-4xl font-semibold tracking-tight">
              Join your prediction group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Use an invite code from a friend, or create a new group and share its code with the
              people you want to compete with.
            </p>
          </CardContent>
        </Card>

        {params?.created ? (
          <Card className="border-primary/20 bg-primary/5 bg-[image:var(--gradient-score)] p-2 sm:p-4">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Group created: {params.group ?? "Your group"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-xl border bg-background p-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Invite code
                </p>
                <p className="mt-2 font-mono text-4xl font-semibold tracking-[0.18em]">
                  {params.created}
                </p>
              </div>
              {params.email === "failed" ? (
                <p className="text-sm text-muted-foreground">
                  The group was created, but the email could not be sent. You can still share the
                  code above.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  We sent this code to your Google account email as well.
                </p>
              )}
              <Button render={<Link href="/" />}>Go to matches</Button>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-primary/15 p-2 sm:p-4">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">Join by code</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={joinGroup} className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="inviteCode">
                    Invite code
                  </label>
                  <Input
                    autoCapitalize="characters"
                    id="inviteCode"
                    maxLength={6}
                    minLength={6}
                    name="inviteCode"
                    placeholder="ABC123"
                    required
                  />
                </div>
                {params?.joinError ? (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    No group found for that invite code.
                  </p>
                ) : null}
                <Button type="submit">Join group</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/15 p-2 sm:p-4">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">Create a group</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createGroup} className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="groupName">
                    Group name
                  </label>
                  <Input
                    id="groupName"
                    maxLength={64}
                    minLength={2}
                    name="groupName"
                    placeholder="Office league"
                    required
                  />
                </div>
                {params?.createError ? (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    Could not create that group. Try a different name.
                  </p>
                ) : null}
                <Button type="submit">Create group</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
