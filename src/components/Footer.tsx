export default function Footer() {
  return (
    <footer className="py-12 border-t border-foreground/5">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-display text-lg font-bold tracking-tight">
          assist
        </span>
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Assist. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
