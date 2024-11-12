// all these should run on the server ONLY as they deal with cookies and encrypted sessions
import "server-only";

import { cookies } from "next/headers";
import { getIronSession, sealData } from "iron-session";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";

// gets encrypted data from the session stored in the cookie
async function getUserSession() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET,
    cookieName: "user_s",
  });
  return session;
}

async function authorizeUserRoute() {
  const session = await getUserSession();

  if (!session.email) redirect("/login");

  // check expiry as well
  if (session.expiry < DateTime.now().toSeconds()) redirect("/login");
  return { session };
}

// for login
async function saveUserSession(data) {
  const cookieStore = await cookies();
  const sealed = await sealData(
    { ...data, expiry: DateTime.now().plus({ days: 7 }).toSeconds() },
    { password: process.env.SESSION_SECRET },
  );
  cookieStore.set("user_s", sealed, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/profile"); // May be changed to profile, post, etc.  Do not know yet
}

// for logout
async function deleteUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("user_s");
  redirect("/login");
}

export {
  getUserSession,
  saveUserSession,
  deleteUserSession,
  authorizeUserRoute,
};
