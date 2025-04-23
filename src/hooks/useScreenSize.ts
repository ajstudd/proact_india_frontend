import { useState, useEffect } from "react";

type ScreenSize = "small" | "medium" | "large";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("small");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWidth(w);
      setHeight(h);

      if (w >= 1024) {
        setScreenSize("large");
      } else if (w >= 768) {
        setScreenSize("medium");
      } else {
        setScreenSize("small");
      }
    };

    // Initial size update
    updateSize();

    // Update the size on window resize
    window.addEventListener("resize", updateSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return { screenSize, width, height };
};

export default useScreenSize;
