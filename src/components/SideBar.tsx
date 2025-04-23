import { Box, HStack, Icon, Spacer, Text, VStack } from "@chakra-ui/react";
import { RootState } from "@store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MdOutlineNotificationsNone, MdOutlinePerson } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const list = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Profile",
      link: "/profile",
    },
    {
      name: "Leaderboard",
      link: "/leaderboard",
    },
    {
      name: "Settings",
      link: "/settings",
    },
  ];

  return (
    <VStack w={"full"} minW={"100%"} height={"full"} alignItems={'flex-start'} borderBottom={"1px solid #DDDDDD"} p={5}>
      {list.map((item, index) => (
        <Box key={index}
        padding={5}
        style={{
          backgroundColor: router.pathname === item.link ? '#4A90E2' : '',
          color: router.pathname === item.link ? 'white' : ''
        }}
         className="hover:bg-blue-400 cursor-pointer flex-col w-[100%] min-w-[100%]">
        <Text
          onClick={() => {
            router.push(item.link);
          }}
        >
          {item.name}
        </Text>
        </Box>
      ))}
    </VStack>
  );
}
