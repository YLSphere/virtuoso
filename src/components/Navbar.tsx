import React, { useState, useEffect } from 'react';
import '../css/Navbar.css';
import Streak from '../components/Streak';
import { MdOutlineLogout } from "react-icons/md";
import { TbFilter } from "react-icons/tb";
import axios from 'axios';
import { FaSpotify } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";

interface UserProfile {
  display_name: string;
  images: { url: string }[];
}

interface NavbarProps {
  customGame: boolean;
  setCustomGame: React.Dispatch<React.SetStateAction<boolean>>;
  streak: number;
}

function Navbar(props: NavbarProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = window.localStorage.getItem("token");
        const response = await axios.get<UserProfile>("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const logout = () => {
    window.localStorage.removeItem("token");
  };
  const handleChange = () => {
    props.setCustomGame((prevState:any) => !prevState);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          {userProfile && (
            <div className="navbar-profile">
              <img
                src={userProfile.images[0]?.url}
                alt={userProfile.display_name}
                className="navbar-profile-image"
              />
              <span className="navbar-profile-name">{userProfile.display_name}</span>
            </div>
          )}
        </a>
        <ul className="navbar-menu">
          <li className="navbar-item mr-[7vh]">
            <Streak value={props.streak} />
          </li>
          <li className="navbar-item">
            <div className="toggle-container">
              <span className="toggle-label">{props.customGame ? <FaSpotify size = {25} style = {{color: "#40b86a"}}/> : <IoMdTrendingUp size = {25} style = {{color: "#d8d649"}}/>}</span>
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