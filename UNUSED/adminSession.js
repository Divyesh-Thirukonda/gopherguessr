// // all these should run on the server ONLY as they deal with cookies and encrypted sessions
// import "server-only";

// import { cookies } from "next/headers";
// import { getIronSession, sealData } from "iron-session";
// import { redirect } from "next/navigation";
// import { DateTime } from "luxon";

// // gets encrypted data from the session stored in the cookie
// async function getAdminSession() {
//   const cookieStore = await cookies();
//   const session = await getIronSession(cookieStore, {
//     password: process.env.SESSION_SECRET,
//     cookieName: "admin_s",
//   });
//   return session;
// }

// // use on all pages that need to be admin only
// async function authorizeAdminRoute() {
//   const session = await getAdminSession();
//   // use email stored in session for now, use id later
//   // this is secure enough for now as the session is encrypted
//   if (!session.email) redirect("/login");
//   // check expiry as well
//   if (session.expiry < DateTime.now().toSeconds()) redirect("/login");
//   return { session };
// }

// // for login
// async function saveAdminSession(data) {
//   const cookieStore = await cookies();
//   const sealed = await sealData(
//     { ...data, expiry: DateTime.now().plus({ days: 7 }).toSeconds() },
//     { password: process.env.SESSION_SECRET },
//   );
//   cookieStore.set("admin_s", sealed, {
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7,
//   });
//   redirect("/profile");
// }

// // for logout
// async function deleteAdminSession() {
//   const cookieStore = await cookies();
//   cookieStore.delete("admin_s");
//   redirect("/login");
// }

// export {
//   getAdminSession,
//   authorizeAdminRoute,
//   saveAdminSession,
//   deleteAdminSession,
// };
