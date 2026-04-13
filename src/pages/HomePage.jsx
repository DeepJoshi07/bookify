import { Link } from "react-router-dom";
import { BookCard } from "@/components/BookCard.jsx";
import hero from "../assets/hero.png";
import { useFirebase } from "../context/Firebase";


export function HomePage() {
  const { books} = useFirebase();


  const featured = books;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-paper-100 via-white to-orange-50/40 dark:from-ink-900 dark:via-ink-900 dark:to-ink-800">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900 dark:text-paper-50 sm:text-5xl">
              Find Your Next Great Read
            </h1>
            <p className="mt-4 text-lg text-ink-700 dark:text-paper-200">
              Buy and sell books with ease and connect with fellow readers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/books"
                className="focus-ring inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-accent-dark"
              >
                Browse Books
              </Link>
              <Link
                to="/listings/new"
                className="focus-ring inline-flex items-center justify-center rounded-xl border border-paper-300 bg-white px-6 py-3 text-sm font-semibold text-ink-900 shadow-sm transition hover:bg-paper-50 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50 dark:hover:bg-ink-700"
              >
                Sell a Book
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card ring-1 ring-paper-200/90 dark:shadow-card-dark dark:ring-0">
            <img
              src={hero}
              alt=""
              className="h-full w-full object-cover brightness-[1.03] saturate-[1.06] dark:brightness-100 dark:saturate-100"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-transparent to-orange-100/35 dark:bg-gradient-to-t dark:from-ink-900/50 dark:via-transparent dark:to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-paper-50">
              Featured books
            </h2>
            <p className="mt-1 text-sm text-ink-700 dark:text-paper-300">
              Hand-picked listings from the marketplace.
            </p>
          </div>
          <Link
            to="/books"
            className="text-sm font-medium text-accent hover:underline dark:text-orange-300"
          >
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="border-y border-paper-200 bg-white/60 py-16 dark:border-ink-800 dark:bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-bold text-ink-900 dark:text-paper-50">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-paper-200 bg-paper-50 p-8 dark:border-ink-700 dark:bg-ink-800/50">
              <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-paper-50">
                Buying
              </h3>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-ink-700 dark:text-paper-200">
                <li>Browse listings and open a book to see full details.</li>
                <li>Use Buy Now to place an order (demo — stored locally).</li>
                <li>Track purchases under Orders.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-paper-200 bg-paper-50 p-8 dark:border-ink-700 dark:bg-ink-800/50">
              <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-paper-50">
                Selling
              </h3>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-ink-700 dark:text-paper-200">
                <li>
                  Create an account and add a listing with cover and price.
                </li>
                <li>
                  Manage your books under Listings — edit or remove anytime.
                </li>
                <li>When someone buys, the listing shows as sold.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
