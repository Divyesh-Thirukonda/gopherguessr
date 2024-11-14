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
  // use email stored in session for now, use id later
  // this is secure enough for now as the session is encrypted
  if (!session.email) redirect("/login");
  // check expiry as well
  if (session.expiry < DateTime.now().toSeconds()) redirect("/login");

  return { session };
}

async function authorizeAdminRoute() {
  const session = await getUserSession();
  // use email stored in session for now, use id later
  // this is secure enough for now as the session is encrypted
  if (!session.email) redirect("/login");
  // check expiry as well
  if (session.expiry < DateTime.now().toSeconds()) redirect("/login");
  // make sure they are admin
  if (!session.isAdmin) redirect("/login");

  return { session };
}

// for server actions in admin to double verify
export default async function authorizeAdminAction() {
  const { session } = await authorizeUserRoute();
  // make sure the user exists in the database before allowing them to do admin actions
  const userInDB = await prisma.user.findFirst({
    where: { email: session.email },
  });

  if (!userInDB || !userInDB.isAdmin) {
    // log the user out because something goofy is def happening if this runs
    await deleteUserSession();
  }

  // just return the user data i guess
  return userInDB;
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
  cookieStore.delete("prismaGameStateId");
  redirect("/login");
}

export {
  getUserSession,
  saveUserSession,
  deleteUserSession,
  authorizeUserRoute,
  authorizeAdminRoute,
  authorizeAdminAction,
};
