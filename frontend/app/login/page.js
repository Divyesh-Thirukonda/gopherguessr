import Script from "next/script";
import { redirect } from "next/navigation";
import { getUserSession } from "../_utils/userSession";

export default async function UserAuth() {
  const session = await getUserSession();

  if (session.email) redirect("/profile");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-400 to-rose-800">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-center text-5xl font-extrabold text-rose-700">
          User Login
        </h1>
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
          className="g_id_signin mx-auto flex items-center justify-center"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      </div>
      <Script src="https://accounts.google.com/gsi/client" />
    </div>
  );
}
