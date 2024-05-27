import React from 'react';
import '../css/Modal.css';

import { FaWindowClose } from "react-icons/fa";

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

interface ModalProps {
  isVisible: boolean;
  isCorrect: boolean;
  onClose: () => void;
  track: Track | null; // Assuming you have a Track type
}

const Modal: React.FC<ModalProps> = ({ isCorrect, isVisible, onClose, track }) => {
  if (!isVisible || !track) {
    return null;
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isCorrect ? 'modal-correct' : 'modal-incorrect'}`} onClick={(e) => e.stopPropagation()}>
        {/* <button className = 'close-button' onClick={onClose}>
            <FaWindowClose size = {30}/>
        </button> */}
        <h2 className = 'display-text font-bold mt-4'>{track.name}</h2>
        <p className = 'display-text'>Artist: {track.artists.map((artist: any) => artist.name).join(', ')}</p>
        <p className = 'display-text mb-4'>Album: {track.album.name}</p>
        <img className = 'mt-3 mb-2 mx-auto' src={track.album.images[0]?.url} alt={track.name} style={{ width: '80%'}} />
      </div>
    </div>
  );
};

export default Modal;