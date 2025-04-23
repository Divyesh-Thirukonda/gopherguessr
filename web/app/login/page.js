import { redirect } from "next/navigation";
import { getUserSession } from "../_utils/userSession";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import LoadScript from "./_components/LoadScript";

export default async function UserAuth({ searchParams }) {
  const session = await getUserSession();
  // const params = new URLSearchParams(await searchParams);
  if (session.email) redirect("/profile");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-400 to-rose-800 px-3 py-10">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-3 text-center text-5xl font-extrabold text-rose-700">
          User Login
        </h1>
        <p className="mb-6 text-center font-medium text-gray-600">
          You must login with a <span className="text-rose-700">umn.edu</span>{" "}
          email address!
        </p>
        <div
          id="g_id_onload"
          data-client_id={process.env.NEXT_PUBLIC_GOOGLE_ADMIN}
          data-context="signin"
          data-ux_mode="redirect"
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
      <LoadScript />
      <motion.div
        className="absolute left-3 top-3 mx-auto inline-block rounded-full bg-rose-600"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-xl font-medium text-white"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" weight="bold" aria-label="Back Icon" />
        </Link>
      </motion.div>
    </div>
  );
}
