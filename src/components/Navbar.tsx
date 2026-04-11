import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition focus-ring ${
    isActive
      ? "bg-paper-200 text-ink-900 dark:bg-ink-700 dark:text-paper-50"
      : "text-ink-700 hover:bg-paper-100 dark:text-paper-200 dark:hover:bg-ink-800"
  }`;

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-paper-200/80 bg-paper-50/90 backdrop-blur-md dark:border-ink-800 dark:bg-ink-900/90">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Link
          to="/"
          className="font-display text-xl font-bold text-ink-900 focus-ring rounded-lg dark:text-paper-50"
        >
          Bookify
        </Link>

        <button
          type="button"
          className="focus-ring rounded-lg p-2 text-ink-800 md:hidden dark:text-paper-100"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          {menuOpen ? "✕" : "☰"}
        </button>

        <div
          id="mobile-nav"
          className={`absolute left-0 right-0 top-full flex-col gap-1 border-b border-paper-200 bg-paper-50 p-4 shadow-lg dark:border-ink-800 dark:bg-ink-900 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/books" className={navClass} onClick={() => setMenuOpen(false)}>
            Browse
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/my-listings"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                Listings
              </NavLink>
              <NavLink
                to="/orders"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                Orders
              </NavLink>
              <NavLink
                to="/listings/new"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                Add Listing
              </NavLink>
            </>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring rounded-lg border border-paper-200 bg-white px-3 py-2 text-sm font-medium text-ink-800 dark:border-ink-600 dark:bg-ink-800 dark:text-paper-100"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          {user ? (
            <div className="flex items-center gap-2 pl-2">
              <img
                src={user.avatarUrl}
                alt=""
                className="h-9 w-9 rounded-full border border-paper-200 dark:border-ink-600"
                width={36}
                height={36}
              />
              <span className="max-w-[8rem] truncate text-sm font-medium text-ink-900 dark:text-paper-50">
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="focus-ring rounded-lg px-2 py-1 text-sm text-ink-700 hover:bg-paper-200 dark:text-paper-200 dark:hover:bg-ink-800"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-ink-800 dark:text-paper-100"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="focus-ring rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-dark"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="flex items-center justify-end gap-2 border-t border-paper-100 px-4 py-2 md:hidden dark:border-ink-800">
        <button
          type="button"
          onClick={toggleTheme}
          className="focus-ring rounded-lg border border-paper-200 px-3 py-1.5 text-xs dark:border-ink-600"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user ? (
          <div className="flex flex-1 items-center justify-end gap-2">
            <img
              src={user.avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full"
              width={32}
              height={32}
            />
            <span className="max-w-[6rem] truncate text-xs font-medium">{user.name}</span>
            <button type="button" onClick={logout} className="text-xs underline">
              Log out
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="text-xs font-medium underline">
              Log in
            </Link>
            <Link to="/signup" className="text-xs font-semibold text-accent">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
