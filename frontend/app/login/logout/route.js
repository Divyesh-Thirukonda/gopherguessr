// runs when logout button clicked
// runs on server

import { deleteUserSession } from "@/app/_utils/userSession";
import { deleteAdminSession } from "@/app/_utils/adminSession";

export async function POST() {
  // this redirects home once finished
  await deleteUserSession();
}
