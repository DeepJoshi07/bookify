import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/context/BooksContext";
import { useToast } from "@/context/ToastContext";

export function OrdersPage() {
  const { user } = useAuth();
  const { ordersForUser, getBook, cancelOrder } = useBooks();
  const { pushToast } = useToast();

  const list = user ? ordersForUser(user.id) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
        Your orders
      </h1>
      <p className="mt-2 text-sm text-ink-700 dark:text-paper-300">
        Purchases you have made on Bookify.
      </p>

      {list.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No orders yet"
            description="Browse the marketplace and use Buy now on a listing."
            action={
              <Link
                to="/books"
                className="inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                Browse books
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {list.map((order) => {
            const book = getBook(order.bookId);
            if (!book) return null;
            return (
              <li
                key={order.id}
                className="flex flex-col gap-4 rounded-2xl border border-paper-200 bg-white p-4 shadow-card sm:flex-row sm:items-center dark:border-ink-700 dark:bg-ink-800 dark:shadow-card-dark"
              >
                <img
                  src={book.coverUrl}
                  alt=""
                  className="h-28 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-[4.5rem]"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/orders/${order.id}`}
                    className="font-display font-semibold text-ink-900 hover:text-accent dark:text-paper-50 dark:hover:text-orange-300"
                  >
                    {book.title}
                  </Link>
                  <p className="text-sm text-ink-700 dark:text-paper-300">{book.author}</p>
                  <p className="mt-1 text-sm font-medium text-accent dark:text-orange-300">
                    ${book.price.toFixed(2)}
                  </p>
                  <p className="mt-2 text-xs text-ink-600 dark:text-paper-400">
                    Ordered {new Date(order.orderedAt).toLocaleString()}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === "active"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-paper-200 text-ink-700 dark:bg-ink-700 dark:text-paper-300"
                    }`}
                  >
                    {order.status === "active" ? "Active" : "Cancelled"}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <Link
                    to={`/orders/${order.id}`}
                    className="focus-ring text-sm font-medium text-accent hover:underline dark:text-orange-300"
                  >
                    View details
                  </Link>
                  {order.status === "active" ? (
                    <button
                      type="button"
                      className="focus-ring rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 dark:border-red-900 dark:text-red-300"
                      onClick={() => {
                        if (!user) return;
                        cancelOrder(order.id, user.id);
                        pushToast("Order cancelled.", "success");
                      }}
                    >
                      Cancel order
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
