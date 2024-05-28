import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import "../css/Home.css"
import "../css/App.css"
import '../css/particles.css';

import Form from '../components/Form'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';




import { VscDebugPause } from "react-icons/vsc";
import { IoPlay } from "react-icons/io5";
import { PiFastForwardFill } from "react-icons/pi";
import { RxShuffle } from "react-icons/rx";


interface Track {
    id: string;
    name: string;
    album: {
      name: string
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

interface Genre {
  name: string;
}

let intervals = [0.2, 1, 2, 4, 8, 15, 30];
let MAX_TRIES = 6;
let TRACK_LENGTH = 1000;
function Home() {

    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(false);
    const [tries, setTries] = useState<number>(0);
    const [gameActive, setGameActive] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [firstPlay, setfirstPlay] = useState<boolean>(true);
    const [customGame, setCustomGame] = useState<boolean>(false);
    const [streak, setStreak] = useState<number>(0);
    
    
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [displayData, setDisplayData] = useState<DisplayData[]>([]);
    
    
    const [answerIndex, setAnswerIndex] = useState<number>(0);

    const [songGuesses, setSongGuesses] = useState<{ guess: string, correct: boolean }[]>([]);
    const [randomTrack, setRandomTrack] = useState<Track | null>(null);
    
    const [currentTime, setCurrentTime] = useState<any>(0);
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



    // API FETCH TOP TRACKS
    useEffect(() => {
        const fetchTopTracks = async () => {
          if (token) {
            setLoading(true);
            try {
              let allTracks: Track[] = [];
              let limit = 50;
              let offset = 0;
              let fetchMore = true;

              const playlistIds = [
                '37i9dQZF1DWT1y71ZcMPe5', // It's a Hit!
                '37i9dQZF1DWVlLVXKTOAYa', // Pop Right Now
                '37i9dQZF1DWYBO1MoTDhZI', // Good Vibes
                '37i9dQZF1DX2KwEtNSejGe', // pop songs we can all scream
                '37i9dQZF1DWUZMtnnlvJ9p', // The Ultimate Hit Mix
                '37i9dQZF1DX3rxVfibe1L0', // Mood Booster
                '37i9dQZF1DX5Vy6DFOcx00', // big on the internet
                '37i9dQZF1DX2L0iB23Enbq', // Viral Hits
                '37i9dQZF1DX7rOY2tZUw1k', // Timeless Love Songs
                '37i9dQZF1DX0018ciYu6bM', // KimBops!
                '37i9dQZF1DWTl4y3vgJOXW' // Locked In
            ];
              
              if (customGame){
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
                  if (data.items.length < limit || allTracks.length >= TRACK_LENGTH) {
                    fetchMore = false;
                  }
                }
              } else {
                for (const playlistId of playlistIds) {
                  fetchMore = true;
                  offset = 0;
                  while (fetchMore) {
                      try {
                          const { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                              headers: {
                                  Authorization: `Bearer ${token}`,
                              },
                              params: {
                                  limit,
                                  offset,
                              },
                          });

                          const tracks = data.items.map((item:any) => item.track).filter((track:any) => track !== null);
                          offset += limit;

                          if (data.items.length === 0 || allTracks.length >= TRACK_LENGTH) {
                              fetchMore = false;
                          } else{
                            allTracks = allTracks.concat(tracks);
                          }
                      } catch (error) {
                          console.error('Error fetching playlist tracks:', error);
                          fetchMore = false; // Stop fetching if an error occurs
                      }
                  }
              }

              }
              
              setTopTracks(allTracks.slice(0, TRACK_LENGTH)); // Ensure we only have up to 500 tracks
              console.log(allTracks.length);
            } catch (error) {
              console.error('Error fetching top tracks:', error);
            } finally {
              setLoading(false);
            }
          }
        };
        fetchTopTracks();
      }, [token, customGame]);

    // CREATE WHOLENAME FOR DISPLAY
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
    
    //    ENDING GAME
      useEffect(() => {
        if (tries <= MAX_TRIES && correct){
            if (audioRef.current){
                setIsModalVisible(true);
                setStreak(streak + 1);
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                
            }
        }
      }, [tries]);

      useEffect(() => {
        if (tries > MAX_TRIES){
            if (audioRef.current){
                setIsModalVisible(true);
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                setStreak(0);
            }
        }
      }, [tries]);


    const selectRandomTrack = () => {
      
        setTries(0)
        setSongGuesses([])
        if (topTracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * topTracks.length);
            const selectedTrack = topTracks[randomIndex];
            setRandomTrack(selectedTrack);
            console.log(selectedTrack.name);
            setAnswerIndex(randomIndex);
            setCorrect(false)
            setGameActive(true)
            setCurrentTime(0); // Reset current time when selecting a new track
            if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reset the audio to the start
            audioRef.current.load(); // Load the new track
          }
          
        }
      };
      useEffect(() => {
        if (audioRef.current) {
          audioRef.current.volume = 0.05;
          if (audioRef.current.currentTime === 0) {
            setIsPlaying(false);
          }
        }
      }, [audioRef.current]);
      

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
        const isCorrect = displayData[answerIndex].wholeName === value;
        setSongGuesses([...songGuesses, { guess: value, correct: isCorrect }]);
        if (isCorrect == true){
            setCorrect(true)
        }
        setTries(tries + 1);
    };

    // PLAY PAUSE BUTTON
    const handlePlayPauseClick = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                const maxIntervalIndex = Math.min(tries, intervals.length - 1);
                const maxTime = intervals[maxIntervalIndex];
    
                if (!firstPlay) {
                    audioRef.current.currentTime = 0;
                    setCurrentTime(0);
                } else {
                    setCurrentTime(audioRef.current.currentTime);
                }
    
                audioRef.current.play();
                const checkTime = () => {
                    if (audioRef.current) {
                        const currentTime = audioRef.current.currentTime;
                        if (currentTime > maxTime) {
                            audioRef.current.pause();
                            setIsPlaying(false);
                        } else {
                            requestAnimationFrame(checkTime);
                        }
                    }
                };
                requestAnimationFrame(checkTime);
            }
            setIsPlaying(!isPlaying);
            setfirstPlay(false);
        }
    };

      const renderIntervalMarkers = () => {
        if (!duration) return null;
        return intervals.map((interval, index) => (
          <div
            key={index}
            className="interval-marker"
            style={{ left: `${(interval / duration) * 100}%` }}
          />
        ));
      };

    //   SKIP BUTTON
    const skip = () => {
        setTries(prevTries => {
            const newTries = prevTries + 1;
            if (audioRef.current) {
                const maxIntervalIndex = Math.min(newTries - 1, intervals.length - 1);
                const newTime = intervals[maxIntervalIndex];
                if (isFinite(newTime)) {
                    audioRef.current.currentTime = newTime;
                    setfirstPlay(true);
                    
                }
            }
            return newTries;
        });
    };
    
    // GAME FINISH MODAL
    const closeModal = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setGameActive(false)
        setIsModalVisible(false);
        setSongGuesses([]);
    };
    

    return (
      <div className="h-screen w-screen flex flex-col">
          {loading ? (
              <div className='spinner'>
                  <Spinner />
              </div>
          ) : (
              <div className="flex-1 relative unblur">
                  <div className="absolute top-0 left-0 w-full h-full z-0 inset-0">
                      <div className="particle "></div>
                      <div className="particle"></div>
                      <div className="particle"></div>
                      <div className="particle"></div>
                  </div>
                  <Navbar 
                    customGame={customGame} setCustomGame={setCustomGame} streak = {streak}
                  />
                  <div className="relative z-10">
                      <div className="box-container">
                          {songGuesses.map((guessObj, index) => (
                              <div key={index}>
                                  <Answer color={guessObj.correct ? "#1DB954" : "red"} song={guessObj.guess} />
                              </div>
                          ))}
                          <Form onSubmit={handleSubmit} displayData={displayData} />
                          {!gameActive && (
                              <button className="bg-transparent text-[#1DB954] hover:text-[#158b3f]" onClick={selectRandomTrack}>
                                  <RxShuffle size={30} />
                              </button>
                          )}
                          {randomTrack && (
                              <div>
                                  {randomTrack.preview_url && gameActive ? (
                                      <div className='audio-component'>
                                          <audio
                                              ref={audioRef}
                                              src={randomTrack.preview_url}
                                              onTimeUpdate={handleTimeUpdate}
                                              onLoadedMetadata={handleLoadedMetadata}
                                          />
                                          <div className='control-buttons'>
                                              <button className='play-pause-button' onClick={handlePlayPauseClick}>
                                                  {isPlaying ? <VscDebugPause size={100} className="icon" /> : <IoPlay size={100} className="icon" />}
                                              </button>
                                              <button className='play-pause-button' onClick={skip}>
                                                  <PiFastForwardFill size={35} />
                                              </button>
                                          </div>
                                          <div className="progress-bar">
                                              <div
                                                  className="progress"
                                                  style={{ width: `${(currentTime.toFixed(2) / Math.round(duration)) * 100}%` }}
                                              />
                                              {renderIntervalMarkers()}
                                          </div>
                                          <p>stage {tries + 1}: {intervals[tries]} seconds</p>
                                          <div className="flex justify-center items-center h-20">
                                          {[...Array(MAX_TRIES + 1)].map((_, index) => (
                                              <div
                                                  key={index}
                                                  className={`h-3 w-3 rounded-full mx-1 mt-[-5vh] ${
                                                      index < tries
                                                          ? 'bg-[#BE3535] transition-colors duration-500'
                                                          : index === tries && correct
                                                          ? 'bg-[#40b86a] transition-colors duration-500'
                                                          : 'bg-gray-300'
                                                  }`}
                                                  style={{
                                                      backgroundPosition: index < tries ? 'right' : 'left'
                                                  }}
                                              ></div>
                                          ))}
                                          
                                        </div>
                                      </div>
                                  ) : (
                                      <>
                                      </>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}
          <Modal
              isVisible={isModalVisible}
              onClose={closeModal}
              track={randomTrack}
              isCorrect={correct}
          />
          <div id="particles-js" className="particles-container" />
      </div>
  );
    }
  
  export default Home;
