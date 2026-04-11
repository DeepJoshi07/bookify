export function EmptyState({ title, description, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-paper-200 bg-white/60 px-8 py-16 text-center dark:border-ink-700 dark:bg-ink-800/40"
      role="status"
    >
      <p className="font-display text-xl font-semibold text-ink-900 dark:text-paper-50">
        {title}
      </p>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-ink-700 dark:text-paper-200">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
