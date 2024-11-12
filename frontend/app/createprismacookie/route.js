import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const cookieStore = await cookies();
  cookieStore.set("prismaGameStateId", id, {
    path: "/",
  });
  redirect("/play");
}
