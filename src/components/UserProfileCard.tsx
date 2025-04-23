import React, { useState, useEffect, useRef } from "react";
import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";

interface Props {
  isDisabled?: boolean;
  isEditPost?: boolean;
  username?: string;
  profilePicture?: string;
  createdAt?: string;
}

export const ProfileCard: React.FC<Props> = (props) => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); 
  const iconRef = useRef<HTMLDivElement | null>(null);

  // Toggle dropdown state
  const toggleDropdown = () => setDropdown(!dropdown);


  const date = new Date(props.createdAt || new Date());
  const time = `${date.getDate()} ${date.toLocaleString("default", {
    month: "short",
  })} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setDropdown(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, iconRef]);

  return (
    <div className="flex flex-row gap-2 justify-between">
      <HStack>
        <Image alt="profile" height={"50"} width={"50"} src="/IGMSVG.svg" />
        <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
          <Text>{
            props.username || "John Doe"
            }</Text>
          <Text fontSize={"12px"} color={"gray"}>
            {time}
          </Text>
        </VStack>
      </HStack>
      
      <div ref={iconRef} className="relative">
        <BsThreeDots onClick={toggleDropdown} className="cursor-pointer" />
        {dropdown && (
          <Box
            ref={dropdownRef}
            className="absolute bg-white shadow-lg rounded-lg p-2 min-w-[100px] z-10 right-[6px]"
          >
            <Text>Option 1</Text>
            <Text>Option 2</Text>
          </Box>
        )}
      </div>
    </div>
  );
};