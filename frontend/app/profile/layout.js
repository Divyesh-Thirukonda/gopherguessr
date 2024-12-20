import Link from "next/link";
import { authorizeUserRoute } from "../_utils/userSession";

export default async function ProfileLayout({ children }) {
  // redirects to /login if not logged in
  const { session } = await authorizeUserRoute();

  return (
    <>
      <header className="flex flex-wrap items-center justify-between bg-rose-800 p-3 text-white">
        <div className="flex items-center gap-3">
          <Link className="font-medium underline" href="/">
            home
          </Link>
          <Link className="font-medium underline" href="/profile">
            profile
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {session.email}
          {session.isAdmin && (
            <Link className="font-medium underline" href="/admin">
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
    </>
  );
}
