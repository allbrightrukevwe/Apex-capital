import type { Metadata } from 'next';
import './globals.css';
import ChatWidgetLoader from "./components/ChatWidgetLoader";
import { ToastProvider } from "@/lib/toast";   // ← changed to lib

export const metadata: Metadata = {
  title: "KYC Verification · Nroxtrade",
  description: "Complete your KYC verification to start trading.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950">
        <ToastProvider>
          <main className="min-h-screen">
            {children}
            <ChatWidgetLoader />
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}