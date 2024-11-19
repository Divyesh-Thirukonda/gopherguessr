// since we have an on click handler for the back button, this needs to be a seperate client component

"use client";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="mb-3 flex items-center">
      <ArrowLeft className="mr-1.5 h-5 w-5" />
      Back
    </button>
  );
}
