import { ButtonBack, ContainedIcon, Flex, Text } from "@shared/ui";
import styles from "./join-friend-page.module.scss";
import UsersIcon from "@shared/assets/svg/users.svg?react";
import { useNavigate } from "react-router";

export default function JoinFriendPage() {
  const navigate = useNavigate();
  return (
    <Flex direction={"column"} className={styles["JoinFriendPage"]}>
      <Flex
        className={styles["JoinFriendPageInner"]}
        gap={12}
        items={"center"}
        direction={"column"}
        justify={"center"}
      >
        <Flex>
          <ButtonBack onClick={() => navigate(-1)} />
        </Flex>
        <ContainedIcon radius="full" gradientColor="green" icon={UsersIcon} />
        <Text size={16} color="black">
          Присоединиться
        </Text>
        <Text as={"span"} size={12} color="black">
          Приглашение от:{" "}
          <Text as={"span"} size={12} color="green">
            123
          </Text>
        </Text>
        <Text align={"center"} size={10} color="black">
          Вы присоединитесь к корпорации друга и будете работать вместе
        </Text>
      </Flex>
    </Flex>
  );
}
