// import React, { useState, useEffect } from "react";
// import getUserLocation from "../../../backend/utils/Geolocation.js";
// import LoadingScreen from "../Loading-Spinner/LoadingSpinner.jsx";
// const UserLocation = () => {
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [error, setError] = useState(null);
//   const [sharedLocation, setSharedLocation] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [buttonClicked, setButtonClicked] = useState(false);
//   const backendUrl = import.meta.env.VITE_BACKEND_ADDRESS;
//   const weatherUrl = `${backendUrl}/get-weather`;
//   const handleShareLocation = async () => {
//     try {
//       setButtonClicked(true);
//       setLoading(true);
//       const userLocation = await getUserLocation();
//       setLocation(userLocation);
//       setSharedLocation(true);
//     } catch (error) {
//       setError(error.message);
//     }
//   };
//   const fetchDataBasedOnLocation = async () => {
//     setLoading(true);
//     if (location.latitude && location.longitude) {
//       try {
//         const response = await fetch(weatherUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         });
//         const data = await response.json();
//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
//   useEffect(() => {
//     if (sharedLocation && location.latitude && location.longitude) {
//       fetchDataBasedOnLocation();
//     }
//   }, [location, sharedLocation]);
//   return (
//     <div>
//       <div>
//         <h1>User Location</h1>
//         {error && <p>Error: {error}</p>}
//         {!sharedLocation ? (
//           <button onClick={handleShareLocation}>Share Location</button>
//         ) : loading ? (
//           <LoadingScreen /> // Display loading screen while data is being fetched
//         ) : (
//           <p>Location details Received!</p>
//         )}
//       </div>
//     </div>
//   );
// };
// export default UserLocation;
