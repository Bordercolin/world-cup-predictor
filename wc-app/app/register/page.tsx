import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { register } from "./actions";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Start a private table before the tournament starts."
      text="Use one account for groups, predictions, locked fixtures, and the leaderboard that follows the full World Cup."
    >
      <form action={register} className="space-y-5">
        <AuthMessage error={params.error} />

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink" htmlFor="displayName">
            Display name
          </label>
          <input
            autoComplete="name"
            className="form-field"
            id="displayName"
            name="displayName"
            placeholder="Mara De Wit"
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="form-field"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-ink" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="new-password"
            className="form-field"
            id="password"
            minLength={8}
            name="password"
            placeholder="At least 8 characters"
            required
            type="password"
          />
        </div>

        <button
          className="w-full rounded-full bg-terracotta px-7 py-4 text-center text-sm font-bold text-surface transition-transform hover:-translate-y-0.5 active:translate-y-0"
          type="submit"
        >
          Create account
        </button>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link className="font-bold text-ink underline-offset-4 hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
