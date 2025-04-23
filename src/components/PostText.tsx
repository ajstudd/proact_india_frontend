import React, { useState, useEffect, useRef } from "react";
import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";

interface Props {
  content: string;
}

export const PostText: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col py-2 gap-2 h-max w-full">
      <Text>{props.content}</Text>
    </div>
  );
};
