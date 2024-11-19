"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Modal({ children }) {
  const router = useRouter();
  const dialogRef = useRef(null);

  // open modal on mount
  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="mx-auto my-3 max-h-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] rounded-xl backdrop:bg-gray-800 backdrop:bg-opacity-50 backdrop:backdrop-blur"
      onClose={() => router.back()}
    >
      <div className="w-max overflow-hidden bg-white">{children}</div>
    </dialog>
  );
}
