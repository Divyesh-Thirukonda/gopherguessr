/*
  What is this file?:
    A React Component
      It is in the folder /app/play/_components because it is only used on the /play page.
      The underscore in the _components folder tells Next.js not to serve the files directly to the client.
      This prevents users from, for example, loading JUST our MapWrapper.
      Think of it like a private method in Java,
      It needs to be part of something bigger (our page.js file) to be accessible.
      Learn more here:
        https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders
  Server component or client component?:
    Client Component
      We know it's a Client Component because "use client"; is the first line of the file.
      If you're keeping track, this is the first time we cross over from Server Component to Client Component.
      (remember we can't import Server Components into Client Components so unless we use a workaround,
      everything further down the tree needs to be a Client Component)
        Learn more about the workaround here:
          https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
      We need this to be a Client Component because we're using React Hooks, which need to run on the client.
      (imagine if our useState ran on the Server, every user would have the exact same state. that would be a disaster...)
  What are we using this file for?:
    This Component does a couple things:
      It sets up client-side state for the user's current guess (where they last clicked on the page).
      It renders our Leaflet Map and the button used to submit the user's guess.
      It also sets up client-side state to change the map view from Minneapolis to St.Paul and vice versa.
    This is imported directly into our page.js file.
*/

"use client";

import { useEffect, useRef, useState } from "react";
import ResultsDialog from "./ResultsDialog";
import { X } from "@phosphor-icons/react";
import Leaflet from "@/app/_components/Leaflet";
import LeafletMarker from "@/app/_components/LeafletMarker";
import MotionButton from "@/app/_components/MotionButton";
import ResultsLeaderboard from "./ResultsLeaderboard";

const minneapolisCenter = [44.97528, -93.23538];
const stPaulCenter = [44.98655, -93.18201];

export default function MapWrapper({
  submitGuess,
  onDialogContinue,
  onXClick,
  viewMap,
  clearGameState,
  curState,
  goHome,
  curLobby,
  scoreData,
  isLoggedIn,
  isTimeUp,
  gameMode,
}) {

  
  

  const [viewStPaul, setViewStPaul] = useState(false);
  const [guess, setGuess] = useState(
    viewStPaul ? stPaulCenter : minneapolisCenter,
  );
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [enableKeybinds, setEnableKeybinds] = useState(false);

  // on first load, hide results dialog if in the middle of game
  useEffect(() => {
    const timeout = setTimeout(
      () => !curState.complete && setResultsDialogOpen(false),
      500,
    );
    return () => clearTimeout(timeout);
  }, []);

  // when round changes, reset marker position, and open resultdialog
  useEffect(() => {
    
    if (gameMode == "stpaul") {
      setViewStPaul(true);
    }

    setGuess(viewStPaul ? stPaulCenter : minneapolisCenter);
    if (curState.started) {
      setResultsDialogOpen(true);
    }
  }, [curState.round]);

  useEffect(() => {
    if (isTimeUp) {
      submitGuess(guess);
    }
  }, [isTimeUp]);

  // handle keybinds
  const handleKeyDown = (event) => {
    const key = event.key;
    if (!curState.complete) {
      if (key === "Enter" && !resultsDialogOpen) {
        if (enableKeybinds) {
          submitGuess(guess);
          setEnableKeybinds(false);
        }
        if (resultsDialogOpen) {
          setResultsDialogOpen(false);
        }
      }
      if (key === "Escape") {
        if (resultsDialogOpen) {
          setResultsDialogOpen(false);
        }
      }
    }
  };

  function getFullUrl(id) {
    return `https://utfs.io/a/e9dxf42twp/${id}`;
  }

  const getPreviewImage = () => {
    if (!curState.complete && !resultsDialogOpen) {
      return (
        <img
          src={getFullUrl(curState.curGuess.photo.imageId)}
          className="absolute max-h-full w-auto rounded-xl transition-transform duration-300 hover:scale-105 active:scale-100 md:h-auto md:w-full"
          onClick={onDialogContinue}
          alt="Guess image."
        />
      );
    } else if (resultsDialogOpen) {
      return (
        <img
          src={getFullUrl(curState.lastGuess.photo.imageId)}
          className="absolute max-h-full w-auto rounded-xl transition-transform duration-300 md:h-auto md:w-full"
          alt="Guess image."
        />
      );
    } else {
      return (
        <img
          src={getFullUrl(curState.lastGuess.photo.imageId)}
          className="absolute max-h-full w-auto rounded-xl transition-transform duration-300 md:h-auto md:w-full"
          alt="Guess image."
        />
      );
    }

    return null;
  };

  const getLeaderBoard = (isLoggedIn, scoreData) => {
    return (
      <div className="max-w-lg text-center">
        <ResultsLeaderboard
          scoreData={scoreData}
          isLoggedIn={isLoggedIn}
          curState={curState}
        />
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[900] overflow-auto backdrop-blur-md ${!viewMap && "invisible"}`}
      onKeyDown={handleKeyDown}
      onClick={() => setEnableKeybinds(true)}
      tabIndex={0}
    >
      <div className="flex h-dvh flex-col gap-3 p-3 md:flex-row">
        <div className="relative h-[66dvh] w-full flex-shrink-0 overflow-hidden rounded-xl md:h-full md:w-[75dvw]">
          <Leaflet
            center={viewStPaul ? stPaulCenter : minneapolisCenter}
            onClick={(e) => setGuess([e.latlng.lat, e.latlng.lng])}
            className="h-full w-full"
            zoom={16}
          >
            <LeafletMarker position={guess} icon="crosshair" />
          </Leaflet>
          <MotionButton
            className="absolute left-0 right-0 top-3 z-[1000]"
            onClick={() => setViewStPaul((currentState) => !currentState)}
          >
            Go to {viewStPaul ? "Minneapolis" : "St Paul"}
          </MotionButton>
          <MotionButton
            className="absolute bottom-6 left-0 right-0 z-[1000]"
            onClick={() => submitGuess(guess)}
          >
            Submit Guess
          </MotionButton>
          <MotionButton
            className="absolute right-3 top-3 z-[1000]"
            onClick={onXClick}
          >
            <X className="h-6 w-6 text-white" />
          </MotionButton>
          {resultsDialogOpen && (
            <ResultsDialog
              curState={curState}
              setDialogOpen={setResultsDialogOpen}
              onContinue={onDialogContinue}
              clearGameState={clearGameState}
              goHome={goHome}
              curLobby={curLobby}
            />
          )}
        </div>
        <div className="relative flex flex-grow items-center justify-center">
          {!curState.complete && getPreviewImage()}
          {curState.complete &&
            !curLobby &&
            getLeaderBoard(isLoggedIn, scoreData)}
        </div>
      </div>
    </div>
  );
}
