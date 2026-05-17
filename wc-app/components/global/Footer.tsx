export function Footer() {
  return (
    <footer className="px-5 pb-8 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-ink/10 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Prono Club, a football predictor concept for private World Cup groups.</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          <a className="transition-colors hover:text-ink" href="#how-it-works">
            How it works
          </a>
          <a className="transition-colors hover:text-ink" href="#matches">
            Fixtures
          </a>
          <a className="transition-colors hover:text-ink" href="/privacy">
            Privacy
          </a>
          <a className="transition-colors hover:text-ink" href="/terms">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
