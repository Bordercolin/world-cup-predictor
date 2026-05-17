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
          ? "border border-terracotta/25 bg-terracotta/10 text-danger-ink"
          : "border border-green/20 bg-green/10 text-green"
      }`}
    >
      {error ?? message}
    </div>
  );
}
