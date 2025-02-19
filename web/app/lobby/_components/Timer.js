"use client";

import { DateTime, Duration } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Timer({ initTimeLeft, completeBy }) {
  const router = useRouter();

  const [text, setText] = useState(
    Duration.fromMillis(initTimeLeft).toFormat("mm:ss"),
  );
  const [timeLeft, setTimeLeft] = useState(initTimeLeft);

  // update timer
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setText(() => {
        const newDuration =
          DateTime.fromJSDate(completeBy).toMillis() -
          DateTime.now().toMillis();
        return Duration.fromMillis(newDuration).toFormat("mm:ss");
      });
      setTimeLeft(() => {
        return (
          DateTime.fromJSDate(completeBy).toMillis() - DateTime.now().toMillis()
        );
      });
    }, 1000); // update every second
    return () => {
      clearInterval(updateInterval);
    };
  }, [setText, setTimeLeft]);

  // reload page when timer reaches 0 to show game results
  useEffect(() => {
    if (timeLeft <= 0) {
      router.refresh();
    }
  });

  return (
    <div className="text-5xl font-bold">{timeLeft <= 0 ? "00:00" : text}</div>
  );
}
