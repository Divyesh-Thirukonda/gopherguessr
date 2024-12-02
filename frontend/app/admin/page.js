import Link from "next/link";
import { authorizeAdminAction } from "../_utils/userSession";
import { Upload, MapTrifold, Table } from "@phosphor-icons/react/dist/ssr";

export default async function AdminIndex() {
  // get user info for name
  const user = await authorizeAdminAction();

  return (
    <div className="w-full py-3">
      <div>
        <h1 className="text-center text-4xl font-bold">Welcome Back!</h1>
      </div>
      <div className="mt-3 flex items-center justify-center gap-6">
        <Link
          href="/admin/map"
          className="group flex flex-col items-center gap-1 text-sm text-gray-600"
        >
          <div className="flex w-min items-center justify-center rounded-full bg-rose-600 p-5 group-hover:bg-rose-700">
            <MapTrifold className="h-10 w-10 text-white" weight="bold" />
          </div>
          Photos Map
        </Link>
        <Link
          href="/admin/photos"
          className="group flex flex-col items-center gap-1 text-sm text-gray-600"
        >
          <div className="flex w-min items-center justify-center rounded-full bg-rose-600 p-5 group-hover:bg-rose-700">
            <Table className="h-10 w-10 text-white" weight="bold" />
          </div>
          Photos Table
        </Link>
        <Link
          href="/admin/upload"
          className="group flex flex-col items-center gap-1 text-sm text-gray-600"
        >
          <div className="flex w-min items-center justify-center rounded-full bg-rose-600 p-5 group-hover:bg-rose-700">
            <Upload className="h-10 w-10 text-white" weight="bold" />
          </div>
          Upload Photos
        </Link>
      </div>
    </div>
  );
}
