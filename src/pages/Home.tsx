import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import "../css/home.css"
import "../css/App.css"
import Form from '../components/Form'
import Spinner from '../components/Spinner'


interface Track {
    id: string;
    name: string;
    album: {
      images: { url: string }[];
    };
    artists: { name: string }[];
    preview_url: string;
  }
interface DisplayData {
    artist: string;
    name: string;
    index: number;
    wholeName: string;
}

function Home() {

    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [displayData, setDisplayData] = useState<DisplayData[]>([]);
    
    
    const [answerIndex, setAnswerIndex] = useState<number>(0);

    const [songGuesses, setSongGuesses] = useState<string[]>([]);
    const [randomTrack, setRandomTrack] = useState<Track | null>(null);
    
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const audioRef = useRef<HTMLAudioElement>(null);


    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem('token');
    
        if (!token && hash) {
          token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token'))?.split('=')[1] ?? null;
    
          if (token) {
            window.localStorage.setItem('token', token);
            setToken(token);
          }
          window.location.hash = '';
        } else if (token) {
          setToken(token);
        }
    }, []);

    useEffect(() => {
        const fetchTopTracks = async () => {
          if (token) {
            setLoading(true);
            let allTracks: Track[] = [];
            let limit = 50;
            let offset = 0;
            let fetchMore = true;
    
            while (fetchMore) {
              const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: {
                  limit,
                  offset,
                },
              });
              allTracks = allTracks.concat(data.items);
              offset += limit;
              if (data.items.length < limit || allTracks.length >= 500) {
                fetchMore = false;
              }
            }
            setTopTracks(allTracks.slice(0, 500)); // Ensure we only have up to 500 tracks
            setLoading(false);
          }
        };
        fetchTopTracks();
    }, [token]);

    
    useEffect(() => {
        if (topTracks.length > 0) {
          const list = topTracks.map((track, index) => ({
            artist: track.artists.map(artist => artist.name).join(', '),
            name: track.name,
            index: index + 1,
            wholeName: track.name + ' - ' + track.artists.map(artist => artist.name).join(', ')
          }));
          setDisplayData(list);
        }
      }, [topTracks]);
    
    


    const selectRandomTrack = () => {
        if (topTracks.length > 0) {
          const randomIndex = Math.floor(Math.random() * topTracks.length);
          const selectedTrack = topTracks[randomIndex];
          setRandomTrack(selectedTrack);
          setAnswerIndex(randomIndex);
          setCurrentTime(0); // Reset current time when selecting a new track
          if (audioRef.current) {
            // audioRef.current.volume = 0.05;
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reset the audio to the start
            audioRef.current.load(); // Load the new track
            audioRef.current.play(); // Play the new track from the start
          }
        }
      };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const Answer: React.FC<{ color: string, song: string}> = ({ color, song }) => {
    return <div className="box" style={{ backgroundColor: color }}>
        <p className = 'answer'>{song}</p>
        
    </div>;
    };

    const handleSubmit = (value: string) => {
        setSongGuesses([...songGuesses, value]);
        console.log(displayData[answerIndex]);
    };

    

    return (
        <div>
            {loading ? (
                <div className = 'spinner'>
                    <Spinner />
                </div>
            ) : (
                <div className="box-container">
                    {songGuesses.map((guess, index) => (
                        <div key={index}>
                            <Answer color="#ffffff1c" song = {guess}/>
                        </div>
                    ))}
                    <Form onSubmit={handleSubmit} displayData = {displayData}/>
                    <>
            <button onClick={selectRandomTrack}>Play a Random Track</button>
            {randomTrack && (
              <div>
                {/* <img src={randomTrack.album.images[0]?.url} alt={randomTrack.name} style={{ width: '100px', height: '100px' }} /> */}
                {/* <p>{randomTrack.name} by {randomTrack.artists.map(artist => artist.name).join(', ')}</p> */}
                {randomTrack.preview_url ? (
                  <div>
                    <audio
                      ref={audioRef}
                      src={randomTrack.preview_url}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      controls
                    />
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <p>{Math.floor(currentTime)} / {Math.floor(duration)} seconds</p>
                  </div>
                ) : (
                  <p>No preview available for this track.</p>
                )}
              </div>
            )}
            {/* <ul>
              {topTracks.map((track) => (
                <li key={track.id}>
                  <img src={track.album.images[0]?.url} alt={track.name} style={{ width: '50px', height: '50px' }} />
                  {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                </li>
              ))}
            </ul> */}
          </>
                </div>
            )}
        </div>
    );
  }
  
  export default Home;
