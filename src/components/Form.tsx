import React, { useState } from 'react';
import { displayDataExport } from '../pages/home';
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



const Form: React.FC<FormProps> = ({ onSubmit, displayData}) => {
  const [songGuess, setSongGuess] = useState('');
  const [suggestions, setSuggestions] = useState<{ artist: string; name: string; index: number, wholeName: string}[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(songGuess);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  setSongGuess(value);

  const filteredTracks = displayData.filter(track =>
    track.wholeName.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredTracks);
  };

  const handleSuggestionClick = (track: { wholeName: string }) => {
    setSongGuess(track.wholeName);
    setSuggestions([]); // Clear suggestions
  };

  const handleBodyClick = (event: MouseEvent) => {
    if (!isInputFocused) {
      setSuggestions([]);
    }
  };

  React.useEffect(() => {
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, [isInputFocused]);

  return (
    <form onSubmit={handleSubmit} className = 'form'>
      <input
        className = 'input'
        type="text"
        name="songGuess"
        placeholder="Guess a song"
        value={songGuess}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        required
      />
      <button type="submit" className = 'submit-button'>submit</button>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.slice(0, 10).map(track => (
            <li key={track.index} onClick={() => handleSuggestionClick(track)}>
              {track.wholeName}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default Form;