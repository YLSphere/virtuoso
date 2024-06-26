import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSpotifyToken } from '../components/SpotifyToken';

import "../css/Home.css"
import "../css/App.css"
import '../css/particles.css';

import Form from '../components/Form'
// import Spinner from '../components/Spinner'
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import Patchnotes from '../components/PatchNotes';

import { VscDebugPause } from "react-icons/vsc";
import { IoPlay } from "react-icons/io5";
import { PiFastForwardFill } from "react-icons/pi";
import { RxShuffle } from "react-icons/rx";
import {Button, Tooltip, user, Spinner, Progress} from "@nextui-org/react";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


type StringDictionary = { [key: string]: string[] };
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

let intervals = [0.2, 1, 2, 4, 8, 15, 30];
let MAX_TRIES = 6;
let TRACK_LENGTH = 1000;

interface HomeProps{
  spotifyId: string;
  maxStreak: number;
  avgTime: number;
  userName: string;
  setSpotifyId: any;
  setMaxStreak: any;
  setAvgTime: any;
  setUserName: any;
  users: any;
  setUsers: any;
  customGame:boolean;
  setCustomGame:any;
  streak:number;
  setStreak:any;
  myGenres: string[];
  setMyGenres: any;
  topTracks: Track[];
  setTopTracks: any;
  profileImage: any;
  setProfileImage:any;
  setMyTopTracks:any;
  myTopTracks:Track[];
}

const firebaseConfig = {
  apiKey: "AIzaSyCbTNQ1koqlrPoO3iHRb6DDF9ovlht6mwg",
  authDomain: "virtuoso-spotify.firebaseapp.com",
  projectId: "virtuoso-spotify",
  storageBucket: "virtuoso-spotify.appspot.com",
  messagingSenderId: "1087992385904",
  appId: "1:1087992385904:web:da34af8c29840581cdffb5",
  measurementId: "G-Z3JHG6VTV8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function Home(props: HomeProps) {

  function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
  }

    const { token, setToken } = useSpotifyToken();
    
    const [userImages, setUserImages] = useState<string[]>([]);
    const usersCollectionRef = collection(db, "leaderboard");

    const [loading, setLoading] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(false);
    const [tries, setTries] = useState<number>(0);
    const [gameActive, setGameActive] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [firstPlay, setfirstPlay] = useState<boolean>(false);
    
    const [totalTime, setTotalTime] = useState<number>(0);
    const [customWins, setCustomWins] = useState<number>(0);
    
    const [displayData, setDisplayData] = useState<DisplayData[]>([]);
    
    
    const [answerIndex, setAnswerIndex] = useState<number>(0);

    const [songGuesses, setSongGuesses] = useState<{ guess: string, correct: boolean }[]>([]);
    const [randomTrack, setRandomTrack] = useState<Track | null>(null);
    
    const [currentTime, setCurrentTime] = useState<any>(0);
    const [duration, setDuration] = useState<number>(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    const [genreMenuOpen, setGenreMenuOpen] = useState<boolean>(false);

    const [lastCustom, setLastCustom] = useState<Track | null>(null);
    const [lastTrending, setLastTrending] = useState<Track | null>(null);

    const [genres, setGenres] = useState<StringDictionary>(
      {
        'modern pop':[
          '37i9dQZF1DWT1y71ZcMPe5', // It's a Hit!
          '37i9dQZF1DWVlLVXKTOAYa', // Pop Right Now
          '37i9dQZF1DXcBWIGoYBM5M', // Today’s Top Hits
          '37i9dQZF1DX5Vy6DFOcx00', // big on the internet
          '37i9dQZF1DWYBO1MoTDhZI', // Good Vibes
          '37i9dQZF1DX2L0iB23Enbq', // Viral Hits
          '37i9dQZF1DWUa8ZRTfalHk', // Pop Rising
          '37i9dQZF1DX3rxVfibe1L0' // Mood Booster
  
        ],
        "00s pop":[
          '37i9dQZF1DX2KwEtNSejGe', // pop songs we can all scream
          '5hBt2KAyj6SKUyuzdcIZh5', // the pompeii playlist
          '4GZT3MbZ4IwjtIxKuYerfu', // Throwback Bangers (2000s)
          '5XqZ2d63EIiiU17DOGfouA', // 2010-2017 throwbacks
          '6oPaWRFxVztzwMpaZTmusU', // Throwback songs everyone knows
          '5r3dfWzTXMfiiO9rmzUCP9', // Throwback Hits (1990-2010)
          '6zGbgDCvY2ph9e80EqTKVd', // Noughties 00s Throwback Y2K
          '37i9dQZF1DX7F6T2n2fegs', // Throwback Party *
          '37i9dQZF1DWUZMtnnlvJ9p' // The Ultimate Hit Mix
  
        ],
        'alternative':[
          '37i9dQZF1DXbO6rt3GhXDY', // Indie Pop Hits
          '37i9dQZF1DX2DKrE9X6Abv', // end credits
          '37i9dQZF1DWZq91oLsHZvy', // Indie Running *
          '37i9dQZF1DWVsh2vXzlKFb', // Summer Indie *
          '37i9dQZF1DX4OzrY981I1W', // my life is a movie *
          '37i9dQZF1DXb9izPIc0SCS', // Indie Rock Hits
          '37i9dQZF1DWURugcFfOfEH' // good energy *
  
        ],
        'rock':[],
        'kpop':[
          '37i9dQZF1DX9tPFwDMOaN1', // K-Pop On!
          '37i9dQZF1DX0018ciYu6bM', // KimBops!
          '37i9dQZF1DXbSWYCNwaARB', // Girl Krush *
          '37i9dQZF1DX1gjl24GAQC0', // Hallyu Boy Bands *
          '37i9dQZF1DX4RDXswvP6Mj', // K-Club Party *
          '37i9dQZF1DXdR77H5Z8MIM', // Nolja!
          '37i9dQZF1DWUoY6Ih7vsxr', // Millennium K-Pop *
          '37i9dQZF1DX3ZeFHRhhi7Y' // WOR K OUT *
  
        ],
        'krnb':[
          '37i9dQZF1DWW46Vfs1oltB', // KrOWN
          '37i9dQZF1DXdTb8AG95jne', // Indie Korea *
          '37i9dQZF1DXbirtHQBuwCo', // TrenChill K-R&B *
          '37i9dQZF1DWWvmOXYvR5a6', // TrenChill K-Hip Hop *
          '37i9dQZF1DX5x5ck36i2uO', // JJM Hip Hop *
          '37i9dQZF1DWZiWafrEIdA8', // Healing Hip Hop *
          '6PVRGjcds83S5rEx80bp2T', // krnb late night drive
          '45GF9sxHg15RuNUANcuUqQ' // soft krnb

        ],
        'cantopop':[
          '37i9dQZF1DWY8uwfoLg221', // 2000ND LHJS *
          '37i9dQZF1DX9s7H7lpM6Rx', // 2010ND GGJS *
          '37i9dQZF1DXcklpCH5705e', // FCG
          '2v0mxzm6LCcmBVqRPwzvdM', // JHTYYGDGK Best Cantonese Songs'
          '12rjCFxeO1DFy2XSpg9AK4' // Cantopop Classics (90s and 00s)

        ],
        'mandopop':[
          '37i9dQZF1DWVUmQhB7PvFH', // 2000NDHYJK
          '37i9dQZF1DXe3opFF4aPDr', // 2010NDHYJLX *
          '37i9dQZF1DWSALMZjluyr7', // JDJC
          '37i9dQZF1DWVNQeZtY2TDM' // SNCJX : HYLX

        ],
        'rnb':[
          '37i9dQZF1DX4SBhb3fqCJd', // RNB X
          '37i9dQZF1DWTUHzPOW6Jl7', // Energy Booster: R&B *
          '37i9dQZF1DX7FY5ma9162x', // R&B Favourites *
          '5UFZXhJk7w4joCfg6jS0GV' // R&B/Chill
        ],
        'hip hop':[
          '37i9dQZF1DWTl4y3vgJOXW', // Locked In
          '37i9dQZF1DX0XUsuxWHRQd', // Rap Caviar
          '37i9dQZF1DX1lHW2vbQwNN', // I Love my 2000s Hip Hop *
          '37i9dQZF1DX58gKmCfKS2T', // Most Streamed Rap Songs on Spotify
          '37i9dQZF1DX9oh43oAzkyx', // Beast Mode Hip Hop *
          '37i9dQZF1DWY4xHQp97fN6', // Get Turnt
          '37i9dQZF1DWVA1Gq4XHa6U', // Gold School

        ],
        '80s, 90s':[
          '4A8pN5orMQBh72D19n1xDb', // 80s & 90s hits
          '22a3X6TAY3qEs60PhcdLTn' // My old man playlist
        ],
        'edm':[
          '37i9dQZF1DX4dyzvuaRJ0n', // mint
          '37i9dQZF1DWYN9NBqvY7Tx', // Ultra Gaming *
          '37i9dQZF1DX4eRPd9frC1m', // Hype *
          '2W32HNDe5OgNsPvciLm1Ix', // Best EDM Songs of All Time
          '37i9dQZF1DX3Kdv0IChEm9', // EDM Hits *
          '37i9dQZF1DXdKnYm9qqW04', // Dance Hits of 2015
          '10PXjjuLhwtYRZtJkgixLO' // EDM Classics 2010-2015

        ]
      }
    );

    const [currentGenres, setCurrentGenress] = useState<string[]>(props.myGenres);
    
    

    

  // API FETCH TOP TRACKS
    useEffect(() => {
      const fetchTopTracks = async () => {
        if (token) {

          
          try {
            let allTracks: Track[] = [];
            let limit = 50;
            let offset = 0;
            let fetchMore = true;
            
            
            
            if (props.myTopTracks.length === 0){
              console.log('fetching your top tracks...')
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
              props.setMyTopTracks(allTracks.slice(0, TRACK_LENGTH))
            }
            if (!props.customGame && currentGenres !== props.myGenres){
              console.log('fetching trending tracks...')
              setLoading(true);
              let maxSongsPerGenre = Math.floor(TRACK_LENGTH/props.myGenres.length)


              for (const genre in props.myGenres){       
                for (const playlistId of genres[props.myGenres[genre]]) {
                  if (allTracks.length >= ((parseInt(genre) + 1)*maxSongsPerGenre)){
                    
                    continue;
                  }
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

                      if (data.items.length === 0 || allTracks.length >= ((parseInt(genre) + 1)*maxSongsPerGenre)) {
                        fetchMore = false;
                      } else{
                        allTracks = allTracks.concat(tracks);
                      }
                      
                    } catch (error) {
                        console.error('Error fetching playlist tracks:', error);
                        fetchMore = false; // Stop fetching if an error occurs
                    }
                  }
                  props.setTopTracks(allTracks.slice(0, TRACK_LENGTH));
                }
              }
            }
             // Ensure we only have up to 500 tracks
          } catch (error) {
            console.error('Error fetching top tracks:', error);
          } finally {
            setLoading(false);

          }
        }
      };
        if(!(currentGenres.sort().join(',') === props.myGenres.sort().join(','))||props.customGame){
          setCurrentGenress(props.myGenres)
          fetchTopTracks();
        }
        if (props.customGame && props.myTopTracks.length === 0){
          setLoading(true);
          fetchTopTracks();
        } else if (!props.customGame && props.myTopTracks.length === 0){
          setLoading(false);
          fetchTopTracks();
        }

        
        
      }, [props.customGame, genreMenuOpen]);

    // CREATE WHOLENAME FOR DISPLAY
    useEffect(() => {
      if (!props.customGame){
        if (currentGenres.length == 0){
          setDisplayData([])
        }
        if (props.topTracks.length > 0) {
          const list = props.topTracks.map((track, index) => ({
            artist: track.artists.map(artist => artist.name).join(', '),
            name: track.name,
            index: index + 1,
            wholeName: track.name + ' - ' + track.artists.map(artist => artist.name).join(', ')
          })); 
          setDisplayData(list);
        }
      } else {
        if (props.myTopTracks.length > 0) {
          const list = props.myTopTracks.map((track, index) => ({
            artist: track.artists.map(artist => artist.name).join(', '),
            name: track.name,
            index: index + 1,
            wholeName: track.name + ' - ' + track.artists.map(artist => artist.name).join(', ')
          }));
          setDisplayData(list);
        }
      }
    }, [props.topTracks, props.myTopTracks, props.customGame]);
    

    //    ENDING GAME
      useEffect(() => {
        if (tries <= (MAX_TRIES + 1) && correct){
            if (audioRef.current){
                setIsModalVisible(true);
                props.setStreak(props.streak + 1);
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                props.setAvgTime(props.avgTime + totalTime)
            }
            if (props.customGame){
              setCustomWins(customWins + 1)
            }

            // CLEAR LAST GAME FOR MODE SWITCH CONTINUITY
            setLastCustom(null);
            setLastTrending(null);
        }
      }, [tries]);

      useEffect(() => {
        if (tries >= (MAX_TRIES + 1) && !correct){

          if (audioRef.current){
              setIsModalVisible(true);
              audioRef.current.currentTime = 0;
              audioRef.current.play();
          }
          // CLEAR LAST GAME FOR MODE SWITCH CONTINUITY
          setLastCustom(null);
          setLastTrending(null);
        }
      }, [tries]);

    // STARTING NEW GAME
    const selectRandomTrack = () => {

        setTries(0)
        setTotalTime(0)
        setSongGuesses([])
        setCorrect(false);
        setfirstPlay(false);
        setGameActive(true)
        setCurrentTime(0);
        if (!props.customGame) {
          if (props.topTracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * props.topTracks.length);
            const selectedTrack = props.topTracks[randomIndex];
            // console.log(selectedTrack.name);
            setRandomTrack(selectedTrack);
            setLastTrending(selectedTrack)
            setAnswerIndex(randomIndex);
          }
        } else {
          if (props.myTopTracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * props.myTopTracks.length);
            const selectedTrack = props.myTopTracks[randomIndex];
            // console.log(selectedTrack.name);
            setRandomTrack(selectedTrack);
            setLastCustom(selectedTrack)
            setAnswerIndex(randomIndex);
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
      }, [audioRef.current, gameActive, props.customGame, randomTrack]);
      
    // AUDIO TIME UPDATES
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

    // ANSWER BOX
    const Answer: React.FC<{ color: string, song: string}> = ({ color, song }) => {
    return <div className={`box ${detectMob() ? "w-[70vw]" : "w-[35vw]"}`} style={{ backgroundColor: color }}>
        <p className = 'answer'>{song}</p>
        
    </div>;
    };

    //INPUT SUBMIT
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
      const maxIntervalIndex = Math.min(tries, intervals.length - 1);
      const maxTime = intervals[maxIntervalIndex];
      
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                if (firstPlay){
                  setTotalTime(totalTime - intervals[maxIntervalIndex - 1] + currentTime);
                } else {
                  setTotalTime(totalTime + currentTime)
                }
            

            } else {

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
                            if (firstPlay){
                              setTotalTime(totalTime - intervals[maxIntervalIndex - 1] + currentTime);
                            } else {
                              setTotalTime(totalTime + currentTime)
                            }
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

      // DURATION INTERVAL BARS
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
        
        if (!correct){
          if (props.streak > props.maxStreak && props.streak > 0){
            
            console.log('should update')
            props.setMaxStreak(props.streak)
            props.setAvgTime(Math.round(props.avgTime/props.streak));
            if (props.streak != customWins && customWins > 0){
              updateUser(props.spotifyId, props.spotifyId, props.streak, props.avgTime, props.userName, ['custom'].concat(props.myGenres), props.profileImage);
              getMe(props.users);
            } else if (props.streak == customWins){
              updateUser(props.spotifyId, props.spotifyId, props.streak, props.avgTime, props.userName, ['custom'], props.profileImage);
              getMe(props.users);
            } else {
              updateUser(props.spotifyId, props.spotifyId, props.streak, props.avgTime, props.userName, props.myGenres, props.profileImage);
              getMe(props.users);
            }
          }
          
          props.setAvgTime(0)
          props.setStreak(0);
          setCustomWins(0);
        }
    };


    // PROFILE CREATION
    const createUser = async () => {
      console.log('setting')
      await setDoc(doc(db, "leaderboard", props.spotifyId), {
        spotify_id: props.spotifyId, 
        max_streak: props.maxStreak, 
        avg_time: props.avgTime, 
        name: props.userName,
        genres: [],
        profile_image: props.profileImage
      });
      console.log('done')
    
      getUsers(true);
    };

    const getMe = (users:any) => {
      for (let n of users){
        if (n.spotify_id === props.spotifyId){
          props.setMaxStreak(n.max_streak)
          props.setUserName(n.name)
          props.setSpotifyId(n.spotify_id)
          props.setProfileImage(n.profile_image)
        }
      }
    }

    const getUsers = async (first_run: boolean) => {
      const data = await getDocs(usersCollectionRef);
      let users = data.docs.map((doc:any) => ({ ...doc.data()}))
      props.setUsers(users);
      setUserImages(data.docs.map((doc:any) => ({ ...doc.data()}.spotify_id)));
    };

    const updateUser = async (id: string, spotify_id:string, max_streak:number, avg_time:number, name: string, genres: string[], profile_image:string) => {
      const userDoc = doc(db, "leaderboard", id);
      const newFields = { spotify_id: spotify_id, max_streak: max_streak, avg_time: avg_time, name: name, genres: genres, profile_image: profile_image};
      await updateDoc(userDoc, newFields);
      getUsers(false);
    };

    

    // HANDLE MODE SWITCH
    useEffect(() =>{
      if (props.customGame && lastCustom != null) {
        setRandomTrack(lastCustom)
        setCurrentTime(0)
      } else if (!props.customGame && lastTrending != null) {
        setRandomTrack(lastTrending)
      } else {
        setRandomTrack(null)
        setCurrentTime(0)
      }
      
      if (lastCustom == null && lastTrending == null){
        setGameActive(false);
        setTries(0)
        setTotalTime(0)
        setSongGuesses([])
        setCorrect(false);
        setfirstPlay(false);
        setIsPlaying(false);
      }
      

    },[props.customGame, currentGenres]);
    
    useEffect(() =>{
      if (props.users.length === 0){
        getUsers(true);
      }
    },[]);
    
    useEffect(() =>{
      if (props.users.length != 0){
        getMe(props.users);
      }
    },[props.users.length]);

    useEffect(() => {
    if (userImages.length !== 0 && !userImages.includes(props.spotifyId)) {
        createUser();
        }
    }, [userImages]);
    

    return (
      <div className="h-screen w-screen flex flex-col">
          {loading ? (
              <div className='spinner'>
                  <Spinner color="success" size = "lg" classNames={{
                    base: 'spinner-size',
                  }}/>
              </div>
          ) : (
              <div className="flex-1 relative unblur">
                  <div className="absolute top-0 left-0 w-full h-full z-0 inset-0">
                      <div className="particle" style={{ animationDuration: `${Math.max(100- 10*props.streak, 10)}s`}}></div>
                      <div className="particle" style={{ animationDuration: `${Math.max(100- 10*props.streak, 10)}s`}}></div>
                      <div className="particle" style={{ animationDuration: `${Math.max(100- 10*props.streak, 10)}s`}}></div>
                      <div className="particle" style={{ animationDuration: `${Math.max(100- 10*props.streak, 10)}s`}}></div>
                  </div>
                  <Navbar 
                    customGame={props.customGame} setCustomGame={props.setCustomGame} streak = {props.streak} setSpotifyId={props.setSpotifyId} setUserName = {props.setUserName}
                    profileImage = {props.profileImage} setProfileImage = {props.setProfileImage}
                  />
                  <div className="relative z-10">
                      <div className="box-container">
                          <div className = 'item-start flex flex-row'>
                            <div className = 'flex items-center flex-col'>
                              {songGuesses.map((guessObj, index) => (
                                <div className = {`flex justify-start ${props.customGame ? "" : "mr-[39px]"}`} key={index}>
                                    <Answer color={guessObj.correct ? "#1DB954" : "red"} song={guessObj.guess} />
                                </div>
                              ))}
                              <Form 
                                onSubmit={handleSubmit} 
                                displayData={displayData}
                                setSelectedGenres = {props.setMyGenres}
                                myGenres = {props.myGenres}
                                setGenreMenuOpen = {setGenreMenuOpen}
                                genreMenuOpen = {genreMenuOpen}
                                customGame = {props.customGame}
                                gameActive = {gameActive}
                                randomTrack = {randomTrack}
                                />
                              {(!gameActive && displayData.length > 0) && (
                                <Tooltip color="success" placement='bottom' closeDelay={0} content="new song" size = 'lg'>
                                  <Button isIconOnly className={`bg-transparent text-[#1DB954] hover:text-[#158b3f] p-0 ${props.customGame ? "" : "mr-[36px]"}`}
                                  onClick={selectRandomTrack}>
                                      <RxShuffle size={30}/>
                                  </Button>
                                </Tooltip>

                              )}



                              {randomTrack && (
                              <div>
                                  {randomTrack.preview_url && gameActive ? (
                                      <div className={`audio-component ${props.customGame ? "" : "mr-[41px]"} ${detectMob() ? "w-[70vw]" : "w-[35vw]"}`}>
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
                                              <button className='play-pause-button ' onClick={skip}>
                                                  <PiFastForwardFill size={35} />
                                              </button>
                                          </div>
                                          <div className={`progress-bar ${detectMob() ? "w-[70vw]" : "w-[35vw]"}`}>
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
                            <div>
                            </div>
                          </div>
                      </div>
                  </div>
                  <Patchnotes />
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
