import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.jsx";
import { NotFoundPage } from "@/pages/NotFoundPage.jsx";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";

const HomePage = lazy(() => import("./pages/HomePage"));
const BrowsePage = lazy(() => import("./pages/BrowsePage"));
const BookDetailPage = lazy(() => import("./pages/BookDetailPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ListingsPage = lazy(() => import("./pages/ListingsPage"));
const AddEditListingPage = lazy(() => import("./pages/AddEditListingPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner/>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index path="/" element={<HomePage />} />
            <Route path="/books" element={<BrowsePage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <ListingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/new"
              element={
                <ProtectedRoute>
                  <AddEditListingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/:id/edit"
              element={
                <ProtectedRoute>
                  <AddEditListingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
