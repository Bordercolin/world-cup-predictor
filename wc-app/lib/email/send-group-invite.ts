import { Resend } from "resend";

export async function sendGroupInviteEmail({
  groupName,
  inviteCode,
  recipientEmail,
}: {
  groupName: string;
  inviteCode: string;
  recipientEmail: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);

  return resend.emails.send({
    from: "World Cup Predictor <onboarding@resend.dev>",
    to: recipientEmail,
    subject: `Invite code for ${groupName}`,
    text: [
      `Your World Cup Predictor group "${groupName}" is ready.`,
      "",
      `Invite code: ${inviteCode}`,
      "",
      "Share this code with anyone you want to join your prediction group.",
    ].join("\n"),
  });
}
