import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedBooks } from "@/data/seedBooks";
import type { Book, Order } from "@/types";

const BOOKS_KEY = "bookify-books";
const ORDERS_KEY = "bookify-orders";

function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (raw) return JSON.parse(raw) as Book[];
  } catch {
    /* ignore */
  }
  return [...seedBooks];
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw) as Order[];
  } catch {
    /* ignore */
  }
  return [];
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type BooksContextValue = {
  books: Book[];
  orders: Order[];
  getBook: (id: string) => Book | undefined;
  booksBySeller: (sellerId: string) => Book[];
  addBook: (book: Omit<Book, "id" | "status"> & { status?: Book["status"] }) => Book;
  updateBook: (id: string, patch: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  purchaseBook: (bookId: string, userId: string) => Order | null;
  cancelOrder: (orderId: string, userId: string) => void;
  ordersForUser: (userId: string) => Order[];
  relatedBooks: (bookId: string, limit?: number) => Book[];
};

const BooksContext = createContext<BooksContextValue | null>(null);

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() =>
    typeof window !== "undefined" ? loadBooks() : seedBooks
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    typeof window !== "undefined" ? loadOrders() : []
  );

  const persistBooks = useCallback((next: Book[]) => {
    setBooks(next);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(next));
  }, []);

  const persistOrders = useCallback((next: Order[]) => {
    setOrders(next);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  }, []);

  const getBook = useCallback(
    (id: string) => books.find((b) => b.id === id),
    [books]
  );

  const booksBySeller = useCallback(
    (sellerId: string) => books.filter((b) => b.sellerId === sellerId),
    [books]
  );

  const addBook = useCallback(
    (input: Omit<Book, "id" | "status"> & { status?: Book["status"] }) => {
      const book: Book = {
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
    (id: string, patch: Partial<Book>) => {
      persistBooks(
        books.map((b) => (b.id === id ? { ...b, ...patch } : b))
      );
    },
    [books, persistBooks]
  );

  const deleteBook = useCallback(
    (id: string) => {
      persistBooks(books.filter((b) => b.id !== id));
      persistOrders(orders.filter((o) => o.bookId !== id));
    },
    [books, orders, persistBooks, persistOrders]
  );

  const purchaseBook = useCallback(
    (bookId: string, userId: string): Order | null => {
      const book = books.find((b) => b.id === bookId);
      if (!book || book.status !== "available" || book.sellerId === userId) {
        return null;
      }
      const order: Order = {
        id: uid(),
        bookId,
        userId,
        orderedAt: new Date().toISOString(),
        status: "active",
      };
      persistBooks(
        books.map((b) =>
          b.id === bookId ? { ...b, status: "sold" as const } : b
        )
      );
      persistOrders([order, ...orders]);
      return order;
    },
    [books, orders, persistBooks, persistOrders]
  );

  const cancelOrder = useCallback(
    (orderId: string, userId: string) => {
      const order = orders.find((o) => o.id === orderId && o.userId === userId);
      if (!order || order.status !== "active") return;
      const book = books.find((b) => b.id === order.bookId);
      persistOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" as const } : o
        )
      );
      if (book) {
        persistBooks(
          books.map((b) =>
            b.id === book.id ? { ...b, status: "available" as const } : b
          )
        );
      }
    },
    [books, orders, persistBooks, persistOrders]
  );

  const ordersForUser = useCallback(
    (userId: string) =>
      orders
        .filter((o) => o.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
        ),
    [orders]
  );

  const relatedBooks = useCallback(
    (bookId: string, limit = 4) => {
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
