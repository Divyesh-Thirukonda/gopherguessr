import { revalidatePath } from "next/cache";
import { Bug } from "@phosphor-icons/react/dist/ssr";
import MapWrapper from "./_components/MapWrapper";
import PreviewImage from "./_components/PreviewImage";
export const dynamic = "force-dynamic";

// this basically is an in-memory db that stores the game state until we get an actual db working
// i have no idea how to use mongodb lol
const gameState = {
  loc: null,
  allLocsUsed: [],
  lastGuessD: 0,
  lastGuessPoints: 0,
  round: 1,
  points: 0,
  complete: false,
};

// taken from https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
function latlngToMeters(lat1, lon1, lat2, lon2) {
  var R = 6378.137; // Radius of earth in KM
  var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return Math.floor(d * 1000); // meters
}


// In future, get image urls from db
const locs = [
  { name: "northrop", lat: 44.97650994493952, lng: -93.23534770592696, img_url: "/images/northrop.jpg" },
  { name: "coffman", lat: 44.97292225604155, lng: -93.23535508635577, img_url: "/images/coffman.jpg" },
  { name: "3m arena", lat: 44.97816852198272, lng: -93.22794192302824, img_url: "/images/3m.jpg" },
  { name: "burton hall", lat: 44.97775706372716, lng: -93.23752662716343, img_url: "/images/burton.jpg" },
  { name: "frontier", lat: 44.97082208071483, lng: -93.22784824913047, img_url: "/images/frontier.jpg" },
  { name: "keller", lat: 44.97451854616061, lng: -93.23224618664665, img_url: "/images/keller.jpg" },
];

function DebugMenu() {
  async function clearGameState() {
    "use server";
    gameState.loc = null;
    gameState.allLocsUsed = [];
    gameState.round = 1;
    gameState.lastGuessPoints = 0;
    gameState.points = 0;
    gameState.lastGuessD = 0;
    gameState.complete = false;
    revalidatePath("/play");
  }

  return (
    <div
      className={`fixed right-0 top-0 z-[1000] px-4 py-2 ${gameState.complete ? "bg-emerald-50" : "bg-white"} w-72 rounded-bl-lg shadow-inner`}
    >
      <span className="flex items-center gap-1.5 text-lg font-medium">
        <Bug className="h-5 w-5" />
        debug
        {gameState.complete ? (
          <span className="text-emerald-600"> game finished</span>
        ) : null}
      </span>
      current points: {gameState.points} / {(gameState.round - 1) * 1000}
      <br />
      current round: {gameState.round}
      <br />
      current location name: {gameState.loc?.name}
      <br />
      {gameState.allLocsUsed.length >= 1 && (
        <>
          last guess distance away: {gameState.lastGuessD}m
          <br />
          points added for last guess: {gameState.lastGuessPoints}
          <br />
          last location name:{" "}
          {gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.name}
          <br />
        </>
      )}
      <form action={clearGameState}>
        <button
          type="submit"
          className="mt-1.5 rounded-full border-2 bg-white px-2 py-1 hover:bg-gray-100"
        >
          clear game state
        </button>
      </form>
    </div>
  );
}

export default function Play() {
  // since this is a server component (no "use client"), this code will not run on the client at all

  if (!gameState.loc) {
    // don't have more rounds than the amount of locations we have
    if (gameState.round > locs.length) {
      gameState.complete = true;
    } else {
      let newLoc = locs[Math.floor(Math.random() * locs.length)];
      // dont use the same location twice
      while (gameState.allLocsUsed.some((loc) => loc.name === newLoc.name)) {
        newLoc = locs[Math.floor(Math.random() * locs.length)];
      }
      gameState.loc = newLoc;
    }
  }

  async function submitGuess(guess) {
    "use server";
    const d = latlngToMeters(
      guess[0],
      guess[1],
      gameState.loc.lat,
      gameState.loc.lng,
    );
    gameState.lastGuessD = d;
    gameState.allLocsUsed.push(gameState.loc);
    // if guess is over 500 meters away, just make it 500 so we can calculate points easy
    gameState.lastGuessPoints = (500 - (d > 500 ? 500 : d)) * 2;
    gameState.points += gameState.lastGuessPoints;
    gameState.loc = null;
    gameState.round += 1;
    revalidatePath("/play");
  }

  if (gameState.complete === true) {
    return <DebugMenu />;
  }

  return (
    <>
      <MapWrapper
        mode="eastBank"
        submitGuess={submitGuess}
        gameState={gameState}
      />
      <DebugMenu />
      <PreviewImage
        gameState={gameState}
      />
    </>
  );
}
