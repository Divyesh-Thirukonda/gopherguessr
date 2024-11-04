// this layout runs on all pages with the prefix /admin so it's a great place to check user authentication
// still need to check authentication on every server action!!

import { authorizeAdminRoute } from "../_utils/adminSession";

export default async function AdminLayout({ children }) {
  const { session } = await authorizeAdminRoute();

  return (
    <>
      <div>logged in as: {session.email}</div>
      <form action="/admin-auth/logout" method="POST">
        <button type="submit" className="underline">
          logout
        </button>
      </form>
      {children}
    </>
  );
}
