// this layout runs on all pages with the prefix /admin so it's a great place to check user authentication
// still need to check authentication on every server action!!

import Link from "next/link";
import { authorizeAdminRoute } from "../_utils/adminSession";

export default async function AdminLayout({ children }) {
  const { session } = await authorizeAdminRoute();

  return (
    <>
      <header className="flex flex-wrap items-center justify-between bg-gray-50 p-3">
        <Link className="font-medium underline" href="/admin">
          Admin
        </Link>
        <div className="flex items-center gap-3">
          {session.email}
          <form action="/admin-auth/logout" method="POST">
            <button type="submit" className="underline">
              logout
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}