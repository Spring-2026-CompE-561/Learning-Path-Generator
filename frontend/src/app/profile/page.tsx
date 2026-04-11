"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { logout as apiLogout } from "@/lib/api";

export default function ProfilePage() {
  const { user, token, isLoggedIn, clearAuth } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    if (token) {
      try {
        await apiLogout(token);
      } catch {
        // Even if the API call fails, clear local auth
      }
    }
    clearAuth();
    router.push("/");
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-8">Account</h1>

      <div className="bg-card-bg border border-card-border rounded-lg p-6">
        {/* Profile picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-white mb-3">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
        </div>

        {/* User info */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p className="border border-card-border rounded px-3 py-2 bg-gray-50 text-sm">
              {user.username}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="border border-card-border rounded px-3 py-2 bg-gray-50 text-sm">
              {user.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-semibold py-2.5 rounded hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
