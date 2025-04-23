import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import { Box } from "@chakra-ui/react";
import { RouteNames } from "@constants";
import UnAuthHeader from "./Header copy";
import { useRouter } from "next/router";
import { GlobalToast } from "./toast";

interface Props {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  const router = useRouter();
  const location = router.pathname;

  const hideSidebar =
    location === RouteNames.login || location === RouteNames.signup;
  const hideHeader =
    location === RouteNames.login || location === RouteNames.signup;
  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      {!hideHeader ? <Header /> : <UnAuthHeader />}
      <div className="flex w-full flex-row gap-4 h-full">
        {!hideSidebar && (
          <Box display={"flex"} w={"250px"} maxW={"250px"}>
            <Sidebar />
          </Box>
        )}
        <Box
          display={"flex"}
          flexDirection={"column"}
          w={"100%"}
          style={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 60px)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div style={{ height: "100%" }}>{children}</div>
          <style jsx>
            {`
              ::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
        </Box>
      </div>
      <GlobalToast />
    </div>
  );
};
