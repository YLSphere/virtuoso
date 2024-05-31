import { useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import SpotifyAuth from '../components/SpotifyAuth';
import SpotifyWebApi from 'spotify-web-api-js';
import { useSpotifyToken } from '../components/SpotifyToken';

import '../css/App.css';
import Leaderboard from './Leaderboard';
import Home from './Home';

const spotifyApi = new SpotifyWebApi();

function App() {
  const { token, setToken } = useSpotifyToken();

  const [spotifyId, setSpotifyId] = useState<string>("");
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [avgTime, setAvgTime] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [customGame, setCustomGame] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.replace('#', '?')).get('access_token');
    if (accessToken) {
      setToken(accessToken);
    }
  }, [setToken]);

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
                <Route path="/" element={<Home 
                    spotifyId = {spotifyId} 
                    maxStreak={maxStreak} 
                    avgTime={avgTime}
                    setSpotifyId = {setSpotifyId}
                    setMaxStreak={setMaxStreak}
                    setAvgTime={setAvgTime}
                    userName = {userName}
                    setUserName={setUserName}
                    users = {users}
                    setUsers = {setUsers}
                    customGame = {customGame}
                    setCustomGame={setCustomGame}
                    streak = {streak}
                    setStreak = {setStreak}
                  />}/>
                <Route path= '/leaderboard'
                element={<Leaderboard  
                  users = {users}
                  customGame = {customGame}
                  streak = {streak}
                  setSpotifyId = {setSpotifyId}
                  setUserName = {setUserName}
                  setCustomGame = {setCustomGame}
                />} />
              </Routes>
            </div>
          </Router>
        </div>
        
        )}
      </div>
  );
}

export default App
