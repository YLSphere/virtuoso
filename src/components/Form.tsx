import React, { useState, useRef, useEffect } from 'react';
import "../css/Form.css"

import GenrePopover from '../components/GenrePopover';
interface DisplayData {
  artist: string;
  name: string;
  index: number;
  wholeName: string;
  
}


interface FormProps {
  onSubmit: (value: string) => void;
  displayData: DisplayData[];
  setSelectedGenres: any;
  myGenres: string[];
  setGenreMenuOpen: any;
  genreMenuOpen: boolean;
  customGame: boolean;
}

const Form: React.FC<FormProps> = ({ onSubmit, displayData, setSelectedGenres, myGenres, setGenreMenuOpen, genreMenuOpen, customGame}) => {
  const [songGuess, setSongGuess] = useState('');
  const [suggestions, setSuggestions] = useState<DisplayData[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  const [suggestionsHeight, setSuggestionsHeight] = useState(0);


  useEffect(() => {
    if (suggestionsRef.current) {
      setSuggestionsHeight(suggestionsRef.current.clientHeight);
    }
  }, [suggestions]);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(songGuess);
    setSongGuess('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSongGuess(value);

    const uniqueWholeNames = Array.from(
      new Set(
        displayData
          .filter(track => track.wholeName.toLowerCase().includes(value.toLowerCase()))
          .map(track => track.wholeName)
      )
    );
  
    const filteredTracks = uniqueWholeNames.map(wholeName =>
      displayData.find(track => track.wholeName === wholeName)
    ).filter(track => track !== undefined) as DisplayData[];
  
    setSuggestions(filteredTracks);
  };

  const handleSuggestionClick = (track: DisplayData) => {
    setSongGuess(track.wholeName);
    setSuggestions([]); // Clear suggestions
  };

  const handleBodyClick = (event: MouseEvent) => {
    if (!isInputFocused) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, [isInputFocused]);

  return (
    <form onSubmit={handleSubmit} className='form'>
      {suggestions.length > 0 && (
        <ul className={`suggestions ${customGame ? "" : "mr-[40px]"}`} ref={suggestionsRef} style={{ marginBottom: suggestionsHeight + 100 }}>
          {suggestions.map(track => (
            <li key={track.index} onClick={() => handleSuggestionClick(track)}>
              {track.wholeName}
            </li>
          ))}
        </ul>
      )}
      <div className = 'flex flex-col justify-center'>
        <div className = 'flex flex-row items-start justify-center'>
          <div className = "flex flex-col justify-center ">
            <input
              className='input'
              type="text"
              name="songGuess"
              placeholder="search"
              value={songGuess}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
            
          </div>
          {!customGame && 
          <div >
            <GenrePopover 
              setSelectedGenres = {setSelectedGenres} 
              myGenres = {myGenres} 
              setGenreMenuOpen = {setGenreMenuOpen}
              genreMenuOpen = {genreMenuOpen}
            />
          </div>}
          
        </div>
        <button type="submit" className={`submit-button ${customGame ? "" : "mr-[40px]"}`}>submit</button>
      </div>
      
    </form>
  );
};

export default Form;