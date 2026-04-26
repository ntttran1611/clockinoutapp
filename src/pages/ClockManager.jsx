import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import ManagerLayout from "../components/admindashboard/ManagerLayout";
import ToolBarContainer from "../components/admindashboard/toptoolbar/ToolBarContainer";
import DateTimeInput from "../components/DateTimeInput";
import Select from "../components/Select";
import { Button } from "../components";
import { ClockHistoryTable } from "../components/staffdashboard";
import { useUser } from "../context/UserContext";
import { getStaffList } from "../data/Staff";
import { useStaffData, useTableClockData } from "../hooks";
import { startOfWeek, endOfWeek, convertToDateObject } from "../lib/date";
import LoadingSpinner from "../components/LoadingSpinner";

dayjs.extend(isoWeek);

export default function ClockManager() {
  const { tempUser } = useUser();
  const [staffOptions, setStaffOptions] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [searchStartDate, setStartDate] = useState("");
  const [searchEndDate, setEndDate] = useState("");

  // data queries
  const { tableClockList, isFetching, refetchTableClockList } =
    useTableClockData(selectedStaffId, searchStartDate, searchEndDate);
  const { staffList, staffListIsFetching } = useStaffData();

  useEffect(() => {
    // Set default week dates
    const today = dayjs();
    const startDateStr = startOfWeek(today).format("YYYY-MM-DD");
    const endDateStr = endOfWeek(today).format("YYYY-MM-DD");
    setWeekStart(startDateStr);
    setWeekEnd(endDateStr);
    setStartDate(startDateStr);
    setEndDate(endDateStr);
  }, []);

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value);
    } else if (id === "endDate") {
      setEndDate(value);
    }
  };

  const handleStaffChange = (e) => {
    setSelectedStaffId(e.target.value);
  };

  const handleViewClick = () => {
    if (!selectedStaffId || !startDate || !endDate) return;
    // Trigger the refetch
    refetchTableClockList();
  };

  return !staffListIsFetching ? (
    <ManagerLayout tabTitle="Clocks">
      <ToolBarContainer>
        <DateTimeInput
          label="From"
          id="startDate"
          defaultValue={weekStart}
          onChange={handleDateChange}
        />
        <DateTimeInput
          label="To"
          id="endDate"
          defaultValue={weekEnd}
          onChange={handleDateChange}
        />
        <Select
          list={staffList}
          selectLabel="Staff Member"
          onChange={handleStaffChange}
        />
        <button
          onClick={handleViewClick}
          className="btn font-regular bg-sky-mist-100 text-white"
        >
          View
        </button>
        <button className="btn font-regular bg-mocha text-white">
          Export PDF
        </button>
      </ToolBarContainer>
      <section className="grow shadow-xl rounded-xl px-7 border border-mocha-30">
        <ClockHistoryTable
          tableClockList={tableClockList}
          isFetching={isFetching}
        />
      </section>
    </ManagerLayout>
  ) : (
    <LoadingSpinner isFullScreen={true} />
  );
}
