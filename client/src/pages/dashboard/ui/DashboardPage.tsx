import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLoaderStore } from "@shared/stores";
import { Text, Button } from "@shared/ui";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { showLoader, hideLoader, isLoading } = useLoaderStore();
  useEffect(() => {
    console.log(window.Telegram.WebApp.initDataUnsafe);
  }, []);

  return (
    <div>
      <Text>{t("testMessage")}</Text>
      <Text> {window.Telegram.WebApp.initDataUnsafe.user?.first_name}</Text>

      <Button />

      {isLoading ? <Text>Loading...</Text> : <Text>Loaded</Text>}

      <button onClick={() => (isLoading ? hideLoader() : showLoader())}>
        <Text color="white">Toggle is loading</Text>
      </button>
    </div>
  );
}
