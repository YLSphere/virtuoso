import React from 'react';
import "../css/App.css";
import { FaSpotify } from "react-icons/fa";

const SpotifyAuth = () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT;
  const RESPONSE_TYPE = import.meta.env.VITE_RESPONSE_TYPE;
  const SCOPES = import.meta.env.VITE_SCOPES;
  
  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
    window.location.replace(authUrl);
  };

  return (
    <div className="w-max flex">
      <button className="spotify" onClick={handleLogin}>
        <FaSpotify size={70} />
      </button>
    </div>
  );
};

export default SpotifyAuth;