import Link from "next/link";
import { authorizeUserRoute } from "../_utils/userSession";

export default async function ProfileLayout({ children }) {
  // redirects to /login if not logged in
  const { session } = await authorizeUserRoute();

  return (
    <>
      <header className="flex flex-wrap items-center justify-between bg-gray-50 p-3">
        <Link className="font-medium underline" href="/profile">
          Profile
        </Link>
        <div className="flex items-center gap-3">
          {session.email}
          {session.isAdmin && (
            <form action="/admin">
              <button type="submit" className="underline">
                admin
              </button>
            </form>
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
