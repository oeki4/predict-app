import { paths } from "@shared/config/routes/paths";
import HomeIcon from "@shared/assets/svg/home.svg?react";
import GamePadIcon from "@shared/assets/svg/gamepad.svg?react";
import ShoppingBagIcon from "@shared/assets/svg/shopping-bag.svg?react";
import FlaskIcon from "@shared/assets/svg/flask.svg?react";
import CorporationIcon from "@shared/assets/svg/corporation.svg?react";
import UserIcon from "@shared/assets/svg/user.svg?react";

export const bottomTabsRoutes = [
  {
    name: "Главная",
    path: paths.dashboard,
    icon: HomeIcon,
  },
  {
    name: "Игры",
    path: paths.minigames,
    icon: GamePadIcon,
  },
  {
    name: "Рынок",
    path: paths.market,
    icon: ShoppingBagIcon,
  },
  {
    name: "Наука",
    path: paths.science,
    icon: FlaskIcon,
  },
  {
    name: "Корп.",
    path: paths.corporation,
    icon: CorporationIcon,
  },
  {
    name: "Профиль",
    path: paths.profile,
    icon: UserIcon,
  },
];
