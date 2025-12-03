import { Avatar, Card, Text } from "@shared/ui";
import styles from "./profile-card.module.scss";
import type { User } from "@entities/user";
import { clsx } from "clsx";

interface IProps {
  user: User;
  generatedForecasts: number;
}

export default function ProfileCard(props: IProps) {
  const { user, generatedForecasts } = props;
  return (
    <Card className={styles["ProfileCard"]}>
      <Avatar url={user.avatar} />
      <div className={clsx(styles["ProfileCardInfo"])}>
        <Text className={styles["ProfileCardText"]} weight={500} size={16}>
          {user.username}
        </Text>
        <Text className={styles["ProfileCardText"]} weight={500} size={12}>
          Количество сгенерированных прогнозов: {generatedForecasts}
        </Text>
      </div>
    </Card>
  );
}
