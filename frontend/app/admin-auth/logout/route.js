// runs when logout button clicked
// runs on server

import { deleteAdminSession } from "@/app/_utils/adminSession";

export async function POST() {
  // this redirects to /admin once finished
  await deleteAdminSession();
}
