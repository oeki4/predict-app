import { paths } from "@shared/config/routes/paths";
import ChartIcon from "@shared/assets/svg/chart.svg?react";
import HistoryIcon from "@shared/assets/svg/history.svg?react";
import InformationIcon from "@shared/assets/svg/question.svg?react";
import UserIcon from "@shared/assets/svg/user.svg?react";

export const bottomTabsRoutes = [
  {
    name: "Прогноз",
    path: paths.dashboard,
    icon: ChartIcon,
  },
  {
    name: "История",
    path: paths.minigames,
    icon: HistoryIcon,
  },
  {
    name: "Информация",
    path: paths.corporation,
    icon: InformationIcon,
  },
  {
    name: "Профиль",
    path: paths.profile,
    icon: UserIcon,
  },
];
