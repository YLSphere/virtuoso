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

  const { token, setToken } = useSpotifyToken();
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
    setToken('')
    navigate('/');
  };
  const handleChange = () => {
    props.setCustomGame((prevState:any) => !prevState);
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
                <Tooltip content="your songs" placement = 'bottom' color = 'success' closeDelay={0}>
                  <Button isIconOnly className='bg-transparent'>
                    <FaSpotify size = {25} style = {{color: "#40b86a"}}/>  
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip content="popular songs" placement = 'bottom' color = 'warning' closeDelay={0}>
                  <Button isIconOnly className='bg-transparent'>
                    <IoMdTrendingUp size = {25} style = {{color: "#f5a524"}}/> 
                  </Button>
                </Tooltip>
            )}
              </span>
                <label className="switch">
                  <input type="checkbox" checked={props.customGame} onChange={handleChange} />
                  <span className="slider round"></span>
                </label>
            </div>
          </li>
          
          <li className="navbar-item">
            <Tooltip content="logout" placement = 'bottom' color = 'default' closeDelay={0} className='text-black'>
              <Button isIconOnly className='bg-transparent' onClick={logout}>
                <MdOutlineLogout size={25} className='text-white'/>
              </Button>
            </Tooltip>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;