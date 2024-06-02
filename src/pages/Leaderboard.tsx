import { useState, useEffect, useMemo } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { useSpotifyToken } from '../components/SpotifyToken';
import Navbar from '../components/Navbar';

import "../css/App.css";
import '../css/particles.css';
import "../css/Home.css"

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell, 
  User, 
  Pagination, 
  Chip,
  Button
} from "@nextui-org/react";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";


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
const analytics = getAnalytics(app);
const db = getFirestore(app);


interface LeaderboardProps {
  users: any;
  customGame:any;
  streak:number;
  setSpotifyId:any;
  setUserName:any;
  setCustomGame:any;
  myGenres: string[];
  profileImage:any;
  setProfileImage:any;
  
}

function Leaderboard(props: LeaderboardProps) {
  const columns = ['name', 'highest streak', 'avg. listening time (s)', 'genres']
  const [page, setPage] = useState<number>(1);

  const rowsPerPage = 6;
  const pages = useMemo(() => {
    return props.users.filter((row: any) => row.max_streak > 0).length ? Math.ceil(props.users.filter((row: any) => row.max_streak > 0).length / rowsPerPage) : 0;
  }, [props.users.filter((row: any) => row.max_streak > 0).length, rowsPerPage]);

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
  // const pages = Math.ceil(props.users.filter((row: any) => row.max_streak > 0).length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return props.users.filter((row: any) => row.max_streak > 0).sort((a:any,b:any)=>{
      if (a.max_streak-b.max_streak>=1) {return -1;}
      else if (a.max_streak-b.max_streak<1) {return 1;}
      else { return 0;}
    }).slice(start, end);
  }, [page, props.users]);

  const genreColorMap:{ [id: string] : string; } = {
    'modern pop': 'bg-[#b840ae]',
    "00s pop": 'bg-[#b87040]',
    "alternative": 'bg-[#fafafa]',
    "rock": 'bg-[#40b894]',
    "kpop": 'bg-[#b84054]',
    "krnb": 'bg-[#408cb8]',
    "cantopop": 'bg-[#404cb8]',
    "mandopop": 'bg-[#7840b8]',
    "hip hop": 'bg-[#b84040]',
    "80s, 90s": 'bg-[#1714db]',
    'edm': 'bg-[#d4c818]',
    'custom': 'bg-[#40b86a]'
  }



  return (
    <div>
      <div className="absolute top-0 left-0 w-full h-full z-0 inset-0 unblur">
          <div className="particle" style={{ animationDuration: `${Math.max(100- 10*props.streak, 10)}s`}}></div>
          <div className="particle" style={{ animationDuration: `${Math.max(100- 10*props.streak, 10)}s`}}></div>
          <div className="particle" style={{ animationDuration: `${Math.max(100- 10*props.streak, 10)}s`}}></div>
          <div className="particle" style={{ animationDuration: `${Math.max(100- 10*props.streak, 10)}s`}}></div>
      </div>
      <Navbar 
      customGame={props.customGame} 
      setCustomGame={props.setCustomGame} 
      streak = {props.streak} 
      setSpotifyId={props.setSpotifyId} 
      setUserName = {props.setUserName}
      profileImage = {props.setProfileImage}
      setProfileImage = {props.setProfileImage}
      />
  
      <div className={`flex justify-center items-center h-screen unblur ${detectMob() ? "max-w-[35vw]" : "max-w-[70vw]"}`}>
        <div>
          <Table 
            aria-label="leaderboardExample table with client side pagination"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color = 'success'
                  size = 'sm'
                  classNames={{
                    wrapper: "bg-[#303030]",
                    item: 'bg-[#303030]',
                    prev: 'bg-[#303030]',
                    next: 'bg-[#303030]'

                  }}
                  // color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            classNames={{
              base: "overflow-auto",
              wrapper: "min-h-[222px] bg-black",
              th: 'bg-[#303030] text-[#ccc] justify-center text-center',

            }}
            
          >
            <TableHeader>
              {columns.map((column) =>
              <TableColumn key={column}>{column}</TableColumn>
              )}
              
            </TableHeader>
            <TableBody 
            emptyContent={"no one here :("} 
            key = 'results'>

              {items.map((row:any, index:number) => 
                  <TableRow key={index}>
                  <TableCell className="text-[#ccc]">
                  <User
                    avatarProps={{radius: "lg", src: row.profile_image}}
                    name={row.name}
                  >
                  </User>
                  </TableCell>
                  <TableCell className="text-[#ccc] text-center">{row.max_streak.toString()}</TableCell>
                  <TableCell className="text-[#ccc] text-center">{(Math.round(row.avg_time * 100) / 100).toFixed(2).toString()}</TableCell>
                  <TableCell className="items-center align-center justify-center flex flex-wrap max-w-[500px]">
                    {row.genres.map((genre:string, index_g:number) =>
                    <Chip 
                    key = {index_g + 100} 
                    
                    variant = 'dot'
                    classNames={{
                      base: 'm-1',
                      content: "text-[#ccc]",
                      dot: genreColorMap[genre],
                    }}
                    >
                      {genre}
                    </Chip>)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
    </div>
  );
}

export default Leaderboard;