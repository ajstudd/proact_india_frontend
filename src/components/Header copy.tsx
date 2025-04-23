import { Box, HStack, Icon, Spacer, Text } from "@chakra-ui/react";
import { RootState } from "@store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineNotificationsNone, MdOutlinePerson } from "react-icons/md";
import { useSelector } from "react-redux";

export default function UnAuthHeader() {
  return (
    <HStack w={"full"} height={"60px"} borderBottom={"1px solid #DDDDDD"} p={5}>
      <Image alt="logo" height={"30"} width={"30"} src="/IGMSvg.svg" />
      <Text fontWeight={"600"}>Intelligram</Text>
      </HStack>
  );
}