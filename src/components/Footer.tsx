export default function Footer() {
  return (
    <footer className="py-12 border-t border-foreground/5">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg font-bold tracking-tight">
            assist
          </span>
          <a
            href="mailto:steve@supermagicapps.com"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            steve@supermagicapps.com
          </a>
        </div>
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Assist. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
