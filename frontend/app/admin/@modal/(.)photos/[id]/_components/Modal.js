"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Modal({ children }) {
  const router = useRouter();
  const dialogRef = useRef(null);
  const [showChildren, setShowChildren] = useState(false);

  // open modal on mount
  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  // only show children when dialog is fully rendered (we had issues with leaflet without)
  useEffect(() => {
    dialogRef.current.open && setShowChildren(true);
  }, [dialogRef.current]);

  return (
    <dialog
      ref={dialogRef}
      className="mx-auto my-3 max-h-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] rounded-xl backdrop:bg-gray-800 backdrop:bg-opacity-50 backdrop:backdrop-blur"
      onClose={() => router.back()}
    >
      <div className="w-max overflow-hidden bg-white">
        {showChildren && children}
      </div>
    </dialog>
  );
}
