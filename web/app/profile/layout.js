import Link from "next/link";
import { userGreetings, authorizeUserRoute } from "../_utils/userSession";

export default async function ProfileLayout({ children }) {
  // Redirects to /login if not logged in
  const { session } = await authorizeUserRoute();

  return (
    <>
      <header className="flex items-center justify-between bg-rose-800 p-4 text-white shadow-lg">
        {/* Left: Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link className="text-lg font-semibold transition hover:text-yellow-300" href="/">
            Home
          </Link>
          <Link className="text-lg font-semibold transition hover:text-yellow-300" href="/profile">
            Profile
          </Link>
          <Link className="text-lg font-semibold transition hover:text-yellow-300" href="/public_upload">
            Upload
          </Link>
        </nav>

        {/* Right: User Info & Logout */}
        <div className="flex items-center gap-6">
          <p className="text-md font-medium">{userGreetings()}</p>
          
          {session.isAdmin && (
            <Link
              className="rounded-lg bg-yellow-400 px-3 py-1 text-sm font-bold text-gray-900 transition hover:bg-yellow-300"
              href="/admin"
            >
              Admin Panel
            </Link>
          )}

          <form action="/login/logout" method="POST">
            <button
              type="submit"
              className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-rose-800 transition hover:bg-gray-200 focus:ring-2 focus:ring-yellow-400"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-rose-800 p-6">
        {children}
      </main>
    </>
  );
}
