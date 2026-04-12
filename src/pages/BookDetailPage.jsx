import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookCard } from "@/components/BookCard.jsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.jsx";
import { useBooks } from "@/context/BooksContext.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { useFirebase } from "../context/Firebase";

export function BookDetailPage() {
  const { id } = useParams();
  // const { getBook, relatedBooks, purchaseBook } = useBooks();
  const {user, getBook, relatedBooks, purchaseBook} = useFirebase();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const book = id ? getBook(id) : undefined;
  const related = id ? relatedBooks(id, 4) : [];

  const canBuy = useMemo(() => {
    if (!book || !user) return false;
    return book.status === "available" && book.sellerId !== user.id;
  }, [book, user]);

  if (!id) {
    return <LoadingSpinner label="Missing book" />;
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-paper-50">
          Book not found
        </h1>
        <Link to="/books" className="mt-4 inline-block text-accent hover:underline">
          Back to browse
        </Link>
      </div>
    );
  }

  function handleBuy() {
    if (!user) {
      navigate("/login", { state: { from: `/books/${id}` } });
      return;
    }
    if (!book) return;
    const order = purchaseBook(book.id, user.id);
    if (order) {
      pushToast("Order placed successfully.", "success");
      navigate(`/orders/${order.id}`);
    } else {
      pushToast("Could not complete purchase.", "error");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div className="overflow-hidden rounded-2xl bg-white shadow-card dark:bg-ink-800 dark:shadow-card-dark">
          <img
            src={book.coverImage}
            alt=""
            className="aspect-[2/3] w-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-ink-700 dark:text-paper-200">{book.author}</p>
          <p className="mt-4 text-3xl font-semibold text-accent dark:text-orange-300">
            ${book.price.toFixed(2)}
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-ink-600 dark:text-paper-400">ISBN</dt>
              <dd className="text-ink-900 dark:text-paper-100">{book.isbn}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-600 dark:text-paper-400">Seller email</dt>
              <dd>
                <a
                  href={`mailto:${book.sellerEmail}`}
                  className="text-accent hover:underline dark:text-orange-300"
                >
                  {book.sellerEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink-600 dark:text-paper-400">Status</dt>
              <dd className="capitalize">{book.status}</dd>
            </div>
          </dl>
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-ink-900 dark:text-paper-50">About</h2>
            <p className="mt-2 max-w-prose text-ink-700 dark:text-paper-200">
              {book.description}
            </p>
          </div>
          <div className="mt-10">
            {book.status === "sold" ? (
              <p className="text-sm text-ink-600 dark:text-paper-400">This listing is sold.</p>
            ) : (
              <button
                type="button"
                onClick={handleBuy}
                disabled={!canBuy && !!user && book.sellerId === user.id}
                className="focus-ring rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!user ? "Log in to buy" : book.sellerId === user.id ? "Your listing" : "Buy now"}
              </button>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-paper-200 pt-12 dark:border-ink-800">
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-paper-50">
            Similar books
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
