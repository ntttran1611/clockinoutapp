import { useUser } from "../context/UserContext";

export default function ClockManager() {
  const { tempUser } = useUser();
  return tempUser && <div>ClocK | {tempUser.user.id}</div>;
}
