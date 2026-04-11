import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.jsx";
import { AddEditListingPage } from "@/pages/AddEditListingPage.jsx";
import { BookDetailPage } from "@/pages/BookDetailPage.jsx";
import { BrowsePage } from "@/pages/BrowsePage.jsx";
import { HomePage } from "@/pages/HomePage.jsx";
import { ListingsPage } from "@/pages/ListingsPage.jsx";
import { LoginPage } from "@/pages/LoginPage.jsx";
import { NotFoundPage } from "@/pages/NotFoundPage.jsx";
import { OrderDetailPage } from "@/pages/OrderDetailPage.jsx";
import { OrdersPage } from "@/pages/OrdersPage.jsx";
import { SignupPage } from "@/pages/SignupPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="books" element={<BrowsePage />} />
          <Route path="books/:id" element={<BookDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route
            path="my-listings"
            element={
              <ProtectedRoute>
                <ListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="listings/new"
            element={
              <ProtectedRoute>
                <AddEditListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="listings/:id/edit"
            element={
              <ProtectedRoute>
                <AddEditListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:id"
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
    </BrowserRouter>
  );
}
