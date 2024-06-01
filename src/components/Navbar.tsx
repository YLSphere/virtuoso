import React, { useState, useEffect } from 'react';
import '../css/Navbar.css';
import Streak from '../components/Streak';
import { useSpotifyToken } from '../components/SpotifyToken';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { FaSpotify } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { MdLeaderboard } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";

import {Button, Tooltip} from "@nextui-org/react";

interface UserProfile {
  display_name: string;
  images: { url: string }[];
  id: string;
}

interface NavbarProps {
  customGame: boolean;
  setCustomGame: React.Dispatch<React.SetStateAction<boolean>>;
  streak: number;
  setSpotifyId: any;
  setUserName: any;
  profileImage:any;
  setProfileImage:any;
}

function Navbar(props: NavbarProps) {

  var sBrowser, sUsrAg = navigator.userAgent;

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

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const {token} = useSpotifyToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<UserProfile>("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);
        props.setSpotifyId(response.data.id);
        props.setUserName(response.data.display_name);
        props.setProfileImage(response.data.images[0]?.url);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLeaderboardClick = () => {
    navigate('/leaderboard');
  };
  const handleProfileClick = () => {
    navigate('/');
  };

  const logout = () => {
    window.localStorage.removeItem("token");
  };
  const handleChange = () => {
    props.setCustomGame((prevState:any) => !prevState);
    console.log(props.customGame)
  };

  return (
    <nav className="navbar">
      <div className="navbar-container align-middle my-0 p-0">
        <div className="navbar-logo" onClick={handleProfileClick}>
          {userProfile && (
            <Button className='bg-transparent' onClick={handleProfileClick}>
              <div className="navbar-profile" >
                <img
                  src={userProfile.images[0]?.url}
                  alt={userProfile.display_name}
                  className="navbar-profile-image"
                />
                {!detectMob() && <span className="navbar-profile-name" onClick={handleProfileClick}>{userProfile.display_name}</span>}
              </div>
            </Button>
          )}
        </div>
        <ul className="align-right justify-end w-[35vh] h-[100%] my-0 p-0 flex flex-row space-x-10 items-center">
          <li className="navbar-item" >
            <div className="navbar-link">
              <Button isIconOnly className='bg-transparent' onClick={handleLeaderboardClick}>
                <MdLeaderboard size={25} style={{ color: "#d8d649" }} />
              </Button>
            </div>
          </li>
          <li className="navbar-item">
            <Streak value={props.streak} />
          </li>
          <li className="">
            <div className="flex flex-row items-center align-center gap-[9px]">
              <span className="toggle-label">{props.customGame ? (
                <FaSpotify size = {25} style = {{color: "#40b86a"}}/> 
              ) : (
                <IoMdTrendingUp size = {25} style = {{color: "#d8d649"}}/> 
            )}
              </span>
                <label className="switch">
                  <input type="checkbox" checked={props.customGame} onChange={handleChange} />
                  <span className="slider round"></span>
                </label>
            </div>
          </li>
          <li className="navbar-item" onClick={logout}>
            <a href="/" className="navbar-link">
              <MdOutlineLogout size={25}/>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;