'use client';
import { MapContainer, Polyline } from "react-leaflet";
import MapImageWrapper from "./MapImageWrapper";
import { useEffect, useRef, useState } from "react";


export default function ResultsDialog({ gameState, open, setDialogOpen }) {
    const map = useRef(null);
    const [actuallyShow, setActuallyShow] = useState(false);

    useEffect(() => {
        if (gameState.allLocsUsed.length > 0) {
            setTimeout(() => setActuallyShow(true), 10);
        }
    }, [gameState.allLocsUsed]);

    if (!open) return null;

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the Earth in kilometers
        var dLat = deg2rad(lat2 - lat1);  // Difference in latitude
        var dLon = deg2rad(lon2 - lon1);  // Difference in longitude
        var a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        var distance = R * c; // Distance in kilometers
        return distance;
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    var actualLoc = [gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.lat, gameState.allLocsUsed[gameState.allLocsUsed.length - 1]?.lng];
    var userGuessLoc = [gameState.lastGuessLat, gameState.lastGuessLng]
    var dialogCenter = [(actualLoc[0] + userGuessLoc[0]) / 2, (actualLoc[1] + userGuessLoc[1]) / 2]
    var dist = getDistanceFromLatLonInKm(actualLoc[0], actualLoc[1], userGuessLoc[0], userGuessLoc[1])
    console.log(dist)
    var myZoom = 0;
    if (dist < .1) {
        myZoom = 18;
    }
    else if (dist < .6) {
        myZoom = 16;
    } else if (dist < 1) {
        myZoom = 15;
    } else {
        myZoom = 14;
    }

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            {/* Background overlay with blur */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

            {/* Dialog container */}
            <dialog className="relative z-[1100] bg-white p-6 rounded-lg max-w-md w-full mx-4 text-center" open={open}>
                <div className="text-lg font-semibold mb-4">Results</div>
                <p>Your guess was {gameState.lastGuessD} meters away.</p>
                <p>You earned {gameState.lastGuessPoints} points!</p>

                {gameState.allLocsUsed.length > 0 && actuallyShow && (
                    <div className="flex justify-center mt-4">
                        <MapContainer
                            center={dialogCenter}
                            minZoom={14}
                            zoom={myZoom}
                            maxZoom={20}
                            scrollWheelZoom={true}
                            className="w-96 h-96"
                        >
                            <MapImageWrapper mapRef={map} guess={userGuessLoc} setGuess={() => { }} actualLocation={actualLoc} />
                            <Polyline
                                positions={[actualLoc, userGuessLoc]}  // Line connecting the two locations
                                pathOptions={{
                                    color: 'black',  // Color of the line
                                    dashArray: '10, 10',  // Dotted line style (alternating dashes)
                                    weight: 3,  // Line thickness
                                }}
                            />
                        </MapContainer>
                    </div>
                )}

                <button
                    className="mt-6 py-2 px-4 bg-rose-600 text-white rounded-full hover:bg-rose-700"
                    onClick={() => setDialogOpen(false)}
                >
                    Continue
                </button>
            </dialog>
        </div>
    );
}
