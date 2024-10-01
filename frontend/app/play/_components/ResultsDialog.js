'use client';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import MapImageWrapper from "./MapImageWrapper";
import { useEffect, useRef, useState } from "react";

export default function ResultsDialog({gameState, open, setDialogOpen}) {
    console.log(gameState.allLocsUsed[gameState.allLocsUsed.length - 1])
    const map = useRef(null)
    const [actuallyShow, setActaullyShow] = useState(false)

    useEffect(() => {
        if(gameState.allLocsUsed.length > 0) {
            setTimeout(() => setActaullyShow(true), 10)
        }
    }, [gameState.allLocsUsed])

return (
    <dialog className="fixed inset-0 z-[1100]" open={open}>
        <div>Results</div>
        <p>Your guess was {gameState.lastGuessD} meters away.</p>
        <p>You earned {gameState.lastGuessPoints} points!</p>

        {gameState.allLocsUsed.length > 0 && actuallyShow && (
        <MapContainer
        center={[gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.lat, gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.lng]}
        minZoom={15}
        zoom={16}
        maxZoom={18}
        scrollWheelZoom={true}
        className="w-64 h-64"
        
      >
        <MapImageWrapper mapRef={map} guess={[gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.lat, gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.lng]} setGuess={()=>{}}/>
        </MapContainer>
    )
        
        }

        <button onClick={() => setDialogOpen(false)}>
            Continue
        </button>

    </dialog>
)
}
