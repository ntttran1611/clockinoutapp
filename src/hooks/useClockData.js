import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  getTodayClockList,
  getClockListWithinRange,
  checkAndAutoClockOut,
} from "../data";
import { convertDateObjToISOString } from "../lib";

export function useClockData(staffId, searchStartDate, searchEndDate) {
  const [todayClockList, setTodayClockList] = useState([]);
  const [tableClockList, setTableClockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function finalisePrevClockOutAndSetupTodayClockList() {
      if (staffId) {
        await checkAndAutoClockOut(staffId);
        const todayClockList = await getTodayClockList(staffId, dayjs());
        setTodayClockList(todayClockList);
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { todayClockList, tableClockList, isLoading, refetchTableClockList };
}
