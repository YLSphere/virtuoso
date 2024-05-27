import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import "../css/Home.css"
import "../css/App.css"

import Form from '../components/Form'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal';

import { VscDebugPause } from "react-icons/vsc";
import { IoPlay } from "react-icons/io5";


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

interface HomeProps {
    tokens: { [userId: string]: string };
}
let intervals = [0.2, 0.8, 2, 4, 8, 15, 30];
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
              setTopTracks(allTracks.slice(0, TRACK_LENGTH)); // Ensure we only have up to 500 tracks
            } catch (error) {
              console.error('Error fetching top tracks:', error);
            } finally {
              setLoading(false);
            }
          }
        };
        fetchTopTracks();
      }, [token]);


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
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                console.log('YOU WIN')
            }
        }
      }, [audioRef, correct, tries]);

      useEffect(() => {
        if (tries > MAX_TRIES){
            if (audioRef.current){
                setIsModalVisible(true);
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                console.log('YOU LOSE')
            }
            
        }
      }, [audioRef, correct, tries]);


    const selectRandomTrack = () => {
        setTries(0)
        setSongGuesses([])
        if (topTracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * topTracks.length);
            const selectedTrack = topTracks[randomIndex];
            setRandomTrack(selectedTrack);
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
            const maxTime = intervals[Math.min(tries, intervals.length - 1)];
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setTimeout(() => {
              audioRef.current?.pause();
              setIsPlaying(false);
            }, maxTime * 1000);
          }
          setIsPlaying(!isPlaying);
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
        setTries(tries + 1)
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
        <div>
            {loading ? (
            <div className='spinner'>
                <Spinner />
            </div>
            ) : (
            <div className="box-container">
                {songGuesses.map((guessObj, index) => (
                <div key={index}>
                    <Answer color={guessObj.correct ? "green" : "red"} song={guessObj.guess} />
                </div>
                ))}
                <Form onSubmit={handleSubmit} displayData={displayData} />
                {!gameActive && (
                <button onClick={selectRandomTrack}>play a random track</button>
                )}
                {randomTrack && (
                <div>
                    {randomTrack.preview_url && gameActive ? (
                    <div className = 'audio-component'>
                        <audio
                        ref={audioRef}
                        src={randomTrack.preview_url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        />
                        <div className = 'control-buttons'>
                            <button className = 'play-pause-button' onClick={handlePlayPauseClick}>
                                {isPlaying ? <VscDebugPause size={100} className="icon"/> : <IoPlay size={100} className="icon"/>}
                            </button>
                            <button className = 'play-pause-button'  onClick={skip}>
                                skip
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
                        <p>tries remaining: {MAX_TRIES-tries}/{MAX_TRIES}</p>
                    </div>
                    ) : (
                        <>
                        </>
                    )}
                </div>
                )}
            </div>
            )}
            <Modal
                isVisible={isModalVisible}
                onClose={closeModal}
                track={randomTrack}
                isCorrect = {correct}
            />
        </div>
        );
    }
  
  export default Home;
