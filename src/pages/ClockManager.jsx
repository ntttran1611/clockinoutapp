import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  ClockReviewModal,
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
  ClockHistoryTable,
  LoadingModal,
} from "../components";
import { Select } from "../components/Select";
import { useAuth } from "../context";
import {
  useStaffList,
  useTableClockData,
  useUpdateClockMutation,
} from "../hooks";
import {
  startOfWeek,
  endOfWeek,
  formatDate,
  getHourDiff,
  exportTableToExcel,
  returnPayrollSummary,
  getFormattedTableClockData,
  getFormattedPayrollData,
} from "../lib";
import { BiExport } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";

dayjs.extend(isoWeek);

/**
 * TODO:
 * 1/ Review the functions used in this component
 * 2/ Restructure the directory if needed
 * 3/ Optimise the functions if needed
 * 4/ Review this component again before moving on the next component
 */

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
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  //Modal states
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

  const payrollSummaryModalRef = useRef(null);
  const alertActionModalRef = useRef(null);
  const messageModalRef = useRef(null);
  const individualPayrollModalRef = useRef(null);
  const clockReviewModalRef = useRef(null);
  const loadingModalRef = useRef(null);

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

  //The below functions takes clocks within the chosen date ranges
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

  //Side Effects
  useEffect(() => {
    // Only set to first staff if no initial staff ID was provided
    if (!initialStaffId) {
      setSelectedStaffId(staffList?.[0]?.id || "");
    }
  }, [staffList, initialStaffId]);

  //Fetching payroll summary is an async function,
  //so we need to useEffect to trigger the payroll summary modal
  //after the payroll summary state is set
  useEffect(() => {
    if (payrollSummary) {
      payrollSummaryModalRef.current?.showModal();
    }
  }, [payrollSummary]);

  useEffect(() => {
    if (isRequestLoading) {
      loadingModalRef.current?.showModal();
    } else {
      loadingModalRef.current?.close();
    }
  }, [isRequestLoading]);

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    id === "startDate"
      ? setDateRange({ ...dateRange, start: value })
      : setDateRange({ ...dateRange, end: value });
  };

  //Inform user if there are unverified clocks before exporting and ask for confirmation
  //The button that triggers this function is only visible when there is clock data within the chosen date range
  //so no need to check if there is clock data exists or not in this function
  const handleExportClick = () => {
    if (hasUnverifiedClocks) {
      setActionModalContent({
        action: exportClocksExcel,
        heading: "Attention before action",
        message:
          "There are shifts that have not been closed or verified. Would you like to continue?",
      });
      alertActionModalRef.current?.showModal();
    } else {
      exportClocksExcel();
    }
  };

  //The actual function to export clocks data within the chosen date range to excel file
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
    setIsRequestLoading(true);
    try {
      await updateClockMutation.mutateAsync(updatedClock);
    } catch (error) {
      console.error("Error updating clock:", error);
    } finally {
      setIsRequestLoading(false);
    }
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
      messageModalRef.current?.showModal();
      return;
    }
    setPayrollSummary(payrollResult);
  };

  //The button that triggers this function is only visible when the payroll summary data is ready and there is no unverified clock
  //So no need to check those conditions in this function
  const exportPayrollToExcel = () => {
    exportTableToExcel(
      getFormattedPayrollData(payrollSummary),
      "Payroll",
      `Payroll_from_${dateRange.start}_to_${dateRange.end}`,
    );
  };

  const showIndividualPayrollModal = () => {
    if (hasUnverifiedClocks) {
      setMsgModalContent({
        heading: "Unverified Shifts",
        message:
          "Please verify all shifts before viewing individual payroll details.",
        status: "error",
      });
      messageModalRef.current?.showModal();
      return;
    }
    individualPayrollModalRef.current?.showModal();
  };

  return !staffListIsFetching && user && role && !loading ? (
    <>
      <PayrollSummaryModal
        ref={payrollSummaryModalRef}
        dateRange={dateRange}
        onSubmit={exportPayrollToExcel}
        list={payrollSummary}
      />
      <IndividualPayrollModal
        ref={individualPayrollModalRef}
        staff={selectedStaff}
        wageSnapshot={{
          startDate: dateRange.start,
          endDate: dateRange.end,
          totalWorkingHours: totalWorkingHours,
        }}
      />
      <ClockReviewModal
        ref={clockReviewModalRef}
        staff={selectedStaff}
        clock={selectedClock}
        onConfirm={handleConfirmUpdate}
      />
      <AlertBeforeActionModal
        ref={alertActionModalRef}
        content={actionModalContent}
      />
      <MessageModal ref={messageModalRef} content={msgModalContent} />
      <LoadingModal ref={loadingModalRef} />
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
                clockReviewModalRef.current?.showModal();
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
