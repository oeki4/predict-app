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
import { AnimatePresence, motion } from "framer-motion";

type Point = {
  x: string;
  y: string;
};

interface IProps {
  points: Point[];
  product: string;
  isLoading: boolean;
}

export default function ProductChart(props: IProps) {
  const { points, product, isLoading } = props;
  return (
    <Card className={styles["ProductChart"]}>
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <Flex direction="column" gap={12}>
              <Flex items={"start"} gap={12} justify={"between"}>
                <Text>Количество продаж в кг. по всем городам
                </Text>
                <Badge>
                  <Text color="blue" size={10}>
                    {product}
                  </Text>
                </Badge>
              </Flex>

              <div className={styles["ProductChartChart"]}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={points}
                    margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className={styles["ProductChartGrid"]}
                    />
                    <XAxis
                      dataKey="x"
                      fontFamily={"Montserrat, sans-serif"}
                      tick={{ fontSize: 11 }}
                      interval={0}
                      className={styles["ProductChartAxis"]}
                    />
                    <YAxis
                      width={70}
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
                      dataKey="y"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
