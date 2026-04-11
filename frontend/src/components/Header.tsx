"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  function switchToRegister() {
    setShowLogin(false);
    setShowRegister(true);
  }

  function switchToLogin() {
    setShowRegister(false);
    setShowLogin(true);
  }

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/schedule", label: "Schedule" },
    { href: "/profile", label: "Account" },
  ];

  return (
    <>
      {/* Top header bar */}
      <header className="bg-header-bg text-header-text">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Learning Path Generator
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </Link>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-primary font-semibold px-4 py-1.5 rounded hover:bg-gray-100 transition-colors text-sm"
              >
                Log In
              </button>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        {isLoggedIn && (
          <nav className="flex px-6 gap-1 bg-primary-dark">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                  pathname === link.href
                    ? "bg-background text-foreground"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={switchToRegister}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
}
