import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import ManagerLayout from "../components/admindashboard/ManagerLayout";
import ToolBarContainer from "../components/admindashboard/toptoolbar/ToolBarContainer";
import DateTimeInput from "../components/DateTimeInput";
import Select from "../components/Select";
import { AlertModal, Button, ErrorModal, FormModal } from "../components";
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

dayjs.extend(isoWeek);

export default function ClockManager() {
  const { tempUser } = useUser();
  const [staffOptions, setStaffOptions] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [searchStartDate, setStartDate] = useState("");
  const [searchEndDate, setEndDate] = useState("");
  const [selectedClock, setSelectedClock] = useState({});
  const [isVerifyingClock, setIsVerifyingClock] = useState(false);
  const [editedEndTime, setEditedEndTime] = useState("");
  const [timeValidationError, setTimeValidationError] = useState(false);
  const [enableCalculateWage, setEnableCalculateWage] = useState(false);
  const [showWageSummary, setShowWageSummary] = useState(false);

  // mutations
  const updateClockMutation = useUpdateClockMutation();

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

  useEffect(() => {
    if (tableClockList && tableClockList.length > 0) {
      setEnableCalculateWage(true);
    } else {
      setEnableCalculateWage(false);
    }
  }, [tableClockList]);

  const handleCalculateWage = () => {
    setShowWageSummary(true);
  };

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

  const handleExportClick = () => {
    if (tableClockList.length === 0) {
      document.querySelector("#errorModal").showModal();
      return;
    }

    const unVerifiedClocks = tableClockList.filter((clock) => {
      return (
        clock.clockoutMethod === "auto-generated" ||
        clock.clockoutMethod == +null
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
    setEditedEndTime(formatTime(clock.endTime));
    setIsVerifyingClock(false);
    document.querySelector("#CLOCK_REVIEW_MODAL").showModal();
  };

  const handleEditEndTime = () => {
    setEditedEndTime(formatTime(selectedClock.endTime));
    setIsVerifyingClock(true);
  };

  const handleCancelEdit = () => {
    setIsVerifyingClock(false);
    setEditedEndTime("");
  };

  const handleVerifyEndTime = () => {
    const shiftDate = dayjs(selectedClock.startTime).format("YYYY-MM-DD");
    const fullEndDateTime = dayjs(
      `${shiftDate} ${editedEndTime}`,
      "YYYY-MM-DD HH:mm",
    ).toISOString();

    // Validate that end time is not less than start time
    if (dayjs(fullEndDateTime).isBefore(dayjs(selectedClock.startTime))) {
      setTimeValidationError(true);
      document.querySelector("#timeValidationErrorModal").showModal();
      return;
    }

    setSelectedClock((prev) => ({
      ...prev,
      endTime: fullEndDateTime,
      clockoutMethod: "admin-verified",
    }));
    setIsVerifyingClock(false);
    setEditedEndTime("");
  };

  const handleQuickVerifyEndTime = () => {
    // Validate that current end time is not less than start time
    if (dayjs(selectedClock.endTime).isBefore(dayjs(selectedClock.startTime))) {
      setTimeValidationError(true);
      document.querySelector("#timeValidationErrorModal").showModal();
      return;
    }

    setSelectedClock((prev) => ({
      ...prev,
      clockoutMethod: "admin-verified",
    }));
  };

  const handleModalClose = () => {
    // Reset state when modal is closed without confirmation
    setIsVerifyingClock(false);
    setEditedEndTime("");
    setSelectedClock({});
  };

  const handleConfirmUpdate = async () => {
    try {
      const updatedClock = {
        ...selectedClock,
      };
      await updateClockMutation.mutateAsync(updatedClock);
      setIsVerifyingClock(false);
      setEditedEndTime("");
      setSelectedClock({});
    } catch (error) {
      console.error("Error updating clock:", error);
    }
  };

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
        id="timeValidationErrorModal"
        heading={"Invalid Time"}
        content={
          "End time cannot be earlier than start time. Please select a valid time."
        }
      />
      <FormModal
        id="CLOCK_REVIEW_MODAL"
        heading="Clock Review"
        color="sky-mist-100"
        action={handleConfirmUpdate}
        onClose={handleModalClose}
      >
        <section className="flex flex-col gap-2 py-3 text-text-primary">
          <hr className="text-mocha-30"></hr>
          <p>
            <b>Staff</b>: {getStaff()?.firstName} {getStaff()?.lastName}
          </p>
          <p>
            <b>Shift date:</b> {formatDate(selectedClock.startTime)}
          </p>
          <p>
            <b>Shift started at:</b> {formatTime(selectedClock.startTime)}
          </p>
          <p>
            <b>Shift closed at:</b>{" "}
            {!isVerifyingClock ? (
              <>
                <span className="font-medium text-mocha">
                  {formatTime(selectedClock.endTime)}
                </span>
                <button
                  onClick={handleEditEndTime}
                  className="ml-4 font-medium text-mocha hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleQuickVerifyEndTime}
                  className="ml-2 font-medium text-mocha hover:underline"
                >
                  Verify
                </button>
              </>
            ) : (
              <div className="flex gap-2 items-center mt-2">
                <TimeInput
                  id="endTime"
                  defaultValue={editedEndTime}
                  onChange={(e) => setEditedEndTime(e.target.value)}
                />
                <button
                  onClick={handleCancelEdit}
                  className="btn btn-sm bg-mocha-30 text-mocha font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyEndTime}
                  className="btn btn-sm bg-sky-mist-100 text-white font-medium"
                >
                  Verify
                </button>
              </div>
            )}
          </p>
        </section>
      </FormModal>
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
          {enableCalculateWage && (
            <button
              className="btn font-regular bg-sky-mist-50 text-white"
              onClick={handleCalculateWage}
            >
              Calculate Wage
            </button>
          )}
          <button
            onClick={handleExportClick}
            className="btn font-regular bg-mocha text-white"
          >
            Export Excel
          </button>
        </ToolBarContainer>
        {showWageSummary && (
          <section className="h-auto py-3 px-10 bg-sky-mist-50 rounded-lg shadow-xl text-text-primary">
            <p>
              <b>Wage Summary from 27/04/2026 to 03/05/2026</b>
            </p>
            <p>Total working hours: 40.5h</p>
            <p>Pay rate: $30.15/h</p>
            <p>Total payable amount (before tax): $1200</p>
          </section>
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
