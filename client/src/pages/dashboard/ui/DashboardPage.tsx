import { api } from "@shared/config/api/api";
import { Text, Flex, Card, Select, Button, Icon } from "@shared/ui";
import { ProductChart } from "@widgets/ProductChart";
import { useEffect, useState } from "react";
import styles from "./dashboard-page.module.scss";
import { clsx } from "clsx";
import { useUserStore } from "@entities/user";
import { DateTime } from "luxon";
import {
  type Forecast,
  useDashboardStore,
} from "@shared/stores/dashboardStore";
import LoaderIcon from "@shared/assets/svg/loader.svg?react";
import { forecastMonths } from "@shared/assets/const/forecastMonths";
import { useHistoryStore } from "@shared/stores/historyStore";

export default function DashboardPage() {
  const { user } = useUserStore();
  const dashboardStore = useDashboardStore();
  const [loadingForecast, setLoadingForecast] = useState<boolean>(false);
  const { setForecastResults } = useHistoryStore();

  useEffect(() => {
    const getJson = async () => {
      const res = await api.get<
        {
          id: number;
          name: string;
          category: string;
        }[]
      >("/products");
      return res;
    };

    getJson().then((res) => {
      dashboardStore.setProducts(
        res.map((el) => ({
          value: el.id.toString(),
          label: el.name,
        })),
      );
      dashboardStore.setSelectedProduct({
        label: res[0].name,
        value: res[0].id.toString(),
      });
    });
  }, []);

  if (!user) return null;

  const createForecast = async () => {
    if (!dashboardStore.selectedProduct) return null;
    setForecastResults([]);
    const res = await api.post<Forecast>(
      "/forecast",
      {
        product_id: +dashboardStore.selectedProduct.value,
        period_months: +dashboardStore.forecastMonths.value,
      },
      {
        headers: {
          "Telegram-Init-Data": user.initData,
        },
      },
    );
    if (res) dashboardStore.setForecast(res);
  };

  const getForecast = () => {
    setLoadingForecast(true);
    dashboardStore.setForecast(null);
    setTimeout(async () => {
      createForecast().then(() => {
        setLoadingForecast(false);
      });
    }, 2000);
  };

  return (
    <Flex direction="column" gap={12}>
      <Card>
        <Flex direction={"column"} gap={8}>
          <Text size={12}>Выберите товар</Text>

          <Select
            defaultValue={dashboardStore.selectedProduct}
            options={dashboardStore.products}
            onChange={(value) => {
              if (!value) return;
              dashboardStore.setSelectedProduct(value);
            }}
            value={dashboardStore.selectedProduct}
          />
          <Text size={12}>Количество месяцев для прогноза</Text>
          <Select
            options={forecastMonths}
            onChange={(value) => {
              if (!value) return;
              dashboardStore.setForecastMonths(value);
            }}
            value={dashboardStore.forecastMonths}
          />
          <Button
            onClick={getForecast}
            className={clsx(styles["CreateForecastButton"])}
            disabled={
              loadingForecast ||
              !dashboardStore.selectedProduct ||
              !dashboardStore.forecastMonths
            }
          >
            <Text align="center" color="black">
              Получить прогноз
            </Text>
          </Button>
        </Flex>
      </Card>

      {dashboardStore.forecast && (
        <ProductChart
          product={dashboardStore.forecast.product_name}
          isLoading={loadingForecast}
          points={[
            ...dashboardStore.forecast.historical_data.map((el) => ({
              x: DateTime.fromFormat(el.date, "yyyy-MM-dd").toFormat("dd.MM"),
              y: el.value.toString(),
            })),
            ...dashboardStore.forecast.forecast_data.map((el) => ({
              x: DateTime.fromFormat(el.date, "yyyy-MM-dd").toFormat("dd.MM"),
              y: el.value.toString(),
            })),
          ]}
        />
      )}

      {!dashboardStore.forecast && (
        <Card className={styles["GraphLoader"]}>
          <Flex
            className={styles["GraphLoaderText"]}
            direction={"column"}
            justify={"center"}
            items={"center"}
          >
            {!loadingForecast ? (
              <Text color={"black"} align={"center"} size={20}>
                Чтобы получить прогноз по продукту, выберите продукт в
                выпадающем меню и нажмите кнопку "Получить прогноз"
              </Text>
            ) : (
              <Icon className={styles["GraphLoaderIcon"]} icon={LoaderIcon} />
            )}
          </Flex>
        </Card>
      )}
    </Flex>
  );
}
