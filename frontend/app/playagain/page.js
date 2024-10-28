// redirecting to this page and redirecting back to play basically forces nextjs to do a full reload without actually doing a browser reload

import { redirect } from "next/navigation";

export default function PlayAgain() {
  redirect("/play");
}
