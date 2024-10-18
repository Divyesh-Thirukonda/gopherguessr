// since we have an on click handler for the back button, this needs to be a seperate client component

"use client";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function BackButton() {
  return (
    <button onClick={() => window.close()} className="flex items-center">
      <ArrowLeft className="mr-1.5 h-5 w-5" />
      Back
    </button>
  );
}
