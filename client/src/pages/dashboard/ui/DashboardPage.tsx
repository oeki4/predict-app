import {Text, Flex, Card, Select} from "@shared/ui";
import {ProductChart} from "@widgets/ProductChart";

const productSelectOptions = [
	{
		value: "1",
		label: "🥖 Хлеб",
	},
	{
		value: "2",
		label: "🥚 Яйца",
	},
	{
		value: "3",
		label: "🚰 Вода",
	},
];

export default function DashboardPage() {

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
