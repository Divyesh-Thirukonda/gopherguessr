// runs when logout button clicked
// runs on server

import { deleteUserSession } from "@/app/_utils/userSession";

export async function POST() {
  // this redirects to /admin once finished
  await deleteUserSession();
}
