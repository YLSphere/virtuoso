import React, { useState, useRef, useEffect } from 'react';
import {Button, Autocomplete, AutocompleteItem} from "@nextui-org/react";
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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const displayData_set = Array.from(new Set(displayData.map(a => a.wholeName)))
 .map(name => {
   return displayData.find(a => a.wholeName === name)
 })

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
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(songGuess);
    setSongGuess('');
    return false;
  };

  const handleInputChange = (value:string) => {
    setSongGuess(value)
  };

  return (
    <form onSubmit={handleSubmit} className='form'>

      
      
      <div className = 'flex flex-col justify-center items-center'>
        <div className = 'flex flex-row items-start justify-center'>
          <div className = "flex flex-col justify-center ">
          <Autocomplete
            defaultItems = {displayData_set}
            onInputChange = {handleInputChange}
            onFocus = {() => {setIsInputFocused(!isInputFocused)}}
            onBlur = {() => {setIsInputFocused(!isInputFocused)}}
            label="search"
            radius = 'sm'
            classNames={{
              base: `bg-transparent input ${detectMob() ? "w-[70vw]" : "w-[35vw]"}`,
            }}
            popoverProps={{
              classNames: {
                base: "bg-transparent",
                content: "p-1 text-black bg-[#cccacaee]",
              },
            }}
            inputProps={{
              classNames: {
                input: "text-[16px]",
                inputWrapper: "bg-[#cccacaee] border-[white] border-2 ",
                innerWrapper:'h-[5vh]',
                label: isInputFocused || songGuess ? 'text-black' : 'text-black text-[16px]'
              },
            }}
            listboxProps={{
              hideSelectedIcon: true,
              itemClasses: {
                base: [
                  "text-black",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[pressed=true]:opacity-50",
                  "data-[hover=true]:bg-default-200",
                  "data-[selectable=true]:focus:bg-default-100",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              },
            }}
          >
            {(display) => <AutocompleteItem key={display.index}>{display.wholeName}</AutocompleteItem>}
          </Autocomplete>
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
        <Button type="submit" className={`submit-button bg-transparent text-[#ccc] text-base ${customGame ? "" : "mr-[40px]"}`}>submit</Button>
      </div>
      
    </form>
  );
};

export default Form;