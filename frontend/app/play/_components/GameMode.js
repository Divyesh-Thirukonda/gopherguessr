'use client';  // If using a client-side component in Next.js

import { useRouter } from 'next/navigation'; // Router for Next.js to change URL

export default function GameModeSelector() {
  const router = useRouter();

  // Function to change game mode by updating the URL
  const changeGameMode = (mode) => {
    router.push(`/play?gameMode=${mode}`);
  };

  return (
    <div>
      <h3>Select Game Mode</h3>
      <button onClick={() => changeGameMode(1)}>Game Mode 1</button>
      <button onClick={() => changeGameMode(2)}>Game Mode 2</button>
      <button onClick={() => changeGameMode(3)}>Game Mode 3</button>
    </div>
  );
}