import styles from "./BottomTabs.module.scss";
import { clsx } from "clsx";
import { bottomTabsRoutes } from "../model/routes";
import { NavLink, useLocation } from "react-router";
import { Icon, Text } from "@shared/ui";

export default function BottomTabs() {
  let location = useLocation();

  return (
    <div className={clsx(styles["BottomTabs"])}>
      {bottomTabsRoutes.map(({ name, path, icon }) => {
        return (
          <NavLink
            className={clsx(
              styles["BottomTab"],
              location.pathname === path && styles["BottomTabActive"],
            )}
            key={name}
            to={path}
          >
            <Icon className={styles["BottomTabIcon"]} icon={icon} />
            <Text weight={500} size={12} className={styles["BottomTabText"]}>
              {name}
            </Text>
          </NavLink>
        );
      })}
    </div>
  );
}
