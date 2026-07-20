import type { Metadata } from 'next';
import './globals.css';
import ChatWidgetLoader from "./components/ChatWidgetLoader";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
           <ChatWidgetLoader />
        </main>
      </body>
    </html>
  );
}