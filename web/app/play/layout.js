// use to show loading spinner when transitioning between games

import { cookies } from "next/headers";
import { Suspense } from "react";
import Loading from "../_components/Loading";

export default async function Layout({ children }) {
  const cookieStore = await cookies();

  return (
    <>
      <Suspense
        fallback={<Loading />}
        key={
          cookieStore.has("game_s") && cookieStore.get("game_s").value === ""
        }
      >
        {children}
      </Suspense>
    </>
  );
}
