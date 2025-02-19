import Link from "next/link";
import { userGreetings, authorizeUserRoute } from "../_utils/userSession";

export default async function ProfileLayout({ children }) {
  // redirects to /login if not logged in
  const { session } = await authorizeUserRoute();

  return (
    <>
      <header className="flex flex-wrap items-center justify-between bg-rose-800 p-3 text-white">
        <div className="flex items-center gap-3">
          <Link className="font-medium underline" href="/">
            Home
          </Link>
          <Link className="font-medium underline" href="/profile">
            Profile
          </Link>
          <Link className="font-medium underline" href="/public_upload">
            Upload
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-medium">
            {userGreetings()}
          </p>
          {session.isAdmin && (
            <Link className="font-medium underline" href="/admin">
              Admin
            </Link>
          )}
          <form action="/login/logout" method="POST">
            <button type="submit" className="underline">
              Logout
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
