import dayjs from "dayjs";
import { getTodayClockList, getClockListWithinRange } from "../data";
import { convertDateObjToISOString } from "../lib";
import { useQuery } from "@tanstack/react-query";

const staffId = localStorage.getItem("staff");

export function useTableClockData(searchStartDate, searchEndDate) {
  const tableClockQuery = useQuery({
    queryKey: ["tableClockList", searchStartDate, searchEndDate],
    queryFn: () =>
      getClockListWithinRange(
        staffId,
        convertDateObjToISOString(searchStartDate),
        convertDateObjToISOString(searchEndDate),
      ),
    enabled: !!staffId,
  });

  return {
    tableClockList: tableClockQuery.data || [],
    isLoading: tableClockQuery.isLoading,
    refetchTableClockList: tableClockQuery.refetch,
  };
}

export function useTodayClockData() {
  const todayClockQuery = useQuery({
    queryKey: ["todayClockList"],
    queryFn: () => getTodayClockList(staffId, dayjs()),
    enabled: !!staffId,
  });

  return {
    todayClockList: todayClockQuery.data || [],
    isLoading: todayClockQuery.isLoading,
    refetchTodayClockList: todayClockQuery.refetch,
  };
}
