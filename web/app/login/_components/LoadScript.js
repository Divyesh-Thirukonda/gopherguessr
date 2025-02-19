"use client";

import { useEffect } from "react";

export default function LoadScript() {
  useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://accounts.google.com/gsi/client";
    document.body.appendChild(scriptTag);

    // cleanup by removing script on unmount
    // this will ensure it is loaded fresh on next mount
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return null;
}
