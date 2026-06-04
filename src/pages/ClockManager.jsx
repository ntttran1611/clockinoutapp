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
  DateTimeInput,
  ManagerLayout,
  ToolBarContainer,
  NewVersionButton,
  LoadingSpinner,
  TableContainer,
  PayrollSummaryModal,
  IndividualPayrollModal,
  MessageModal,
  AlertBeforeActionModal,
} from "../components";
import { ClockHistoryTable } from "../components/staffdashboard";
import { useAuth } from "../context";
import { getStaffList } from "../api";
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
  exportTableToExcel,
  returnPayrollSummary,
  getFormattedTableClockData,
  getFormattedPayrollData,
} from "../lib";
import { Select } from "../components/Select.jsx";
import { BiExport } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";

dayjs.extend(isoWeek);

export default function ClockManager() {
  const { user, role, loading } = useAuth();

  //Get staff ID from URL params if exists (used for redirecting from the staff manager
  //when clicking on View button to review their clock history)
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
  const [msgModalContent, setMsgModalContent] = useState({
    status: "",
    heading: "",
    message: "",
  });
  const [actionModalContent, setActionModalContent] = useState({
    action: null,
    heading: "",
    message: "",
  });

  // data queries
  const { tableClockList, isFetching, refetchTableClockList } =
    useTableClockData(selectedStaffId, dateRange.start, dateRange.end);
  const { staffList, staffListIsFetching } = useStaffList();

  //clock mutation
  const updateClockMutation = useUpdateClockMutation();

  //Derived states
  //check if there is clock data of a staff exists
  const hasData = tableClockList.length > 0;
  const canCalculate = hasData && !isFetching;
  const selectedStaff = useMemo(
    () => staffList?.find((staff) => staff.id == selectedStaffId) || {},
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

  //Effects
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
      setActionModalContent({
        action: exportClocksExcel,
        heading: "Attention before action",
        message:
          "There are shifts that have not been closed or verified. Would you like to continue?",
      });
      document.querySelector("#ALERT_BEFORE_ACTION_MODAL").showModal();
    } else {
      exportClocksExcel();
    }
  };

  const exportClocksExcel = () => {
    const staffName = selectedStaff
      ? `${selectedStaff.firstName}_${selectedStaff.lastName}`
      : "Unknown";

    exportTableToExcel(
      getFormattedTableClockData(tableClockList),
      "Clock History",
      `${staffName}_Clock_History_from_${dateRange.start}_to_${dateRange.end}`,
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

    const violatedResults = payrollResult.filter(
      (result) => result.isDataViolated,
    );

    if (violatedResults.length > 0) {
      let message = "Clocks of ";
      violatedResults.forEach((result, index, array) => {
        message +=
          index === array.length - 1 ? `${result.name} ` : `${result.name}, `;
      });
      message += " are unfinished or unverified. Please review them first.";
      setMsgModalContent({
        heading: "Unverified Shifts",
        message: message,
        status: "error",
      });
      const msgModal = document.querySelector("#MESSAGE_MODAL");
      if (msgModal) {
        msgModal.showModal();
      }
      return;
    }
    setPayrollSummary(payrollResult);
  };

  const exportPayrollToExcel = () => {
    if (!payrollSummary) return;

    exportTableToExcel(
      getFormattedPayrollData(payrollSummary),
      "Payroll",
      `Payroll_from_${dateRange.start}_to_${dateRange.end}`,
    );
  };

  const showIndividualPayrollModal = () => {
    if (!selectedStaff || hasUnverifiedClocks) return;
    document.querySelector("#INDIVIDUAL_PAYROLL_MODAL").showModal();
  };

  return !staffListIsFetching && user && role && !loading ? (
    <>
      <PayrollSummaryModal
        dateRange={dateRange}
        onSubmit={exportPayrollToExcel}
        list={payrollSummary}
      />
      <IndividualPayrollModal
        staff={selectedStaff}
        wageSnapshot={{
          startDate: dateRange.start,
          endDate: dateRange.end,
          totalWorkingHours: totalWorkingHours,
        }}
      />
      <ClockReviewModal
        staff={selectedStaff}
        clock={selectedClock}
        onConfirm={handleConfirmUpdate}
      />
      <AlertBeforeActionModal content={actionModalContent} />
      <MessageModal content={msgModalContent} />
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
        <TableContainer>
          <div className="flex justify-between items-center">
            <div className="flex-1 flex flex-col gap-1">
              <p className="ml-4 text-xs text-mocha-50">
                Date range: {formatDate(dateRange.start)} -
                {formatDate(dateRange.end)}
              </p>
              <p className="ml-4 text-xs text-mocha-50">
                Current staff:{" "}
                {selectedStaff &&
                  `${selectedStaff.firstName} ${selectedStaff.lastName}`}
              </p>
            </div>
            {canCalculate && (
              <div className="flex gap-2 items-center">
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
                <div className="tooltip" data-tip="Payroll Summary">
                  <NewVersionButton
                    intent="icon"
                    size="icon"
                    className="bg-sky-mist-100 hover:bg-sky-mist-80"
                    onClick={showIndividualPayrollModal}
                  >
                    <CgFileDocument />
                  </NewVersionButton>
                </div>
              </div>
            )}
          </div>
          <div className="relative flex-1">
            <ClockHistoryTable
              isAdminControlled={true}
              tableClockList={tableClockList}
              isFetching={isFetching}
              onAutoGeneratedRowClick={(clock) => {
                setSelectedClock(clock);
                document.querySelector("#CLOCK_REVIEW_MODAL").showModal();
              }}
            />
          </div>
        </TableContainer>
      </ManagerLayout>
    </>
  ) : (
    <LoadingSpinner isFullScreen={true} />
  );
}
