import { Avatar, Badge, Card, Icon, Text } from "@shared/ui";
import styles from "./profile-card.module.scss";
import type { User } from "@entities/user";
import { clsx } from "clsx";
import StarIcon from "@shared/assets/svg/star.svg?react";

interface IProps {
  user: User;
}

export default function ProfileCard(props: IProps) {
  const { user } = props;
  return (
    <Card className={styles["ProfileCard"]}>
      <Avatar url={user.avatar} />
      <div className={clsx(styles["ProfileCardInfo"])}>
        <Text className={styles["ProfileCardText"]} weight={500} size={16}>
          {user.username}
        </Text>
        <Text className={styles["ProfileCardText"]} weight={500} size={12}>
          ID: {user.id}
        </Text>
        <Badge>
          <Icon
            initialFill
            className={styles["ProfileCardLevelIcon"]}
            icon={StarIcon}
          />
          <Text className={styles["ProfileCardText"]} size={10}>
            Уровень {user.level}
          </Text>
        </Badge>
      </div>
    </Card>
  );
}
