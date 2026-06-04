"use server";

import { redirect } from "next/navigation";

import { sendGroupInviteEmail } from "@/lib/email/send-group-invite";
import { createClient } from "@/utils/supabase/server";

type GroupResult = {
  id: string;
  name: string;
  invite_code: string;
};

function firstGroupResult(data: GroupResult[] | GroupResult | null): GroupResult | null {
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  return data;
}

export async function joinGroup(formData: FormData) {
  const inviteCode = String(formData.get("inviteCode") ?? "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.rpc("join_prediction_group", {
    invite_code_input: inviteCode,
  });

  if (error) {
    redirect("/onboarding/group?joinError=1");
  }

  redirect("/");
}

export async function createGroup(formData: FormData) {
  const groupName = String(formData.get("groupName") ?? "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase.rpc("create_prediction_group", {
    group_name: groupName,
  });
  const group = firstGroupResult(data as GroupResult[] | GroupResult | null);

  if (error || !group) {
    redirect("/onboarding/group?createError=1");
  }

  let emailStatus = "sent";

  if (user.email) {
    try {
      await sendGroupInviteEmail({
        groupName: group.name,
        inviteCode: group.invite_code,
        recipientEmail: user.email,
      });
    } catch {
      emailStatus = "failed";
    }
  } else {
    emailStatus = "failed";
  }

  const params = new URLSearchParams({
    created: group.invite_code,
    group: group.name,
    email: emailStatus,
  });

  redirect(`/onboarding/group?${params.toString()}`);
}
