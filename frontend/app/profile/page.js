import { authorizeUserRoute } from "../_utils/userSession";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import * as motion from "framer-motion/client";

export default async function ProfileIndex() {
  const { session } = await authorizeUserRoute();

  const AdminButton = () => {
    return (
      <motion.div
        className="mx-auto mt-4 inline-block rounded-full bg-rose-600"
        whileHover={{ scale: 1.2 }}
      >
        {session.isAdmin && (
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 text-2xl font-medium text-white"
          >
            Admin
            <ArrowRight className="ml-1.5 h-6 w-6" weight="bold" />
          </Link>
        )}
      </motion.div>
    );
  };

  return (
    <main>
      <div className="p-3">Nothing yet, come back soon</div>
      <AdminButton />
    </main>
  );
}
