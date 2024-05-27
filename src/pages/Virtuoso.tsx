import { useState} from 'react'
import SpotifyAuth from '../components/SpotifyAuth';
import SpotifyWebApi from 'spotify-web-api-js';


const spotifyApi = new SpotifyWebApi();
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Form from '../components/Form'
import "../css/Virtuoso.css"

function Virtuoso() {
    const [count, setCount] = useState(0)
    const [token, setToken] = useState<string | null>(null);
  
    return (
      <div className="Virtuoso">
        {/* 
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div> */}
      </div>
    );
  }

  export default Virtuoso