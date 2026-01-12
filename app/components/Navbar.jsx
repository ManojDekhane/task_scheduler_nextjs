"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthBar from "./AuthBar";

export default function Navbar() {
  const path = usePathname();

  return (
    <nav
      style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.05)",
      }}
    >
      <h2>⏰ Task Scheduler</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link style={{ opacity: path === "/" ? 1 : 0.6 }} href="/">
          Home
        </Link>
        <Link style={{ opacity: path === "/dashboard" ? 1 : 0.6 }} href="/dashboard">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
