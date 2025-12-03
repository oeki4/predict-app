import { ProfileCard, useUserStore } from "@entities/user";
import { useHistoryStore } from "@shared/stores/historyStore";

export default function ProfilePage() {
  const { user } = useUserStore();
  const { forecastResults } = useHistoryStore();
  if (!user) return null;
  return (
    <div>
      <ProfileCard generatedForecasts={forecastResults.length} user={user} />
    </div>
  );
}
