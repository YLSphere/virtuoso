import { useState, useEffect, useMemo } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { useSpotifyToken } from '../components/SpotifyToken';
import Navbar from '../components/Navbar';

import "../css/App.css";
import '../css/particles.css';

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell, 
  User, 
  Pagination, 
  PaginationItem, 
  PaginationCursor
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
}

function Leaderboard(props: LeaderboardProps) {
  const columns = ['name', 'highest streak', 'avg. listening time (s)']
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 5;
  const { token } = useSpotifyToken();

  const usersCollectionRef = collection(db, "leaderboard");

  const pages = Math.ceil(props.users.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return props.users.slice(start, end);
  }, [page, props.users]);

  

  // const deleteUser = async (spotify_id:string) => {
  //   const userDoc = doc(db, "leaderboard", spotify_id);
  //   await deleteDoc(userDoc);
  //   getUsers();
  // };

  return (
    <div>
      <div className="absolute top-0 left-0 w-full h-full z-0 inset-0">
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
      />
  
      <div className = 'flex justify-center items-center h-screen' >
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
              wrapper: "min-h-[222px] bg-black",
              th: 'bg-[#303030] text-[#ccc]',

            }}
            
          >
            <TableHeader>
              {columns.map((column) =>
              <TableColumn key={column}>{column}</TableColumn>
              )}
              
            </TableHeader>
            <TableBody emptyContent={"no one here :("} key = 'results'>

              {props.users.filter((row: any) => row.max_streak > 0).sort((a:any,b:any)=>{
                  if (a.max_streak-b.max_streak>1) {return -1;}
                  else if (a.max_streak-b.max_streak<1) {return 1;}
                  else { return 0;}
                }).map((row:any, index:number) => 
                  <TableRow key={index}>
                  <TableCell className="text-[#ccc]">
                  <User
                    avatarProps={{radius: "lg", src: row.spotify_id}}
                    name={row.name}
                  >
                  </User>
                  </TableCell>
                  <TableCell className="text-[#ccc] text-center">{row.max_streak.toString()}</TableCell>
                  <TableCell className="text-[#ccc] text-center">{(Math.round(row.avg_time * 100) / 100).toFixed(2).toString()}</TableCell>
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