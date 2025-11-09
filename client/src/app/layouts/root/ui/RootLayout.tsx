import { Header } from "@widgets/header";
import { Outlet, useNavigate } from "react-router";
import { BottomTabs } from "@widgets/BottomTabs";
import { GlobalLoader } from "@widgets/global-loader";
import { useLoaderStore } from "@shared/stores";
import { useEffect } from "react";
import { useUserStore } from "@entities/user";
import { clsx } from "clsx";
import { paths } from "@shared/config/routes/paths";

export default function RootLayout() {
  const { hideLoader, showLoader } = useLoaderStore();
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
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

      if (!user?.hasCompany) navigate(paths["join-game"]);
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
