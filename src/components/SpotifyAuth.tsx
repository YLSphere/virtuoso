import React from 'react';
import "../css/App.css";
import { FaSpotify } from "react-icons/fa";
import {Button} from "@nextui-org/react";

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
      <Button isIconOnly={true} radius = 'full' className="text-[#40b86a] shadow-lg spotify w-max h-[8vh] bg-transparent flex" onClick={handleLogin}>
        <FaSpotify size={70} />
      </Button>
    </div>
  );
};

export default SpotifyAuth;