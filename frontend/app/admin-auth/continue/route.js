// this runs after a successful google login

import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { saveAdminSession } from "@/app/_utils/adminSession";

export async function POST(req) {
  const cookieStore = await cookies();
  // 1. validate csrf token
  const csrfCookieToken = cookieStore.get("g_csrf_token").value;
  const formData = await req.formData();
  const csrfFormToken = formData.get("g_csrf_token");
  if (csrfCookieToken !== csrfFormToken || !csrfCookieToken || !csrfFormToken) {
    return NextResponse.json(
      { error: "Internal Server Error - CSRF MISMATCH" },
      { status: 500 },
    );
  }
  // 2. verify token sent by client with google oauth server
  const credential = formData.get("credential");
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.NEXT_PUBLIC_GOOGLE_ADMIN,
  });
  const payload = ticket.getPayload();
  // 3. make sure the user's email is verified and is in the admin email list
  const adminEmailsCSV = process.env.ADMIN_EMAILS;
  const adminEmails = adminEmailsCSV.split(",");
  if (payload.email_verified !== true || !adminEmails.includes(payload.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // if passed the 3 steps, store the user's email in the session data
  // this redirects to /admin once finished
  await saveAdminSession({
    email: payload.email,
  });
}
