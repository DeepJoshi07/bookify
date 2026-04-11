import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { useBooks } from "@/context/BooksContext.jsx";
import { useToast } from "@/context/ToastContext.jsx";

const empty = {
  title: "",
  isbn: "",
  author: "",
  email: "",
  price: "",
  coverUrl: "",
  description: "",
};

function validate(f, userEmail) {
  const e = {};
  if (!f.title.trim()) e.title = "Book name is required.";
  if (!f.isbn.trim()) e.isbn = "ISBN is required.";
  else if (!/^[\d\-Xx]{10,17}$/.test(f.isbn.replace(/\s/g, "")))
    e.isbn = "Enter a valid ISBN (10–13 digits).";
  if (!f.author.trim()) e.author = "Author is required.";
  const em = f.email.trim() || userEmail;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = "Enter a valid email.";
  const p = parseFloat(f.price);
  if (Number.isNaN(p) || p <= 0) e.price = "Enter a valid price.";
  if (!f.coverUrl.trim()) e.coverUrl = "Cover image URL is required.";
  else {
    try {
      new URL(f.coverUrl);
    } catch {
      e.coverUrl = "Enter a valid image URL.";
    }
  }
  if (!f.description.trim()) e.description = "Description is required.";
  return e;
}

export function AddEditListingPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const { getBook, addBook, updateBook } = useBooks();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    if (!id || !user) return;
    const book = getBook(id);
    if (!book || book.sellerId !== user.id) {
      navigate("/my-listings", { replace: true });
      return;
    }
    setForm({
      title: book.title,
      isbn: book.isbn,
      author: book.author,
      email: book.sellerEmail,
      price: String(book.price),
      coverUrl: book.coverUrl,
      description: book.description,
    });
  }, [id, user, getBook, navigate]);

  function handleFile(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") {
        setForm((f) => ({ ...f, coverUrl: r }));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!user) return;
    const next = validate(form, user.email);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const price = parseFloat(form.price);
    const sellerEmail = form.email.trim() || user.email;

    if (isEdit && id) {
      updateBook(id, {
        title: form.title.trim(),
        isbn: form.isbn.trim(),
        author: form.author.trim(),
        sellerEmail,
        price,
        coverUrl: form.coverUrl.trim(),
        description: form.description.trim(),
      });
      pushToast("Listing updated.", "success");
    } else {
      addBook({
        title: form.title.trim(),
        isbn: form.isbn.trim(),
        author: form.author.trim(),
        sellerEmail,
        price,
        coverUrl: form.coverUrl.trim(),
        description: form.description.trim(),
        sellerId: user.id,
      });
      pushToast("Listing added.", "success");
    }
    navigate("/my-listings");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
        {isEdit ? "Edit listing" : "Add listing"}
      </h1>
      <p className="mt-2 text-sm text-ink-700 dark:text-paper-300">
        Demo only — data is saved in your browser.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <Field
          label="Book name"
          id="f-title"
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          error={errors.title}
        />
        <Field
          label="ISBN"
          id="f-isbn"
          value={form.isbn}
          onChange={(v) => setForm((f) => ({ ...f, isbn: v }))}
          error={errors.isbn}
          hint="Digits with optional hyphens"
        />
        <Field
          label="Author"
          id="f-author"
          value={form.author}
          onChange={(v) => setForm((f) => ({ ...f, author: v }))}
          error={errors.author}
        />
        <Field
          label="Email"
          id="f-email"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          error={errors.email}
          hint={`Defaults to your account: ${user?.email ?? ""}`}
        />
        <div>
          <label htmlFor="f-price" className="block text-sm font-medium text-ink-800 dark:text-paper-200">
            Price (USD)
          </label>
          <input
            id="f-price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-invalid={!!errors.price}
          />
          {errors.price ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.price}
            </p>
          ) : null}
        </div>
        <div>
          <span className="block text-sm font-medium text-ink-800 dark:text-paper-200">
            Cover image
          </span>
          <p className="mt-1 text-xs text-ink-600 dark:text-paper-400">
            Upload a file (stored as data URL) or paste an image URL below.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="focus-ring mt-2 block w-full text-sm"
            aria-label="Upload cover image"
          />
          {fileName ? (
            <p className="mt-1 text-xs text-ink-600">Selected: {fileName}</p>
          ) : null}
          <label htmlFor="f-cover-url" className="mt-3 block text-xs font-medium text-ink-700 dark:text-paper-400">
            Image URL
          </label>
          <input
            id="f-cover-url"
            value={form.coverUrl}
            onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value }))}
            placeholder="https://…"
            className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 text-sm dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-invalid={!!errors.coverUrl}
          />
          {errors.coverUrl ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.coverUrl}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="f-desc" className="block text-sm font-medium text-ink-800 dark:text-paper-200">
            About
          </label>
          <textarea
            id="f-desc"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-invalid={!!errors.description}
          />
          {errors.description ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.description}
            </p>
          ) : null}
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="focus-ring rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
          >
            {isEdit ? "Save changes" : "Publish listing"}
          </button>
          <Link
            to="/my-listings"
            className="focus-ring rounded-xl border border-paper-200 px-6 py-3 text-sm font-medium dark:border-ink-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  hint,
  type = "text",
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-800 dark:text-paper-200">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-xs text-ink-600 dark:text-paper-400">{hint}</p> : null}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
        aria-invalid={!!error}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
