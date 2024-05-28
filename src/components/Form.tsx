import React, { useState, useRef, useEffect } from 'react';
import "../css/Form.css"

interface DisplayData {
  artist: string;
  name: string;
  index: number;
  wholeName: string;
}

interface FormProps {
  onSubmit: (value: string) => void;
  displayData: DisplayData[];
}

const Form: React.FC<FormProps> = ({ onSubmit, displayData }) => {
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
    console.log(filteredTracks.length);
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
        <ul className="suggestions" ref={suggestionsRef} style={{ marginBottom: suggestionsHeight + 100 }}>
          {suggestions.map(track => (
            <li key={track.index} onClick={() => handleSuggestionClick(track)}>
              {track.wholeName}
            </li>
          ))}
        </ul>
      )}
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
      <button type="submit" className='submit-button'>submit</button>
    </form>
  );
};

export default Form;