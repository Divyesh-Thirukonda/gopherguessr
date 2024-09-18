import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Dynamically import Leaflet components with `ssr: false`
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

import 'leaflet/dist/leaflet.css';

let L; // Declare L here but do not import it yet

const Home = () => {
  const [location, setLocation] = useState(null);
  const [guess, setGuess] = useState(null);
  const [distance, setDistance] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // Track if map is loaded
  const mapRef = useRef(null); // Reference to the map instance

  // Fetch random location on page load
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('http://localhost:3001/random-location');
        setLocation(response.data);
        console.log('Fetched location:', response.data); // Debugging
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };
    fetchLocation();
  }, []);

  // Ensure map is only rendered client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      L = require('leaflet'); // Import Leaflet only on the client side
      setMapLoaded(true);
    }
  }, []);

  // Define a custom crosshair icon
  const createCrosshairIcon = () => {
    console.log(L)
    console.log(window)
    if (!L) return null; // Ensure L is available
    return new L.DivIcon({
      className: 'custom-crosshair',
      html: '<div style="width: 30px; height: 30px; position: relative;"><div style="position: absolute; width: 2px; height: 30px; background: red; left: 50%; top: 0; transform: translateX(-50%);"></div><div style="position: absolute; height: 2px; width: 30px; background: red; top: 50%; left: 0; transform: translateY(-50%);"></div></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15], // Center the icon at its position
    });
  };

  // Update guess and center the map on the guess
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    console.log('Map clicked:', { lat, lng }); // Debugging
    setGuess({ lat, lng });
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 12); // Center the map on the guess
    }
  };

  // Calculate distance between guess and actual location
  const calculateDistance = () => {
    if (!guess || !location) {
      console.log('No guess or location to calculate distance.'); // Debugging
      return;
    }

    const R = 6371; // Radius of the earth in km
    const dLat = (guess.lat - location.latitude) * (Math.PI / 180);
    const dLng = (guess.lng - location.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(location.latitude * (Math.PI / 180)) *
      Math.cos(guess.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    console.log(`Calculated distance: ${distance.toFixed(2)} km`); // Debugging
    setDistance(distance.toFixed(2));
  };

  // Only render the map if it's client-side
  if (!mapLoaded) {
    return null;
  }

  return (
    <div>
      <h1>Gopher Guessr</h1>

      {location && (
        <>
          <MapContainer
            center={[0, 0]}
            zoom={2}
            style={{ height: '400px', width: '100%' }}
            onClick={handleMapClick}
            whenCreated={mapInstance => (mapRef.current = mapInstance)} // Store map instance
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {guess && (
              <Marker
                position={[guess.lat, guess.lng]}
                icon={createCrosshairIcon()}
              />
            )}
          </MapContainer>

          <button onClick={calculateDistance}>Submit Guess</button>
          {distance !== null && (
            <p>Your guess was {distance} km away from the correct location.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
