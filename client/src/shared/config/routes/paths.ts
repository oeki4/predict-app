import { AppRoutes } from "./routes";

export const paths: Record<AppRoutes, string> = {
  [AppRoutes.DASHBOARD]: "/",
  [AppRoutes.MARKET]: "/market",
  [AppRoutes.CORPORATION]: "/corporation",
  [AppRoutes.PROFILE]: "/profile",
  [AppRoutes.SCIENCE]: "/science",
  [AppRoutes.MINIGAMES]: "/minigames",
  [AppRoutes.JOIN_GAME]: "/join-game",
  [AppRoutes.CREATE_COMPANY]: "/create-company",
  [AppRoutes.JOIN_FRIEND]: "/join-friend",
};
