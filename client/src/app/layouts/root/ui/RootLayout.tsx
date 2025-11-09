import { Header } from "@widgets/header";
import { Outlet } from "react-router";
import { BottomTabs } from "@widgets/BottomTabs";
import { GlobalLoader } from "@widgets/global-loader";
import { useLoaderStore } from "@shared/stores";
import { useEffect } from "react";
import { useUserStore } from "@entities/user";
import { clsx } from "clsx";

export default function RootLayout() {
  const { hideLoader, showLoader } = useLoaderStore();
  const {setUser } = useUserStore();
  const {} = useUserStore();
  const tgUser = window.Telegram.WebApp.initDataUnsafe.user;

  useEffect(() => {
    showLoader();

    setTimeout(() => {
      setUser({
        avatar: tgUser?.photo_url || "",
        level: 1,
        username: tgUser?.username || "",
        id: 1,
        hasCompany: false,
      });

      hideLoader();
    }, 500);
  }, []);
  return (
    <>
      <Header />
      <main className={clsx("main-section")}>
        <Outlet />
      </main>
      <BottomTabs />
      <GlobalLoader />
    </>
  );
}
