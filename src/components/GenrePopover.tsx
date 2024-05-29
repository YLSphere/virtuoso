import React, { useState } from 'react';
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { SlMenu } from "react-icons/sl";
import {Checkbox} from "@nextui-org/checkbox";

type StringDictionary = { [key: string]: string[] };

export default function GenrePopover({
    genres
}:{
    genres:StringDictionary
}) {

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        console.log('nig')
    };
  return (
    
    <Popover placement="right">
      <PopoverTrigger>
        <Button isIconOnly className = 'bg-transparent text-white focus:outline-none'>
            <SlMenu size = {30} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Checkbox defaultSelected>Option</Checkbox>
      </PopoverContent>
    </Popover>
  );
}