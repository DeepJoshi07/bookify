import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function validate(email: string, password: string) {
  const e: Record<string, string> = {};
  if (!email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
  if (!password) e.password = "Password is required.";
  else if (password.length < 6) e.password = "At least 6 characters.";
  return e;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const next = validate(email, password);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    login(email.trim(), password);
    navigate(from, { replace: true });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
        Log in
      </h1>
      <p className="mt-2 text-sm text-ink-700 dark:text-paper-300">
        No backend — any valid-looking credentials create a session.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-ink-800 dark:text-paper-200">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 text-ink-900 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-err" : undefined}
          />
          {errors.email ? (
            <p id="login-email-err" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-ink-800 dark:text-paper-200">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 text-ink-900 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "login-password-err" : undefined}
          />
          {errors.password ? (
            <p id="login-password-err" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.password}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          className="focus-ring w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Log in
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-paper-200 dark:border-ink-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-paper-50 px-2 text-ink-600 dark:bg-ink-900 dark:text-paper-400">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-paper-200 bg-white py-3 text-sm font-medium text-ink-800 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-100"
        aria-label="Sign in with Google (demo UI only)"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </button>

      <p className="mt-8 text-center text-sm text-ink-700 dark:text-paper-300">
        New here?{" "}
        <Link to="/signup" className="font-medium text-accent hover:underline dark:text-orange-300">
          Create an account
        </Link>
      </p>
    </div>
  );
}
