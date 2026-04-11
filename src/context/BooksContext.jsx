import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { seedBooks } from "@/data/seedBooks.js";

const BOOKS_KEY = "bookify-books";
const ORDERS_KEY = "bookify-orders";

function loadBooks() {
  try {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [...seedBooks];
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const [books, setBooks] = useState(() =>
    typeof window !== "undefined" ? loadBooks() : seedBooks
  );
  const [orders, setOrders] = useState(() =>
    typeof window !== "undefined" ? loadOrders() : []
  );

  const persistBooks = useCallback((next) => {
    setBooks(next);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(next));
  }, []);

  const persistOrders = useCallback((next) => {
    setOrders(next);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  }, []);

  const getBook = useCallback(
    (id) => books.find((b) => b.id === id),
    [books]
  );

  const booksBySeller = useCallback(
    (sellerId) => books.filter((b) => b.sellerId === sellerId),
    [books]
  );

  const addBook = useCallback(
    (input) => {
      const book = {
        ...input,
        id: uid(),
        status: input.status ?? "available",
      };
      persistBooks([book, ...books]);
      return book;
    },
    [books, persistBooks]
  );

  const updateBook = useCallback(
    (id, patch) => {
      persistBooks(
        books.map((b) => (b.id === id ? { ...b, ...patch } : b))
      );
    },
    [books, persistBooks]
  );

  const deleteBook = useCallback(
    (id) => {
      persistBooks(books.filter((b) => b.id !== id));
      persistOrders(orders.filter((o) => o.bookId !== id));
    },
    [books, orders, persistBooks, persistOrders]
  );

  const purchaseBook = useCallback(
    (bookId, userId) => {
      const book = books.find((b) => b.id === bookId);
      if (!book || book.status !== "available" || book.sellerId === userId) {
        return null;
      }
      const order = {
        id: uid(),
        bookId,
        userId,
        orderedAt: new Date().toISOString(),
        status: "active",
      };
      persistBooks(
        books.map((b) =>
          b.id === bookId ? { ...b, status: "sold" } : b
        )
      );
      persistOrders([order, ...orders]);
      return order;
    },
    [books, orders, persistBooks, persistOrders]
  );

  const cancelOrder = useCallback(
    (orderId, userId) => {
      const order = orders.find((o) => o.id === orderId && o.userId === userId);
      if (!order || order.status !== "active") return;
      const book = books.find((b) => b.id === order.bookId);
      persistOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
      if (book) {
        persistBooks(
          books.map((b) =>
            b.id === book.id ? { ...b, status: "available" } : b
          )
        );
      }
    },
    [books, orders, persistBooks, persistOrders]
  );

  const ordersForUser = useCallback(
    (userId) =>
      orders
        .filter((o) => o.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
        ),
    [orders]
  );

  const relatedBooks = useCallback(
    (bookId, limit = 4) => {
      const current = books.find((b) => b.id === bookId);
      return books
        .filter(
          (b) =>
            b.id !== bookId &&
            b.status === "available" &&
            (current
              ? b.author === current.author || b.sellerId === current.sellerId
              : true)
        )
        .slice(0, limit);
    },
    [books]
  );

  const value = useMemo(
    () => ({
      books,
      orders,
      getBook,
      booksBySeller,
      addBook,
      updateBook,
      deleteBook,
      purchaseBook,
      cancelOrder,
      ordersForUser,
      relatedBooks,
    }),
    [
      books,
      orders,
      getBook,
      booksBySeller,
      addBook,
      updateBook,
      deleteBook,
      purchaseBook,
      cancelOrder,
      ordersForUser,
      relatedBooks,
    ]
  );

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
}
