import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import ManagerLayout from "../components/admindashboard/ManagerLayout";
import ToolBarContainer from "../components/admindashboard/toptoolbar/ToolBarContainer";
import DateTimeInput from "../components/DateTimeInput";
import Select from "../components/Select";
import {
  AlertModal,
  Button,
  ClockReviewModal,
  ErrorModal,
  FormModal,
} from "../components";
import { ClockHistoryTable } from "../components/staffdashboard";
import { useUser } from "../context/UserContext";
import { getStaffList } from "../data/Staff";
import { useStaffData, useTableClockData } from "../hooks";
import { useUpdateClockMutation } from "../hooks/useClockActions";
import {
  startOfWeek,
  endOfWeek,
  convertToDateObject,
  formatDate,
  formatTime,
} from "../lib/date";
import { exportClockTableToExcel } from "../lib/exportToExcel";
import LoadingSpinner from "../components/LoadingSpinner";
import TimeInput from "../components/TimeInput";
import { formatDecimal, getHourDiff } from "../lib";
import { WageSummaryDisplay } from "../components";

dayjs.extend(isoWeek);

export default function ClockManager() {
  const { tempUser } = useUser();
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(dayjs()).format("YYYY-MM-DD"),
    end: endOfWeek(dayjs()).format("YYYY-MM-DD"),
  });

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedClock, setSelectedClock] = useState({});
  const [enableFunctions, setEnableFunctions] = useState(false);
  const [showWageSummary, setShowWageSummary] = useState(false);
  const [enableReviewClock, setEnableReviewClock] = useState(false);

  // data queries
  const { tableClockList, isFetching, refetchTableClockList } =
    useTableClockData(selectedStaffId, dateRange.start, dateRange.end);
  const { staffList, staffListIsFetching } = useStaffData();

  useEffect(() => {
    if (tableClockList && tableClockList.length > 0) {
      setEnableFunctions(true);
    } else {
      setEnableFunctions(false);
    }
  }, [tableClockList]);

  useEffect(() => {
    const clockReviewModal = document.querySelector("#CLOCK_REVIEW_MODAL");
    if (!clockReviewModal) return;
    clockReviewModal.showModal();
  }, [enableReviewClock]);

  const handleCalculateWage = () => {
    const unVerifiedClocks = tableClockList.filter((clock) => {
      return (
        clock.clockoutMethod === "auto-generated" ||
        clock.clockoutMethod === null
      );
    });

    if (unVerifiedClocks.length > 0) {
      document.querySelector("#CALCULATE_WAGE_ERROR").showModal();
    } else {
      setShowWageSummary(true);
    }
  };

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setDateRange({ ...dateRange, start: value });
    } else if (id === "endDate") {
      setDateRange({ ...dateRange, end: value });
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

  const handleExportClick = () => {
    const unVerifiedClocks = tableClockList.filter((clock) => {
      return (
        clock.clockoutMethod === "auto-generated" ||
        clock.clockoutMethod === null
      );
    });

    if (unVerifiedClocks.length > 0) {
      document.querySelector("#alertModal").showModal();
    } else {
      exportExcel();
    }
  };

  function getStaff() {
    return staffList.find((staff) => staff.id == selectedStaffId);
  }

  const exportExcel = () => {
    const selectedStaff = getStaff();
    const staffName = selectedStaff
      ? `${selectedStaff.firstName}_${selectedStaff.lastName}`
      : "Unknown";

    exportClockTableToExcel(tableClockList, staffName, startDate, endDate);
  };

  const handleUnclosedShiftRowClicked = (clock) => {
    setSelectedClock(clock);
    setEnableReviewClock(true);
  };

  function totalWorkingHours() {
    let totalWorkingHours = 0;
    if (tableClockList) {
      tableClockList.map(
        (clock) =>
          (totalWorkingHours += getHourDiff(clock.startTime, clock.endTime)),
      );
    }
    return totalWorkingHours;
  }

  return !staffListIsFetching ? (
    <>
      <AlertModal
        id="alertModal"
        action={exportExcel}
        heading={"Attention before action"}
        color="mocha"
        content="There are shifts that have not been closed or verified. Would you to like to continue?"
      />
      <ErrorModal
        id="errorModal"
        heading={"Empty list"}
        content={"No data to export. Please fetch data first."}
      />
      <ErrorModal
        id="CALCULATE_WAGE_ERROR"
        heading={"Unverified shifts"}
        content={
          "There are shifts that have not been closed or verified. Please review them first."
        }
      />

      {enableReviewClock && (
        <ClockReviewModal
          staff={getStaff()}
          clock={selectedClock}
          setClock={setSelectedClock}
          setEnableReviewClock={setEnableReviewClock}
        />
      )}

      <ManagerLayout tabTitle="Clocks">
        <ToolBarContainer>
          <DateTimeInput
            label="From"
            id="startDate"
            defaultValue={dateRange.start}
            onChange={handleDateChange}
          />
          <DateTimeInput
            label="To"
            id="endDate"
            defaultValue={dateRange.end}
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
          {enableFunctions && (
            <>
              <button
                className="btn font-regular bg-sky-mist-50 text-white"
                onClick={handleCalculateWage}
              >
                Calculate Wage
              </button>
              <button
                onClick={handleExportClick}
                className="btn font-regular bg-mocha text-white"
              >
                Export Excel
              </button>
            </>
          )}
        </ToolBarContainer>
        {showWageSummary && (
          <WageSummaryDisplay
            dateRange={dateRange}
            totalWorkingHours={totalWorkingHours()}
            selectedStaff={getStaff()}
          />
        )}
        <section className="grow shadow-xl rounded-xl p-7 border border-mocha-30">
          <ClockHistoryTable
            isAdminControlled={true}
            tableClockList={tableClockList}
            isFetching={isFetching}
            onClick={handleUnclosedShiftRowClicked}
          />
        </section>
      </ManagerLayout>
    </>
  ) : (
    <LoadingSpinner isFullScreen={true} />
  );
}
