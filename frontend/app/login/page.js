// login page

import Script from "next/script";
import { redirect } from "next/navigation";
import { getUserSession } from "../_utils/userSession";

export default async function UserAuth() {
  const session = await getUserSession();
  return (
    <div className="p-3">
      <h1 className="mb-1.5 text-3xl font-bold">User Login</h1>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_ADMIN}
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri={`${process.env.ROOT}/login/continue`}
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
