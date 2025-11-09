import {
  Badge,
  ButtonBack,
  Card,
  ContainedIcon,
  Flex,
  type GradientColor,
  Text,
} from "@shared/ui";
import styles from "./create-company-page.module.scss";
import { useNavigate } from "react-router";
import PickAxeIcon from "@shared/assets/svg/pickaxe.svg?react";
import FactoryIcon from "@shared/assets/svg/factory.svg?react";
import CPUIcon from "@shared/assets/svg/cpu.svg?react";
import type { FC, SVGProps } from "react";
import { paths } from "@shared/config/routes/paths";
import { useUserStore } from "@entities/user";

const companyTypes: {
  icon: FC<SVGProps<SVGSVGElement>>;
  description: string;
  iconColor: GradientColor;
  badge: string;
  title: string;
}[] = [
  {
    title: "Добывающая",
    description: "Добывайте ресурсы и продавайте их",
    icon: PickAxeIcon,
    iconColor: "blue",
    badge: "Ресурсы",
  },
  {
    title: "Производственная",
    description: "Переработка ресурсов в готовую продукцию",
    icon: FactoryIcon,
    iconColor: "orange",
    badge: "Продукция",
  },
  {
    title: "Технологическая",
    description: "Инновации и высокие технологии",
    icon: CPUIcon,
    iconColor: "pink",
    badge: "Программное обеспечение",
  },
];

export function CreateCompanyPage() {
  const navigate = useNavigate();
  const { setCompany } = useUserStore();

  const onSelectCompanyType = () => {
    setCompany(true);
    navigate(paths["dashboard"]);
  };

  return (
    <Flex direction={"column"} className={styles["CreateCompanyPage"]}>
      <Flex
        className={styles["CreateCompanyPageInner"]}
        gap={12}
        items={"center"}
        direction={"column"}
        justify={"center"}
      >
        <Flex>
          <ButtonBack onClick={() => navigate(-1)} />
        </Flex>
        <Text size={16} color="black">
          Выберите тип компании
        </Text>
        <Text as={"span"} size={12} color="black">
          Каждый тип компании имеет уникальные возможности
        </Text>
        <Flex direction={"column"} gap={12}>
          {companyTypes.map(
            ({ icon, badge, description, title, iconColor }) => (
              <Card
                className={styles["JoinGamePageButton"]}
                isButton
                borderButtonColor="blue"
                onClick={onSelectCompanyType}
              >
                <Flex justify={"start"} items={"center"} gap={16}>
                  <ContainedIcon gradientColor={iconColor} icon={icon} />
                  <Flex direction="column" items="start" gap={4}>
                    <Text size={16}>{title}</Text>
                    <Text weight={500} color="gray" size={12}>
                      {description}
                    </Text>
                    <Flex gap={4} items={"center"}>
                      <Text size={10}>Производит:</Text>
                      <Badge variant="blue" radius="4">
                        <Text color="blue" size={10}>
                          {badge}
                        </Text>
                      </Badge>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            ),
          )}
        </Flex>
        <Text align={"center"} size={10} color="black">
          Все компании взаимосвязаны через общий рынок. Выбирайте стратегию и
          развивайте свой бизнес!
        </Text>
      </Flex>
    </Flex>
  );
}
