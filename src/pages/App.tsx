import { useState, useEffect} from 'react'
import { VscPlayCircle } from "react-icons/vsc";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SpotifyAuth from '../components/SpotifyAuth';
import SpotifyWebApi from 'spotify-web-api-js';

import '../css/App.css';
import Virtuoso from './Virtuoso';
import Home from './Home';
// import Callback from './Callback'

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

// import { useState, useEffect} from 'react'
// import { VscPlayCircle } from "react-icons/vsc";
// import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
// import SpotifyAuth from '../components/SpotifyAuth';
// import SpotifyWebApi from 'spotify-web-api-js';

// import '../css/App.css';
// import Virtuoso from './Virtuoso';
// import Navbar from '../components/Navbar';
// import Home from './Home';
// // import Callback from './Callback'

// const spotifyApi = new SpotifyWebApi();

// function App() {
//   const [tokens, setTokens] = useState<{ [userId: string]: string }>({});

//   useEffect(() => {
//     const hash = window.location.hash;
//     let storedTokens = window.localStorage.getItem("tokens");
//     let tokens: { [userId: string]: string } = {};

//     if (storedTokens) {
//       tokens = JSON.parse(storedTokens);
//     }

//     if (!tokens && hash) {
//       const newTokens = new URLSearchParams(hash.replace('#', '?'));
//       newTokens.forEach((value, key) => {
//         tokens[key] = value;
//       });

//       window.localStorage.setItem("tokens", JSON.stringify(tokens));
//       setTokens(tokens);
//       window.location.hash = '';
//     } else {
//       setTokens(tokens);
//     }
//   }, []);

//   useEffect(() => {
//     // Set access tokens for Spotify Web API
//     Object.keys(tokens).forEach(userId => {
//       spotifyApi.setAccessToken(tokens[userId]);
//     });
//   }, [tokens]);

//   return (
//     <div>
//       {Object.keys(tokens).length === 0 ? (
//         <SpotifyAuth />
//       ) : (
//         <div>
//           <Navbar />
//           <Router>
//             <div>
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/virtuoso" element={<Virtuoso />} />
//               </Routes>
//             </div>
//           </Router>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;