import { Link } from "react-router-dom";

const social = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-paper-200 bg-white/80 dark:border-ink-800 dark:bg-ink-900/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900 dark:text-paper-50">
            Bookify
          </p>
          <p className="mt-2 max-w-xs text-sm text-ink-700 dark:text-paper-200">
            A demo marketplace for discovering, buying, and selling books.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:items-end">
          <p className="text-sm font-medium text-ink-900 dark:text-paper-100">
            Contact
          </p>
          <a
            href="mailto:hello@bookify.example"
            className="text-sm text-accent hover:underline dark:text-orange-300"
          >
            hello@bookify.example
          </a>
          <nav aria-label="Social links" className="flex gap-4">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-ink-700 hover:text-accent dark:text-paper-300 dark:hover:text-orange-300"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t border-paper-100 py-4 text-center text-xs text-ink-700 dark:border-ink-800 dark:text-paper-400">
        © {new Date().getFullYear()} Bookify.{" "}
        <Link to="/" className="underline hover:text-accent">
          Home
        </Link>
      </div>
    </footer>
  );
}
