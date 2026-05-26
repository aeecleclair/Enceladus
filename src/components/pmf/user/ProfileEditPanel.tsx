import { useMeUser } from "@/hooks/useMeUser";

export const ProfileEditPanel = () => {
  const { user } = useMeUser();
  return (
    <p>Profile</p>
  )
}
