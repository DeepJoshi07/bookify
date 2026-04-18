import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookCard } from "@/components/BookCard.jsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { useFirebase } from "../context/Firebase";

export default function BookDetailPage() {
  const { id } = useParams();
  const { user, books, getBook, getBooks, relatedBooks, purchaseBook } =
    useFirebase();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isBuy, setIsBuy] = useState(false);

  useEffect(() => {
    const data = getBook(id);
    setBook(data);
  }, [books, getBooks]);

  const [related, setRelated] = useState([]);

  useEffect(() => {
    const data = relatedBooks(id, 4);
    setRelated(data);
  }, [books, getBook]);

  if (!id) {
    return <LoadingSpinner label="Missing book" />;
  }

  if (!book) {
    return <LoadingSpinner />;
  }
  if (book.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-paper-50">
          Book not found
        </h1>
        <Link
          to="/books"
          className="mt-4 inline-block text-accent hover:underline"
        >
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
    const getData = async () => {
      setIsBuy(true);
      const data = await purchaseBook(book.id, user.uid);
      if (data) {
        setIsBuy(false);
        pushToast("Order placed successfully.", "success");
        navigate(`/orders/${data.id}`);
      } else {
        setIsBuy(false);
        pushToast("Could not complete purchase.", "error");
      }
    };
    getData();
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
          <p className="mt-2 text-lg text-ink-700 dark:text-paper-200">
            {book.author}
          </p>
          <p className="mt-4 text-3xl font-semibold text-accent dark:text-orange-300">
            ${book.price}
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-ink-600 dark:text-paper-400">
                ISBN
              </dt>
              <dd className="text-ink-900 dark:text-paper-100">{book.isbn}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-600 dark:text-paper-400">
                Seller email
              </dt>
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
              <dt className="font-medium text-ink-600 dark:text-paper-400">
                Status
              </dt>
              <dd className="capitalize">{book.status}</dd>
            </div>
          </dl>
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-ink-900 dark:text-paper-50">
              About
            </h2>
            <p className="mt-2 max-w-prose text-ink-700 dark:text-paper-200">
              {book.description}
            </p>
          </div>
          <div className="mt-10">
            {book.status === "sold" ? (
              <p className="text-sm text-ink-600 dark:text-paper-400">
                This listing is sold.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleBuy}
                disabled={!books && !!user && book.sellerId === user.id}
                className="focus-ring rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!user
                  ? "Log in to buy"
                  : book.sellerId === user.id
                    ? "Your listing"
                    : isBuy
                      ? "Buying...."
                      : "Buy Now"}
              </button>
            )}
          </div>
        </div>
      </div>

      {related && related.length > 0 ? (
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
