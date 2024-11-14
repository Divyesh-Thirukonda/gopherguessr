import Link from "next/link";

export default function AdminIndex() {
  return (
    <div className="p-3">
      <Link
        href="/admin/upload"
        className="block text-xl text-blue-600 underline hover:text-blue-700"
      >
        Upload Photos
      </Link>
      <Link
        href="/admin/photos"
        className="mt-3 block text-xl text-blue-600 underline hover:text-blue-700"
      >
        Map of all Current Photos
      </Link>
    </div>
  );
}
