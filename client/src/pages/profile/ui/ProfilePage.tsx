import { ProfileCard, useUserStore } from "@entities/user";

export default function ProfilePage() {
  const { user } = useUserStore();
  if (!user) return null;
  return (
    <div>
      <ProfileCard user={user} />
    </div>
  );
}
