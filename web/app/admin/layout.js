// this layout runs on all pages with the prefix /admin so it's a great place to check user authentication
// still need to check authentication on every server action!!

import Link from "next/link";
import { authorizeAdminRoute } from "../_utils/userSession";

export default async function AdminLayout({ children, modal }) {
  // redirects to /login if not logged in
  // runs on server
  const { session } = await authorizeAdminRoute();

  return (
    <>
      <header className="flex flex-wrap items-center justify-between bg-gray-50 p-3">
        <div className="flex items-center gap-3">
          <Link className="font-medium underline" href="/profile">
            profile
          </Link>
          <Link className="font-medium underline" href="/">
            home
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {session.email}
          {session.isAdmin && (
            <Link className="font-medium text-rose-600 underline" href="/admin">
              admin
            </Link>
          )}
          <form action="/login/logout" method="POST">
            <button type="submit" className="underline">
              logout
            </button>
          </form>
        </div>
      </header>
      {children}
      {modal}
    </>
  );
}
