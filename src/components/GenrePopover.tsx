import React, { useState } from 'react';
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { SlMenu } from "react-icons/sl";
import {CheckboxGroup, Checkbox} from "@nextui-org/react";
// import {CheckboxGroup, Checkbox} from "@nextui-org/checkbox";
// import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";
// import {Button, ButtonGroup} from "@nextui-org/button";


export default function GenrePopover({
    allGenres,
    setSelectedGenres,
    myGenres,
    setGenreMenuOpen,
    genreMenuOpen
}:{
    allGenres:string[];
    setSelectedGenres: any;
    myGenres: string[];
    setGenreMenuOpen:any;
    genreMenuOpen: boolean;
    
}) {

  const [localGenres, setLocalGenres] = useState<string[]>(myGenres);

  function handleClose(){

    if (Array.from(new Set(myGenres.concat(localGenres))).length != myGenres.length){
      
      setSelectedGenres(localGenres);
      setGenreMenuOpen(!genreMenuOpen);
    }
  } 

  function handleCheckboxes(value:string[]){
    console.log(value)
    setLocalGenres(value);
  }

  return (
    
    <Popover placement="right" backdrop = 'blur' onClose = {handleClose}> 
      <PopoverTrigger>
        <Button isIconOnly className = 'bg-transparent text-white focus:outline-none' >
            <SlMenu size = {30} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
      <CheckboxGroup
        label="genres"
        value={localGenres}
        onValueChange = {handleCheckboxes}
      >
          <Checkbox value = 'modern_pop'>modern pop</Checkbox>
          <Checkbox value = "00s_pop">00s pop</Checkbox>
          <Checkbox value = 'alternative'>alternative</Checkbox>
          <Checkbox value = 'kpop'>kpop</Checkbox>
          <Checkbox value = 'rock'>rock</Checkbox>
          <Checkbox value = 'krnb'>k-rnb</Checkbox>
          <Checkbox value = 'cantopop'>cantopop</Checkbox>
          <Checkbox value = 'mandopop'>mandopop</Checkbox>
          <Checkbox value = 'hiphop'>hip-hop</Checkbox>
          <Checkbox value = '80s90s'>80s/90s</Checkbox>
      </CheckboxGroup>
      <></>
      </PopoverContent>
    </Popover>
  );
}



