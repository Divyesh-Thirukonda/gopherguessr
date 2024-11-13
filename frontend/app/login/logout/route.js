// runs when logout button clicked
// runs on server

import { deleteUserSession } from "@/app/_utils/userSession";

export async function POST() {
  // this redirects home once finished
  await deleteUserSession();
}
