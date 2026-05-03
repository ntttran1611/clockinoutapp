import { useEffect, useState } from "react";
import {
  Button,
  SideBar,
  NavBar,
  TimeHolder,
  AlertModal,
  DateTimeInput,
  LoadingSpinner,
} from "../components";
import {
  ClockWarningBanner,
  ClockHistoryTable,
} from "../components/staffdashboard";

import { startOfWeek, endOfWeek } from "../lib";

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
import {
  MODAL_IDS,
  ALERT_CONFIG,
  CLOCK_OUT_METHODS,
} from "../lib/dashboardConstants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Header from "../components/dashboard/Header";
import { getNoteOfLatestClockIn } from "../lib/dashboardUtils";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function Dashboard() {
  //Dashboard States
  const defaultStartOfWeek = startOfWeek(dayjs()).format("YYYY-MM-DD");
  const defaultEndOfWeek = endOfWeek(dayjs()).format("YYYY-MM-DD");
  const [searchStartDate, setStartDate] = useState(defaultStartOfWeek);
  const [searchEndDate, setEndDate] = useState(defaultEndOfWeek);
  const [clockNote, setClockNote] = useState("");
  //Staff
  const { tempStaff, refetchStaff, isStaffLoading } = useStaffInitialization();
  const updateStaffMutation = useUpdateStaffMutation();
  const updateStaffClockStatusMutation = useStaffUpdateClockStatusMutation();
  //Clock Data
  const { tableClockList, isTableClockLoading, refetchTableClockList } =
    useTableClockData(tempStaff?.id, searchStartDate, searchEndDate);
  const { todayClockList } = useTodayClockData(tempStaff?.id);
  //Clock Actions
  const autoClockOutMutation = useAutoClockOutMutation();
  const addNewClockMutation = useAddClockMutation();
  const updateCurrentClockMutation = useUpdateClockMutation();

  useEffect(() => {
    async function checkAutoClockOut() {
      if (!tempStaff) return;
      try {
        const data = await autoClockOutMutation.mutateAsync(tempStaff);
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

  useEffect(() => {
    if (tempStaff && todayClockList) {
      const note = getNoteOfLatestClockIn(
        todayClockList,
        tempStaff.currentClockId,
      );
      setClockNote(note);
    }
  }, [tempStaff, todayClockList]);

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
      note: clockNote,
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
      try {
        const updatedClock = {
          ...data,
          endTime: dayjs().toISOString(),
          clockoutMethod: CLOCK_OUT_METHODS.MANUAL,
          note: clockNote,
        };
        await updateCurrentClockMutation.mutateAsync(updatedClock);

        const updatedStaff = {
          ...tempStaff,
          isClockIn: false,
          currentClockId: null,
        };
        await updateStaffMutation.mutateAsync(updatedStaff);
        setClockNote("");
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
        content={`Hi ${tempStaff.firstName}, are you ready to START the shift?`}
        color={ALERT_CONFIG.CLOCK_IN.color}
        action={handleClockIn}
        textContent={clockNote}
        setTextContent={setClockNote}
        isWithTextNote={true}
      />
      <AlertModal
        id={MODAL_IDS.CLOCK_OUT_ALERT}
        heading={ALERT_CONFIG.CLOCK_OUT.heading}
        content={`Hi ${tempStaff.firstName}, are you sure to CLOSE the shift?`}
        color={ALERT_CONFIG.CLOCK_OUT.color}
        action={handleClockOut}
        textContent={clockNote}
        setTextContent={setClockNote}
        isWithTextNote={true}
      />

      <div className="relative h-screen flex">
        <SideBar footer={"CICO System"}>
          <div className="px-4 w-full flex flex-col items-center gap-5">
            <Button
              type="login"
              typeName={!tempStaff.isClockIn ? "clock-in" : "clock-out"}
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
            <div className="flex-1 w-full min-h-60 px-15 flex flex-col my-5">
              <div className="font-vietnam text-md font-semibold text-text-primary mb-5">
                <p>CLOCK IN/OUT HISTORY</p>
              </div>

              <div className="flex items-center gap-4">
                <DateTimeInput
                  label="From"
                  id="startDate"
                  defaultValue={searchStartDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <DateTimeInput
                  label="To"
                  id="endDate"
                  defaultValue={searchEndDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <button
                  onClick={handleViewBtnClicked}
                  className="btn self-end font-regular bg-sky-mist-100 text-white"
                >
                  View
                </button>
              </div>
              <ClockHistoryTable
                tableClockList={tableClockList}
                isLoading={isTableClockLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <LoadingSpinner isFullScreen={true} />
  );
}
