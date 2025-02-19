/*
  What is this file?:
    A JavaScript script.
      It is in the folder /app/_utils (not in a specific route directory) because it could be used across our application.
      (utils is a common name for a folder to store things in a React project that aren't React Components).
      The underscore in _utils just means it's a private folder (think like a private method in Java)
      which prevents the user from ever being able to call it directly.
      Learn more here: 
        https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders
  What are we using this file for?:
    This is the function that converts our distance from latitude and longitude to meters.
    We import it when we need to calculate user scores.
*/

// taken from https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
export default function latlngToMeters(lat1, lon1, lat2, lon2) {
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
