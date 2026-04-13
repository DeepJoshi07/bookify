import { Navigate, useLocation } from "react-router-dom";
import {LoadingSpinner} from "../components/LoadingSpinner"
import { useFirebase } from "../context/Firebase";

export function ProtectedRoute({ children }) {

  const {user,loading} = useFirebase();
  const location = useLocation();

  if(loading){
    return <LoadingSpinner/>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
