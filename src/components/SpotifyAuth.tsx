import "../css/App.css"
import { FaSpotify } from "react-icons/fa";

const SpotifyAuth = () => {

  const CLIENT_ID = 'daacdf943ede4de4b82eb40f5f1ec460';
  const REDIRECT_URI = 'http://localhost:5173';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const SCOPES = 'user-top-read';


  const handleLogin = () => {   
  //   window.location.replace(`${import.meta.env.VITE_AUTH_ENDPOINT}?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=${import.meta.env.VITE_RESPONSE_TYPE}`);
  // };
    window.location.replace(`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`);
  };

  return (
    <div>
      <button className = 'spotify' onClick={handleLogin}>
        <FaSpotify size = {70}/>
      
      </button>

    </div>
  );
};

export default SpotifyAuth;