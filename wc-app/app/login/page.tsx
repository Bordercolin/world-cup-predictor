import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in before the next kickoff locks."
      text="Get back to your private groups, update open predictions, and see who moved on the table overnight."
    >
      <form action={login} className="space-y-5">
        <AuthMessage error={params.error} message={params.message} />
        <input name="next" type="hidden" value={params.next ?? "/home"} />

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#152016]" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="w-full rounded-2xl border border-[#152016]/15 bg-[#f5f1e8] px-4 py-3 text-base outline-none transition-colors focus:border-[#1d345e]"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#152016]" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className="w-full rounded-2xl border border-[#152016]/15 bg-[#f5f1e8] px-4 py-3 text-base outline-none transition-colors focus:border-[#1d345e]"
            id="password"
            name="password"
            placeholder="Your password"
            required
            type="password"
          />
        </div>

        <button
          className="w-full rounded-full bg-[#152016] px-7 py-4 text-center text-sm font-bold text-[#fff8ec] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          type="submit"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-[#405143]">
          New to Prono Club?{" "}
          <Link className="font-bold text-[#152016] underline-offset-4 hover:underline" href="/register">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
