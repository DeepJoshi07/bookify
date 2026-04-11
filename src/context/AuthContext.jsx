import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

function makeUser(name, email) {
  return {
    id: `user-${email.replace(/[^a-z0-9]/gi, "-")}`,
    name,
    email,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((email, _password) => {
    void _password;
    const name = email.split("@")[0]?.replace(/\./g, " ") ?? "Reader";
    setUser(makeUser(name, email));
  }, []);

  const signup = useCallback((name, email, _password) => {
    void _password;
    setUser(makeUser(name.trim() || "Reader", email));
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, login, signup, logout }),
    [user, login, signup, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
