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
  useClockData,
  useClockActions,
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

  const { tempStaff, setStaff } = useStaffInitialization();
  const { todayClockList, tableClockList, isLoading, refetchTableClockList } =
    useClockData(tempStaff?.id, searchStartDate, searchEndDate);
  const { handleClockIn, handleClockOut } = useClockActions(
    tempStaff,
    setStaff,
  );

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

  return tempStaff ? (
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
