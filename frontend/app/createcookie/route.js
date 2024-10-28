import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req) {
  const url = new URL(req.url);
  const len = url.searchParams.get("len");
  const cookieStore = await cookies();
  cookieStore.set("clientGameStateHandle", len, {
    maxAge: 3600, // expire after an hour to be at least a little less unstable
    path: "/",
  });
  redirect("/play");
}
