import { Link } from "react-router-dom";
import { BookCard } from "@/components/BookCard.jsx";
import { EmptyState } from "@/components/EmptyState.jsx";
import { useBooks } from "@/context/BooksContext.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { useFirebase } from "../context/Firebase";
import { useEffect, useState } from "react";

export function ListingsPage() {
  const {user,books, booksBySeller, deleteBook  } = useFirebase();
  const { pushToast } = useToast();

 
  const [mine,setMine] = useState([]);
  useEffect(() => {
      const getData = async() => {
        const data = await booksBySeller();
        setMine(data);
      }
      getData()
  },[user,books])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
            Your listings
          </h1>
          <p className="mt-1 text-sm text-ink-700 dark:text-paper-300">
            Manage books you are selling on Bookify.
          </p>
        </div>
        <Link
          to="/listings/new"
          className="focus-ring inline-flex justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Add new listing
        </Link>
      </div>

      {mine && mine.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No listings yet"
            description="List your first book to appear here."
            action={
              <Link
                to="/listings/new"
                className="inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                Add listing
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mine && mine.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              showStatus
              actions={
                <>
                  <Link
                    to={`/listings/${book.id}/edit`}
                    className="focus-ring rounded-lg border border-paper-200 px-3 py-1.5 text-xs font-medium dark:border-ink-600"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="focus-ring rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 dark:border-red-900 dark:text-red-300"
                    onClick={() => {
                      if (confirm(`Delete "${book.title}"?`)) {
                        deleteBook(book.id);
                        pushToast("Listing removed.", "success");
                      }
                    }}
                  >
                    Delete
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

