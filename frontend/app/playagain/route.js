// redirecting to this page and redirecting back to play basically forces nextjs to do a full reload without actually doing a browser reload

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req) {
  const cookieStore = await cookies();
  cookieStore.delete("prismaGameStateId");
  redirect("/play");
}
