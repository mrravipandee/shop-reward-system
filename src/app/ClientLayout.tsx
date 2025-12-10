"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const hiddenRoutes = ["/coins", "/dashboard", "/purchase", "/login", "/register", "/dashboard/home", "/dashboard/customers", "/dashboard/purchase", "/dashboard/rewards", "/dashboard/winners", "/dashboard/spins", "/dashboard/redeem", "/dashboard/transactions", "/dashboard/offers", "/dashboard/inventory", "/dashboard/settings"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = hiddenRoutes.includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
