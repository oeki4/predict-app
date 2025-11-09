import type { RouteObject } from "react-router";
import { RootLayout } from "@app/layouts/root";
import { DashboardPage } from "@pages/dashboard";
import { paths } from "./paths";
import { MinigamesPage } from "@pages/minigames";
import { MarketPage } from "@pages/market";
import { CorporationPage } from "@pages/corporation";
import { ProfilePage } from "@pages/profile";
import { SciencePage } from "@pages/science";
import { FullScreenLayout } from "@app/layouts/fullscreen";
import { JoinGamePage } from "@pages/join-game";
import { CreateCompanyPage } from "@pages/create-compaty";
import JoinFriendPage from "@pages/join-friend/ui/JoinFriendPage";

export const routeConfig: Array<RouteObject> = [
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        path: paths.dashboard,
      },
      {
        path: paths.minigames,
        element: <MinigamesPage />,
      },
      {
        path: paths.market,
        element: <MarketPage />,
      },
      {
        path: paths.corporation,
        element: <CorporationPage />,
      },
      {
        path: paths.profile,
        element: <ProfilePage />,
      },
      {
        path: paths.science,
        element: <SciencePage />,
      },
    ],
  },

  {
    element: <FullScreenLayout />,
    children: [
      {
        element: <JoinGamePage />,
        path: paths["join-game"],
      },
      {
        element: <CreateCompanyPage />,
        path: paths["create-company"],
      },
      {
        element: <JoinFriendPage />,
        path: paths["join-friend"],
      },
    ],
  },
];
