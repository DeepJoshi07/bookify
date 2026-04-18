import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { useFirebase } from "../context/Firebase";
import { useEffect, useMemo, useState } from "react";

export default function OrdersPage() {
  const { user,getOrders, getBook, cancelOrder } =
    useFirebase();
  const { pushToast } = useToast();
  const [list, setList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getOrders();
      setList(data);
    };
    getData();
  }, [user,getOrders]);

  const book = useMemo(() => {
    return list.map((order) => {
      const orderData = getBook(order.bookId);
      return { ...orderData, orderId: order.id, orderAt: order.orderAt };
    });
  }, [list, getBook]);

  const handleCancelOrder = async (orderId) => {
    if (!user) return;
    await cancelOrder(orderId);
    const data = await getOrders()
    setList(data);
    pushToast("Order cancelled.", "success");
    // window.location.reload();
  };

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
          {book &&
            book.map((order) => {
              // if (!book) return null;
              return (
                <li
                  key={order.id}
                  className="flex flex-col gap-4 rounded-2xl border border-paper-200 bg-white p-4 shadow-card sm:flex-row sm:items-center dark:border-ink-700 dark:bg-ink-800 dark:shadow-card-dark"
                >
                  <img
                    src={order.coverImage}
                    alt=""
                    className="h-28 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-[4.5rem]"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/orders/${order.orderId}`}
                      className="font-display font-semibold text-ink-900 hover:text-accent dark:text-paper-50 dark:hover:text-orange-300"
                    >
                      {order.title}
                    </Link>
                    <p className="text-sm text-ink-700 dark:text-paper-300">
                      {order.author}
                    </p>
                    <p className="mt-1 text-sm font-medium text-accent dark:text-orange-300">
                      ${order.price}
                    </p>
                    <p className="mt-2 text-xs text-ink-600 dark:text-paper-400">
                      Ordered on {new Date(order.orderAt).toLocaleString()}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium 
                          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        
                      }`}
                    >
                      Active
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <Link
                      to={`/orders/${order.orderId}`}
                      className="focus-ring text-sm font-medium text-accent hover:underline dark:text-orange-300"
                    >
                      View details
                    </Link>

                    <button
                      type="button"
                      className="focus-ring rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 dark:border-red-900 dark:text-red-300"
                      onClick={() => {
                        handleCancelOrder(order.orderId);
                      }}
                    >
                      Cancel order
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
