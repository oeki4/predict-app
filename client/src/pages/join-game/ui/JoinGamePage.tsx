import { motion } from "framer-motion";
import styles from "./join-game-page.module.scss";
import UsersIcon from "@shared/assets/svg/users.svg?react";
import FactoryIcon from "@shared/assets/svg/factory.svg?react";
import { Card, ContainedIcon, Flex, Text } from "@shared/ui";
import { useNavigate } from "react-router";
import { paths } from "@shared/config/routes/paths";

export default function JoinGamePage() {
  const navigate = useNavigate();
  return (
    <Flex
      direction="column"
      gap={32}
      items={"center"}
      justify={"center"}
      className={styles["JoinGamePage"]}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={styles["JoinGamePageTextBlock"]}
      >
        <Flex direction={"column"} items={"center"} justify={"center"} gap={12}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Text size={24}>⚡</Text>
          </motion.div>

          <Text weight={500} align={"center"} size={20}>
            Добро пожаловать в EcoChain
          </Text>
          <Text weight={400} align={"center"} size={10}>
            Начните свой путь в экономической стратегии
          </Text>
        </Flex>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Flex direction="column" gap={12}>
          <Card
            isButton
            borderButtonColor="blue"
            onClick={() => navigate(paths["create-company"])}
          >
            <Flex items={"center"} gap={16}>
              <ContainedIcon icon={FactoryIcon} />
              <Flex direction="column" items="start" gap={4}>
                <Text size={16}>Создать компанию</Text>
                <Text weight={500} color="gray" size={12}>
                  Основать собственную компанию
                </Text>
              </Flex>
            </Flex>
          </Card>
          <Card
            isButton
            borderButtonColor="green"
            onClick={() => navigate(paths["join-friend"])}
          >
            <Flex items={"center"} gap={16}>
              <ContainedIcon gradientColor="green" icon={UsersIcon} />
              <Flex direction="column" items="start" gap={4}>
                <Text size={16}>Присоединиться</Text>
                <Text weight={500} color="gray" size={12}>
                  Вступить в команду друга
                </Text>
                <Text weight={400} color="green" size={12}>
                  Приглашение от: 123
                </Text>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </motion.div>
    </Flex>
  );
}
