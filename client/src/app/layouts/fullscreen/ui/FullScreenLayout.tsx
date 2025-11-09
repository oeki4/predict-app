import { Outlet } from "react-router";
import { GlobalLoader } from "@widgets/global-loader";

export default function FullScreenLayout() {
  return (
    <>
      <Outlet />
      <GlobalLoader />
    </>
  );
}
