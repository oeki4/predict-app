import { Card, Flex, Select, Text } from "@shared/ui";
import { ProductChart } from "@widgets/ProductChart";

const productSelectOptions = [
  {
    value: "1",
    label: "🔩 Ресурсы",
  },
  {
    value: "2",
    label: "📦 Продукты",
  },
  {
    value: "3",
    label: "💡 Технологии",
  },
];

export default function MarketPage() {
  return (
    <Flex direction="column" gap={12}>
      <Card>
        <Flex direction={"column"} gap={8}>
          <Text size={12}>Выберите товар</Text>
          <Select
            defaultValue={productSelectOptions[0]}
            options={productSelectOptions}
          />
        </Flex>
      </Card>

      <ProductChart />
    </Flex>
  );
}
