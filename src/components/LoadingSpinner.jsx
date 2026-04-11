export function LoadingSpinner({ label = "Loading" }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-paper-200 border-t-accent dark:border-ink-600 dark:border-t-orange-400"
        aria-hidden
      />
      <span className="text-sm text-ink-700 dark:text-paper-200">{label}…</span>
    </div>
  );
}
