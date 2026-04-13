import { useEffect, useState } from "react";
import { Button, SideBar, NavBar, TimeHolder, AlertModal } from "../components";
import {
  ClockWarningBanner,
  ClockHistoryTable,
  DateRangeFilter,
} from "../components/staffdashboard";

import { startOfWeek, endOfWeek, convertToDateObject } from "../lib";

import {
  useStaffInitialization,
  useTableClockData,
  useTodayClockData,
  useAutoClockOutMutation,
  useStaffUpdateClockStatusMutation,
  useAddClockMutation,
  useUpdateClockMutation,
  useUpdateStaffMutation,
} from "../hooks";
import { MODAL_IDS, ALERT_CONFIG } from "../lib/dashboardConstants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Header from "../components/dashboard/Header";
import LoadingSpinner from "../components/LoadingSpinner";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function Dashboard() {
  const defaultStartOfWeek = convertToDateObject(startOfWeek(dayjs()));
  const defaultEndOfWeek = convertToDateObject(endOfWeek(dayjs()));
  const [searchStartDate, setStartDate] = useState(defaultStartOfWeek);
  const [searchEndDate, setEndDate] = useState(defaultEndOfWeek);
  //Staff
  const { tempStaff, refetchStaff, isStaffLoading } = useStaffInitialization();
  const updateStaffMutation = useUpdateStaffMutation();
  const updateStaffClockStatusMutation = useStaffUpdateClockStatusMutation();

  //Clock Data
  const { tableClockList, isLoading, refetchTableClockList } =
    useTableClockData(tempStaff?.id, searchStartDate, searchEndDate);
  const { todayClockList, refetchTodayClockList } = useTodayClockData(
    tempStaff?.id,
  );

  //Clock Actions
  const autoClockOutMutation = useAutoClockOutMutation();
  const addNewClockMutation = useAddClockMutation();
  const updateCurrentClockMutation = useUpdateClockMutation();

  useEffect(() => {
    async function checkAutoClockOut() {
      if (!tempStaff) return;
      try {
        const data = await autoClockOutMutation.mutateAsync(tempStaff);
        //console.log("Auto clock-out check completed: ", data);
        if (
          data?.updated > 0 &&
          tempStaff.isClockIn &&
          tempStaff.currentClockId
        ) {
          await updateStaffClockStatusMutation.mutateAsync({
            staffID: tempStaff.id,
            isClockIn: false,
            currentClockId: null,
          });
        }
      } catch (error) {
        console.error("Error checking auto clock out: ", error);
      }
    }
    checkAutoClockOut();
  }, [tempStaff]);

  const handleClockBtnClicked = () => {
    if (!tempStaff.isClockIn) {
      document.getElementById(MODAL_IDS.CLOCK_IN_ALERT).showModal();
    } else {
      document.getElementById(MODAL_IDS.CLOCK_OUT_ALERT).showModal();
    }
  };

  const handleViewBtnClicked = () => {
    refetchTableClockList();
  };

  const handleClockIn = async () => {
    if (!tempStaff) return;
    const newTimeRecord = {
      startTime: dayjs().toISOString(),
      endTime: null,
      staffId: tempStaff.id,
      branch: localStorage.getItem("branch"),
    };

    try {
      const newAddedClock =
        await addNewClockMutation.mutateAsync(newTimeRecord);

      if (newAddedClock && newAddedClock.length > 0) {
        const updatedStaff = {
          ...tempStaff,
          isClockIn: true,
          currentClockId: newAddedClock[0].id,
        };
        await updateStaffMutation.mutateAsync(updatedStaff);
      }
    } catch (error) {
      console.error("Error during clock in process: ", error);
    }
  };

  const handleClockOut = async () => {
    if (!tempStaff) return;
    if (tempStaff.currentClockId) {
      const data = todayClockList.find(
        (clock) => clock.id === tempStaff.currentClockId,
      );
      const updatedClock = { ...data, endTime: dayjs().toISOString() };
      try {
        await updateCurrentClockMutation.mutateAsync(updatedClock);

        const updatedStaff = {
          ...tempStaff,
          isClockIn: false,
          currentClockId: null,
        };

        await updateStaffMutation.mutateAsync(updatedStaff);
      } catch (error) {
        console.error("Error during clock out process: ", error);
      }
    }
  };

  return !isStaffLoading ? (
    <>
      <AlertModal
        id={MODAL_IDS.CLOCK_IN_ALERT}
        heading={ALERT_CONFIG.CLOCK_IN.heading}
        content={`Hi ${tempStaff.firstName}, are you sure to clock in?`}
        color={ALERT_CONFIG.CLOCK_IN.color}
        action={handleClockIn}
      />
      <AlertModal
        id={MODAL_IDS.CLOCK_OUT_ALERT}
        heading={ALERT_CONFIG.CLOCK_OUT.heading}
        content={`Hi ${tempStaff.firstName}, are you sure to clock out?`}
        color={ALERT_CONFIG.CLOCK_OUT.color}
        action={handleClockOut}
      />

      <div className="relative h-screen flex">
        <SideBar footer={"CICO System"}>
          <div className="px-4">
            <Button
              type="login"
              typeName="login"
              onClick={handleClockBtnClicked}
            >
              {!tempStaff.isClockIn ? "CLOCK IN" : "CLOCK OUT"}
            </Button>
            <TimeHolder timeHolder={todayClockList} />
          </div>
        </SideBar>
        <div className="flex-1 h-screen hidden lg:block">
          <div className="flex flex-col h-full">
            <NavBar />
            <Header staff={tempStaff} />
            <ClockWarningBanner tableClockList={tableClockList} />
            <div className="flex-1 w-full min-h-60 px-15 flex flex-col my-10">
              <div className="font-vietnam text-md font-semibold text-text-primary mb-5">
                <p>CLOCK IN/OUT HISTORY</p>
              </div>

              <DateRangeFilter
                searchStartDate={searchStartDate}
                setStartDate={setStartDate}
                searchEndDate={searchEndDate}
                setEndDate={setEndDate}
                defaultStartOfWeek={defaultStartOfWeek}
                defaultEndOfWeek={defaultEndOfWeek}
                onViewClicked={handleViewBtnClicked}
              />
              <ClockHistoryTable
                tableClockList={tableClockList}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <LoadingSpinner />
  );
}
