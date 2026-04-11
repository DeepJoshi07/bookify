import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Book } from "@/types";

type Props = {
  book: Book;
  showStatus?: boolean;
  actions?: ReactNode;
};

export function BookCard({ book, showStatus, actions }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-ink-800 dark:shadow-card-dark">
      <Link
        to={`/books/${book.id}`}
        className="focus-ring relative block aspect-[2/3] overflow-hidden bg-paper-200 dark:bg-ink-700"
        aria-label={`View ${book.title}`}
      >
        <img
          src={book.coverUrl}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {showStatus && (
          <span
            className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
              book.status === "sold"
                ? "bg-ink-800/90 text-white"
                : "bg-emerald-600/90 text-white"
            }`}
          >
            {book.status === "sold" ? "Sold" : "Available"}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <Link
            to={`/books/${book.id}`}
            className="focus-ring font-display text-lg font-semibold text-ink-900 line-clamp-2 dark:text-paper-50"
          >
            {book.title}
          </Link>
          <p className="text-sm text-ink-700 dark:text-paper-200">{book.author}</p>
        </div>
        <p className="mt-auto text-lg font-semibold text-accent dark:text-orange-300">
          ${book.price.toFixed(2)}
        </p>
        {actions ? <div className="flex flex-wrap gap-2 pt-2">{actions}</div> : null}
      </div>
    </article>
  );
}
