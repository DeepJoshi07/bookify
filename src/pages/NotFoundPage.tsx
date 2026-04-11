import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-display font-bold text-paper-200 dark:text-ink-700">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink-900 dark:text-paper-50">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-ink-700 dark:text-paper-300">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        to="/"
        className="focus-ring mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
      >
        Go home
      </Link>
    </div>
  );
}
