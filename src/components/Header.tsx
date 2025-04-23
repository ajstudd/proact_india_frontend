import { Box, HStack, Icon, Spacer, Text } from "@chakra-ui/react";
import { RootState } from "@store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineNotificationsNone, MdOutlinePerson } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [closeTimeoutId, setCloseTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showDropdown = () => {
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      setCloseTimeoutId(null);
    }
    setDropdown(true);
  };

  const scheduleHideDropdown = () => {
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
    }
    const id = setTimeout(() => {
      setDropdown(false);
    }, 500); // Adjust the timeout as needed
    setCloseTimeoutId(id);
  };

  return (
    <HStack w={"full"} height={"60px"} borderBottom={"1px solid #DDDDDD"} p={5}>
      <Image alt="logo" height={"30"} width={"30"} src="/IGMSvg.svg" />
      <Text fontWeight={"600"}>Intelligram</Text>
      <Spacer />
      <HStack spacing={10} paddingRight={10}>
        <MdOutlineNotificationsNone
          size={20}
          className="hover:text-blue-600 cursor-pointer"
        />
        <MdOutlinePerson
          size={20}
          onMouseEnter={showDropdown}
          onMouseLeave={scheduleHideDropdown}
          className="relative hover:text-blue-600 cursor-pointer"
        />
        {dropdown && (
          <Box
            className="absolute bg-white shadow-lg rounded-lg p-4 top-12 right-5"
            onMouseEnter={showDropdown}
            onMouseLeave={scheduleHideDropdown}
          >
            <Text cursor={'pointer'} _hover={{
              color:'blue'
            }} >Profile</Text>
            <Text cursor={'pointer'} _hover={{
              color: 'red'
            }} onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            >Logout</Text>
          </Box>
        )}
      </HStack>
    </HStack>
  );
}