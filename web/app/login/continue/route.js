// this runs after a successful google login
// runs on server

import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { saveUserSession } from "@/app/_utils/userSession";
import prisma from "@/app/_utils/db";
import { DateTime } from "luxon";

async function createUser(payload, ip) {
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
    },
  });

  // associate last played game on current ip address as long as it was finished in the last 5 mins
  // this is so that when users sign up their last game is saved to their account
  const lastGame = await prisma.gameState.findFirst({
    where: {
      ip,
      compete: true,
      updatedAt: {
        gte: DateTime.now().minus({ minutes: 5 }).toJSDate,
      },
    },
  });
  if (lastGame) {
    prisma.gameState.update({
      where: { id: lastGame.id },
      data: { userId: user.id },
    });
  }

  return user;
}

export async function POST(req) {
  const cookieStore = await cookies();

  const headers = req.headers;
  const referer = headers.get("referer");
  const ip =
    process.env.NODE_ENV === "production"
      ? headers.get("X-Real-IP")
      : "127.0.0.1";
  const gameId = parseInt(referer?.slice(referer.length - 4, referer.length));

  let game = null;
  if (gameId) {
    game = await prisma.gameState.findFirst({ where: { id: gameId } });
  }

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
  if (payload.email_verified !== true) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. check if user exists in DB, add if not
  let existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  // 4. Record admin status
  let isAdmin = false;
  if (!existingUser) {
    existingUser = await createUser(payload, ip);
  } else {
    isAdmin = existingUser.isAdmin;
  }

  if (gameId) {
    await prisma.gameState.update({
      where: {
        id: gameId,
      },
      data: {
        userId: existingUser.id,
      },
    });

    // If user signs in with new high score, adjust
    if (game && existingUser.highScore < game.points) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { highScore: game.points },
      });
    }
  }

  // Save user session according to admin status
  await saveUserSession({ email: payload.email, isAdmin: isAdmin });
}
