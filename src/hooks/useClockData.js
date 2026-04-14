import dayjs from "dayjs";
import { getTodayClockList, getClockListWithinRange } from "../data";
import { convertDateObjToISOString } from "../lib";
import { useQuery } from "@tanstack/react-query";

export function useTableClockData(staffId, searchStartDate, searchEndDate) {
  const tableClockQuery = useQuery({
    queryKey: ["tableClockList", staffId],
    queryFn: () =>
      getClockListWithinRange(
        staffId,
        convertDateObjToISOString(searchStartDate),
        convertDateObjToISOString(searchEndDate),
      ),
    enabled: !!staffId && !!searchStartDate && !!searchEndDate,
  });

  return {
    tableClockList: tableClockQuery.data || [],
    isLoading: tableClockQuery.isLoading,
    isFetching: tableClockQuery.isFetching,
    refetchTableClockList: tableClockQuery.refetch,
  };
}

export function useTodayClockData(staffId) {
  const todayClockQuery = useQuery({
    queryKey: ["todayClockList"],
    queryFn: () => getTodayClockList(staffId, dayjs()),
    enabled: !!staffId,
  });

  return {
    todayClockList: todayClockQuery.data || [],
    isLoading: todayClockQuery.isLoading,
    isFetching: todayClockQuery.isFetching,
    refetchTodayClockList: todayClockQuery.refetch,
  };
}
