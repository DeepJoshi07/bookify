import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer.jsx";
import { Navbar } from "@/components/Navbar.jsx";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
