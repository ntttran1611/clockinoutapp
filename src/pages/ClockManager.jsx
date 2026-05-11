import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  AlertModal,
  Button,
  ClockReviewModal,
  ErrorModal,
  FormModal,
  TimeInput,
  WageSummaryDisplay,
  DateTimeInput,
  ManagerLayout,
  ToolBarContainer,
  NewVersionButton,
  LoadingSpinner,
  TableContainer,
  PayrollSummaryModal,
} from "../components";
import { ClockHistoryTable } from "../components/staffdashboard";
import { useUser } from "../context/UserContext";
import { getStaffList } from "../data/Staff";
import {
  useStaffList,
  useTableClockData,
  useUpdateClockMutation,
} from "../hooks";
import {
  startOfWeek,
  endOfWeek,
  formatDate,
  formatTime,
  formatDecimal,
  getHourDiff,
  exportClockTableToExcel,
  returnPayrollSummary,
} from "../lib";
import { Select } from "../components/Select.jsx";
import { BiExport } from "react-icons/bi";

dayjs.extend(isoWeek);

export default function ClockManager() {
  const { tempUser } = useUser();
  const [searchParams] = useSearchParams();
  const initialStaffId = searchParams.get("staffId");

  const [dateRange, setDateRange] = useState({
    start: startOfWeek(dayjs()).format("YYYY-MM-DD"),
    end: endOfWeek(dayjs()).format("YYYY-MM-DD"),
  });

  const [selectedStaffId, setSelectedStaffId] = useState(initialStaffId || "");
  const [selectedClock, setSelectedClock] = useState({});
  const [enableReviewClock, setEnableReviewClock] = useState(false);
  const [payrollSummary, setPayrollSummary] = useState(null);

  // data queries
  const { tableClockList, isFetching, refetchTableClockList } =
    useTableClockData(selectedStaffId, dateRange.start, dateRange.end);
  const { staffList, staffListIsFetching } = useStaffList();

  //clock mutation
  const updateClockMutation = useUpdateClockMutation();

  //Derived state
  const hasData = tableClockList.length > 0;
  const canCalculate = hasData && !isFetching;
  const selectedStaff = useMemo(
    () => staffList?.find((staff) => staff.id == selectedStaffId) || null,
    [selectedStaffId, staffList],
  );
  const hasUnverifiedClocks = useMemo(() => {
    return tableClockList?.some(
      (clock) =>
        clock.clockoutMethod === "auto-generated" ||
        clock.clockoutMethod === null,
    );
  }, [tableClockList]);
  const totalWorkingHours = useMemo(() => {
    const initialValue = 0;
    return tableClockList?.reduce(
      (total, clock) => total + getHourDiff(clock.startTime, clock.endTime),
      initialValue,
    );
  }, [tableClockList]);

  useEffect(() => {
    const clockReviewModal = document.querySelector("#CLOCK_REVIEW_MODAL");
    if (!clockReviewModal) return;
    clockReviewModal.showModal();
  }, [enableReviewClock]);

  useEffect(() => {
    // Only set to first staff if no initial staff ID was provided
    if (!initialStaffId) {
      setSelectedStaffId(staffList?.[0]?.id || "");
    }
  }, [staffList, initialStaffId]);

  useEffect(() => {
    if (payrollSummary) {
      //console.log(payrollSummary);
      document.querySelector("#PAYROLL_SUMMARY_MODAL").showModal();
    }
  }, [payrollSummary]);

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    id === "startDate"
      ? setDateRange({ ...dateRange, start: value })
      : setDateRange({ ...dateRange, end: value });
  };

  const handleExportClick = () => {
    if (hasUnverifiedClocks) {
      document.querySelector("#alertModal").showModal();
    } else {
      exportExcel();
    }
  };

  const exportExcel = () => {
    const staffName = selectedStaff
      ? `${selectedStaff.firstName}_${selectedStaff.lastName}`
      : "Unknown";

    exportClockTableToExcel(
      tableClockList,
      staffName,
      dateRange.start,
      dateRange.end,
    );
  };

  const handleConfirmUpdate = async (updatedClock) => {
    try {
      await updateClockMutation.mutateAsync(updatedClock);
    } catch (error) {
      console.error("Error updating clock:", error);
    }
    setEnableReviewClock(false);
  };

  const handleReportPayroll = async () => {
    const payrollResult = await returnPayrollSummary(staffList, dateRange);

    if (!payrollResult || payrollResult.length === 0) {
      alert("No payroll data available or violated date");
      return;
    }
    setPayrollSummary(payrollResult);
  };

  return !staffListIsFetching ? (
    <>
      <PayrollSummaryModal
        dateRange={dateRange}
        onSubmit={() => alert("exported to excel")}
        list={payrollSummary}
      />
      <AlertModal
        id="alertModal"
        action={exportExcel}
        heading={"Attention before action"}
        color="mocha"
        content="There are shifts that have not been closed or verified. Would you to like to continue?"
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
          staff={selectedStaff}
          clock={selectedClock}
          onClose={() => {
            setEnableReviewClock(false);
          }}
          onConfirm={handleConfirmUpdate}
        />
      )}

      <ManagerLayout tabTitle="Clock Manager">
        <ToolBarContainer>
          <div className="flex gap-4 flex-1">
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
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
            />
          </div>
          <NewVersionButton onClick={handleReportPayroll}>
            Payroll Report for All Staff
          </NewVersionButton>
        </ToolBarContainer>
        {canCalculate && (
          <WageSummaryDisplay
            wageSnapshot={{
              startDate: dateRange.start,
              endDate: dateRange.end,
              totalWorkingHours: totalWorkingHours,
            }}
            selectedStaff={selectedStaff}
            hasUnverifiedClocks={hasUnverifiedClocks}
          />
        )}
        <TableContainer>
          <div className="flex justify-between items-center">
            <div className="flex-1 flex flex-col gap-1">
              <p className="ml-4 text-xs text-mocha-50">
                Date range: {formatDate(dateRange.start)} -
                {formatDate(dateRange.end)}
              </p>
              <p className="ml-4 text-xs text-mocha-50">
                Staff:{" "}
                {selectedStaff &&
                  `${selectedStaff.firstName} ${selectedStaff.lastName}`}
              </p>
            </div>
            {canCalculate && (
              <div className="tooltip" data-tip="Export an Excel file">
                <NewVersionButton
                  intent="icon"
                  size="icon"
                  className="bg-sky-mist-100 hover:bg-sky-mist-80"
                  onClick={handleExportClick}
                >
                  <BiExport />
                </NewVersionButton>
              </div>
            )}
          </div>

          <ClockHistoryTable
            isAdminControlled={true}
            tableClockList={tableClockList}
            isFetching={isFetching}
            onClick={(clock) => {
              setSelectedClock(clock);
              setEnableReviewClock(true);
            }}
          />
        </TableContainer>
      </ManagerLayout>
    </>
  ) : (
    <LoadingSpinner isFullScreen={true} />
  );
}
