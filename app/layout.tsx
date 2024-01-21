import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import { Toaster, toast } from "sonner";
import StoreModalProvider from "@/providers/store-modal-provider";
import { getAuthSession } from "@/lib/next-auth-options";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CartCraze admin",
  description: "The best e-commerce platform for your business",
  icons: [{ href: "/logo.png", url: "/logo.png" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster />
          <StoreModalProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
