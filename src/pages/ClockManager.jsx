import ManagerLayout from "../components/admindashboard/ManagerLayout";
import ToolBarContainer from "../components/admindashboard/toptoolbar/ToolBarContainer";
import DateTimeInput from "../components/DateTimeInput";
import { useUser } from "../context/UserContext";

export default function ClockManager() {
  const { tempUser } = useUser();
  return (
    <ManagerLayout tabTitle="Clocks">
      <ToolBarContainer>
        <DateTimeInput label="From" id="startDate" />
        <DateTimeInput label="To" id="endDate" />
      </ToolBarContainer>
    </ManagerLayout>
  );
}
