import { useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SpotifyAuth from '../components/SpotifyAuth';
import SpotifyWebApi from 'spotify-web-api-js';

import '../css/App.css';
import Virtuoso from './Virtuoso';
import Home from './Home';

const spotifyApi = new SpotifyWebApi();

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = new URLSearchParams(hash.replace('#', '?')).get('access_token');
      if (token) {
        window.localStorage.setItem("token", token);
        setToken(token);
        window.location.hash = '';
      }
    } else {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token);
    }
  }, [token]);

  return (
      <div>
        {!token ? (
          <SpotifyAuth />
        ) : (
        <div >
          <Router>
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/virtuoso" element={<Virtuoso />} />
              </Routes>
            </div>
          </Router>
        </div>
        
        )}
      </div>
  );
}

export default App
