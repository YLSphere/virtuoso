import { useState, useEffect } from 'react';
import '../css/Navbar.css';
import { useNavigate } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import axios from 'axios';

interface UserProfile {
  display_name: string;
  images: { url: string }[];
}

function Navbar() {
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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          {/* <FaSpotify size={40} /> */}
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
          <li className="navbar-item" onClick={logout}>
            <a href="/" className="navbar-link">
              logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;