import React, { useState, useEffect, useRef } from "react";
import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";

interface Props {
  images: string[];
}

export const PictureGrid: React.FC<Props> = (props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {props.images.map((image, index) => (
        <Box key={index} className="flex flex-col max-w-[200px] max-h-[200px]">
          <Image key={index} src={image} alt="image" />
        </Box>
      ))}
    </div>
  );
};
