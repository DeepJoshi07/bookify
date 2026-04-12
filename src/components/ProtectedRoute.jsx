import { Navigate, useLocation } from "react-router-dom";

import { useFirebase } from "../context/Firebase";

export function ProtectedRoute({ children }) {

  const {user} = useFirebase();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
