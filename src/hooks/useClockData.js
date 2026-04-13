import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  getTodayClockList,
  getClockListWithinRange,
  checkAndAutoClockOut,
  updateStaffClockInStatus,
} from "../data";
import { convertDateObjToISOString } from "../lib";

export function useClockData(searchStartDate, searchEndDate) {
  const [todayClockList, setTodayClockList] = useState([]);
  const [tableClockList, setTableClockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const staffId = localStorage.getItem("staff");

  useEffect(() => {
    async function finalisePrevClockOutAndSetupTodayClockList() {
      if (staffId) {
        await checkAndAutoClockOut(staffId);
        //await updateStaffClockInStatus(staffId, false, null); //clock out staff in case they forgot to clock out yesterday, and update their clock in status to false, so that the dashboard can reflect the correct clock in status
        await refetchTodayClockList();
        await refetchTableClockList();
      }
    }
    finalisePrevClockOutAndSetupTodayClockList();
  }, [staffId]);

  const refetchTableClockList = async () => {
    if (staffId) {
      setIsLoading(true);
      try {
        const start = convertDateObjToISOString(searchStartDate);
        const end = convertDateObjToISOString(searchEndDate);
        const data = await getClockListWithinRange(staffId, start, end);
        setTableClockList(data);
      } catch (error) {
        console.error("Unexpected error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const refetchTodayClockList = async () => {
    if (staffId) {
      try {
        const data = await getTodayClockList(staffId, dayjs());
        setTodayClockList(data);
      } catch (error) {
        console.error("Unexpected error: ", error);
      }
    }
  };

  return {
    todayClockList,
    tableClockList,
    isLoading,
    refetchTableClockList,
    refetchTodayClockList,
  };
}
