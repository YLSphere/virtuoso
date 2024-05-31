import React, { useState, useEffect } from 'react';
import {Popover, PopoverTrigger, PopoverContent, Button, Tooltip, CheckboxGroup, Checkbox} from "@nextui-org/react";
import { SlMenu } from "react-icons/sl";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";

export default function GenrePopover({
    setSelectedGenres,
    myGenres,
    setGenreMenuOpen,
    genreMenuOpen
}:{
    setSelectedGenres: any;
    myGenres: string[];
    setGenreMenuOpen:any;
    genreMenuOpen: boolean;
    
}) {

  const [localGenres, setLocalGenres] = useState<string[]>(myGenres);
  // const [localGenres, setLocalGenres] = useState<string[]>(['test1', 'test2']);
  // const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isOpen, setIsOpen] = useState<boolean>(false)
 

  function handleClose(){
    setIsOpen(!isOpen);
    // console.log(Array.from(new Set(myGenres.concat(localGenres))).length)
    // console.log(Array.from(new Set(myGenres.concat(localGenres))))
    // console.log(localGenres.length)
    // console.log(localGenres)
    // console.log(Array.from(new Set(myGenres.concat(localGenres))).length != localGenres.length)
    // if (Array.from(new Set(myGenres.concat(localGenres))).length != localGenres.length){

    // }
    setSelectedGenres(localGenres);
    setGenreMenuOpen(!genreMenuOpen);
  } 

  function handleCheckboxes(value:string[]){
    setLocalGenres(value);
  }

  return (
    
    <Popover placement="right" backdrop = 'opaque'  triggerScaleOnOpen = {false}  onClose = {handleClose}
    isOpen={isOpen}
    onOpenChange={(open) => {
      setIsOpen(open)
    }}
    > 
      <PopoverTrigger>
        {/* <Tooltip color="success" closeDelay={500} content="change genres" size = 'lg'> */}
          <Button isIconOnly className = 'bg-transparent text-white focus:outline-none active:outline-none ' >
              <SlMenu size = {30} className = 'p-[5px]'/>
          </Button>
        {/* </Tooltip> */}
      </PopoverTrigger>
      <PopoverContent>
        <CheckboxGroup
          label="genres"
          value={localGenres}
          onValueChange = {handleCheckboxes}
          color = "success"
          className = 'p-3'
        >
          <div className = 'flex flex-row justify-between gap-4'>
            <div className = 'flex flex-col'>
              <Checkbox value = 'modern_pop'>modern pop</Checkbox>
              <Checkbox value = "00s_pop">00s pop</Checkbox>
              <Checkbox value = 'alternative'>alternative</Checkbox>
              <Checkbox value = 'kpop'>k-pop</Checkbox>
              <Checkbox value = 'rnb'>rnb</Checkbox>
              <Checkbox value = 'rock'>rock</Checkbox>
            </div>
            <div className = 'flex flex-col'>
              <Checkbox value = 'krnb'>k-rnb</Checkbox>
              <Checkbox value = 'cantopop'>cantopop</Checkbox>
              <Checkbox value = 'mandopop'>mandopop</Checkbox>
              <Checkbox value = 'hiphop'>hip-hop</Checkbox>
              <Checkbox value = 'edm'>edm</Checkbox>
              <Checkbox value = '80s90s'>80s/90s</Checkbox>
            </div>
          </div>
        </CheckboxGroup>
      </PopoverContent>
    </Popover>

    
  );
}



