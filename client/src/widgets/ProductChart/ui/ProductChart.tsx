import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import styles from "./product-chart.module.scss";
import { Badge, Card, Flex, Text } from "@shared/ui";

export default function ProductChart() {
  const data = [
    { time: "10:00", price: 10 },
    { time: "11:00", price: 11 },
    { time: "12:00", price: 12 },
    { time: "13:00", price: 11 },
    { time: "14:00", price: 13 },
    { time: "15:00", price: 12 },
  ];

  return (
    <Card className={styles["ProductChart"]}>
      <Flex direction="column" gap={12}>
        <Flex items={"center"} justify={"between"}>
          <Text>Динамика цен</Text>
          <Badge>
            <Text color="blue" size={10}>
              Руда
            </Text>
          </Badge>
        </Flex>

        <div className={styles["ProductChartChart"]}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: -40, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className={styles["ProductChartGrid"]}
              />
              <XAxis
                dataKey="time"
                fontFamily={"Montserrat, sans-serif"}
                tick={{ fontSize: 11 }}
                className={styles["ProductChartAxis"]}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                fontFamily={"Montserrat, sans-serif"}
                className={styles["ProductChartAxis"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Flex>
    </Card>
  );
}
