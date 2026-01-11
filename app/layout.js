import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Task Scheduler",
  description: "Smart task scheduling with reminders",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main
          style={{
            padding: "40px",
            maxWidth: "900px",
            margin: "auto",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
