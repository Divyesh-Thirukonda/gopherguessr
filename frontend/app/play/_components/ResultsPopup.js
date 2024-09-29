// import { MapContainer, Marker, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import "../ResultsPopupStyle.css"

// const guessIcon = new L.Icon({
//   iconUrl: 'path/to/guess-icon.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });

// const actualIcon = new L.Icon({
//   iconUrl: 'path/to/actual-icon.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });

// export default function ResultsPopup({ guess, actual, distance, points, onClose }) {
//   return (
//     <div className="results-popup">
//       <MapContainer center={actual} zoom={13} className="results-map">
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={guess} icon={guessIcon} />
//         <Marker position={actual} icon={actualIcon} />
//       </MapContainer>
//       <div className="results-info">
//         <p>Distance: {distance} meters</p>
//         <p>Points: {points}</p>
//         <button onClick={onClose}>Continue</button>
//       </div>
//     </div>
//   );
// }


// ResultsPopup.js
"use client"; // This component needs to be a client component

import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

const ResultsPopup = ({ isOpen, onClose, guess, actualLocation, distance, points }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Results</h2>
        <p>Your guess was {distance} meters away.</p>
        <p>You earned {points} points!</p>
        <MapContainer center={actualLocation} zoom={13} style={{ height: "300px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={actualLocation} />
          <Marker position={guess} />
        </MapContainer>
        <button onClick={onClose}>Continue</button>
      </div>
    </div>
  );
};

export default ResultsPopup;
