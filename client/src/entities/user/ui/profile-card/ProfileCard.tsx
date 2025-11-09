import { Avatar, Card, Text } from "@shared/ui";
import styles from "./profile-card.module.scss";
import type { User } from "@entities/user";
import { clsx } from "clsx";

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
      </div>
    </Card>
  );
}
