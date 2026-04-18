import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import {LoadingSpinner} from "../components/LoadingSpinner"

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user, orders, getBook,getOrders } = useFirebase();
  const [order, setOrder] = useState(null);
  const [book, setBook] = useState(null);

  useEffect(() => {
    const getData = async () => {
      await getOrders();
    };
    getData();
  }, [user]);

  useEffect(() => {
    const data = orders.find((o) => o.id === id);
    setOrder(data ?? null);
  }, [orders, id]);

  useEffect(() => {
    if (!user || !order || !order.bookId) return;
    const data = getBook(order.bookId);
    setBook(data);
  }, [getBook, user, order]);

  const isOwner = user && order && order.userId === user.uid;

 
  useEffect(() => {
    const data = orders.find((o) => o.id === id);
    if(data === undefined){
      setOrder(null)
    }
    setOrder(data);
  }, [orders, id]);
  if (book == null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-ink-700 dark:text-paper-300">
          This book is no longer available.
        </p>
        <Link
          to="/orders"
          className="mt-4 inline-block text-accent hover:underline"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to="/orders"
        className="text-sm text-accent hover:underline dark:text-orange-300"
      >
        ← Orders
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
        Order summary
      </h1>
      <p className="mt-2 text-sm text-ink-700 dark:text-paper-300">
        Placed on {new Date(order.orderedAt).toLocaleString()}
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-paper-200 bg-white shadow-card dark:border-ink-700 dark:bg-ink-800 dark:shadow-card-dark">
        <div className="grid gap-6 p-6 sm:grid-cols-[120px_1fr]">
          <img
            src={book.coverImage}
            alt=""
            className="aspect-[2/3] w-full rounded-lg object-cover"
          />
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-paper-50">
              {book.title}
            </h2>
            <p className="text-ink-700 dark:text-paper-300">{book.author}</p>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-600 dark:text-paper-400">ISBN</dt>
                <dd>{book.isbn}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-600 dark:text-paper-400">Seller</dt>
                <dd>
                  <a
                    href={`mailto:${book.sellerEmail}`}
                    className="text-accent hover:underline"
                  >
                    {book.sellerEmail}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-600 dark:text-paper-400">Status</dt>
                <dd className="capitalize">{order.status}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-paper-100 pt-4 dark:border-ink-700">
                <dt className="font-medium text-ink-900 dark:text-paper-50">
                  Total
                </dt>
                <dd className="text-lg font-semibold text-accent dark:text-orange-300">
                  ${book.price}
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-sm text-ink-700 dark:text-paper-200">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
