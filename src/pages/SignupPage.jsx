import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase";


function validate(email, password, confirm) {
  const e = {};

  if (!email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
  if (!password) e.password = "Password is required.";
  else if (password.length < 6) e.password = "At least 6 characters.";
  if (password !== confirm) e.confirm = "Passwords do not match.";
  return e;
}

export function SignupPage() {
  const { signup,googleLogin } = useFirebase();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(ev) {
    ev.preventDefault();
    const next = validate(email, password, confirm);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    signup(email.trim(), password);
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
        Sign up
      </h1>
      <p className="mt-2 text-sm text-ink-700 dark:text-paper-300">
        Create a demo profile to manage listings and orders.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-ink-800 dark:text-paper-200">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "signup-email-err" : undefined}
          />
          {errors.email ? (
            <p id="signup-email-err" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-ink-800 dark:text-paper-200">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "signup-password-err" : undefined}
          />
          {errors.password ? (
            <p id="signup-password-err" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.password}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-medium text-ink-800 dark:text-paper-200">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="focus-ring mt-1 w-full rounded-xl border border-paper-200 bg-white px-4 py-3 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-50"
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? "signup-confirm-err" : undefined}
          />
          {errors.confirm ? (
            <p id="signup-confirm-err" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.confirm}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          className="focus-ring w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Create account
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
      onClick={googleLogin}
        type="button"
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-paper-200 bg-white py-3 text-sm font-medium dark:border-ink-600 dark:bg-ink-800 dark:text-paper-100"
        aria-label="Sign up with Google (demo UI only)"
      >
        Sign up with Google
      </button>

      <p className="mt-8 text-center text-sm text-ink-700 dark:text-paper-300">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-accent hover:underline dark:text-orange-300">
          Log in
        </Link>
      </p>
    </div>
  );
}
