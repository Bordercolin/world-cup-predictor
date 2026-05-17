import Link from "next/link";
import { Footer } from "@/components/global";

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f5f1e8] px-5 py-10 text-[#152016] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link className="text-sm font-bold text-[#405143] transition-colors hover:text-[#152016]" href="/">
          Back to home
        </Link>
        <p className="mt-16 font-mono text-sm font-black uppercase tracking-[0.24em] text-[#d24a2a]">
          Privacy
        </p>
        <h1 className="mt-4 text-5xl font-black leading-none tracking-[-0.055em] sm:text-7xl">
          Privacy policy
        </h1>
        <div className="mt-10 space-y-6 text-lg leading-8 text-[#405143]">
          <p>
            Prono Club is currently a product concept. When accounts, groups, and predictions are
            added, this page will explain what data is collected and how it is used.
          </p>
          <p>
            The intended product data is limited to what the game needs: account details, private
            group membership, predictions, scores, and leaderboard activity.
          </p>
        </div>
      </div>
      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
