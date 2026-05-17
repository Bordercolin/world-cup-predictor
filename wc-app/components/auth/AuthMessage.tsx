type AuthMessageProps = {
  error?: string;
  message?: string;
};

export function AuthMessage({ error, message }: AuthMessageProps) {
  if (!error && !message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
        error
          ? "border border-[#d24a2a]/25 bg-[#d24a2a]/10 text-[#8f2f1c]"
          : "border border-[#165d4a]/20 bg-[#165d4a]/10 text-[#165d4a]"
      }`}
    >
      {error ?? message}
    </div>
  );
}
