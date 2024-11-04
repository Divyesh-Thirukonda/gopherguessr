// login page

import Script from "next/script";
import { getAdminSession } from "../_utils/adminSession";

export default async function AdminAuth() {
  const session = await getAdminSession();
  // if already logged in, redirect to admin home page
  if (session.email) redirect("/admin");

  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_ADMIN}
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri={
          process.env.NODE_ENV === "production"
            ? "https://gopher.nimbus.page/admin-auth/continue"
            : "http://localhost:3000/admin-auth/continue"
        }
        data-auto_prompt="false"
        data-use_fedcm_for_prompt="true"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
      <Script src="https://accounts.google.com/gsi/client" />
    </div>
  );
}
