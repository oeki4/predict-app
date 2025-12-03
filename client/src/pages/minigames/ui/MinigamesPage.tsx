import { Card, Flex, Text } from "@shared/ui";
import { useLoaderStore } from "@shared/stores";
import { useEffect } from "react";
import { api } from "@shared/config/api/api";
import {
  type ForecastResult,
  useHistoryStore,
} from "@shared/stores/historyStore";
import { useUserStore } from "@entities/user";
import { DateTime } from "luxon";

export default function MinigamesPage() {
  const { hideLoader, showLoader } = useLoaderStore();
  const { user } = useUserStore();
  const { setForecastResults, forecastResults } = useHistoryStore();

  useEffect(() => {
    const getJson = async () => {
      const res = await api.get<ForecastResult[]>("/forecast/my-history", {
        headers: {
          "Telegram-Init-Data": user?.initData,
        },
      });
      return res;
    };
    if (!forecastResults.length) {
      showLoader();

      setTimeout(() => {
        getJson().then((res) => {
          console.log(res);
          setForecastResults(res);
          hideLoader();
        });
      }, 1500);
    }
  }, []);

  if (!user) return null;
  return (
    <Flex direction="column" gap={8}>
      {forecastResults.map((forecastResult) => (
        <Card>
          <Flex direction="column" gap={16}>
            <Text size={18}>Номер прогноза: {forecastResult.id}</Text>
            <Flex direction="column" gap={8}>
              <Text size={12}>Продукт: {forecastResult.product_name}</Text>
              <Text size={12}>Количество месяцев: {forecastResult.period_months}</Text>
              <Text size={12}>Краткий прогноз: {forecastResult.summary}</Text>
            </Flex>
            <Flex justify={"end"}>
              <Text size={12}>
                Дата:{" "}
                {DateTime.fromISO(forecastResult.created_at, { zone: "utc" })
                  .setZone("Europe/Moscow")
                  .setLocale("ru")
                  .toFormat("dd.MM.yyyy HH:mm")}
              </Text>
            </Flex>
         
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}
