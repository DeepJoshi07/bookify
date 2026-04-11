import { useMemo, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { EmptyState } from "@/components/EmptyState";
import { useBooks } from "@/context/BooksContext";

export function BrowsePage() {
  const { books } = useBooks();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "available" | "sold">("available");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.includes(q)
      );
    });
  }, [books, query, status]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
        Browse books
      </h1>
      <p className="mt-2 text-sm text-ink-700 dark:text-paper-300">
        Search by title, author, or ISBN. Filter by availability.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="browse-search" className="sr-only">
            Search books
          </label>
          <input
            id="browse-search"
            type="search"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="focus-ring w-full rounded-xl border border-paper-200 bg-white px-4 py-3 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-label="Search books by title, author, or ISBN"
          />
        </div>
        <div>
          <label htmlFor="browse-status" className="block text-xs font-medium text-ink-700 dark:text-paper-400">
            Status
          </label>
          <select
            id="browse-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="focus-ring mt-1 rounded-xl border border-paper-200 bg-white px-4 py-3 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No books match your filters"
            description="Try a different search or show all statuses."
            action={
              <button
                type="button"
                className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Reset filters
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} showStatus />
          ))}
        </div>
      )}
    </div>
  );
}
