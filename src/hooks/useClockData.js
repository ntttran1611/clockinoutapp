import dayjs from "dayjs";
import { getTodayClockList, getClockListWithinRange } from "../api";
import { convertDateObjToISOString } from "../lib";
import { useQuery } from "@tanstack/react-query";

export function useTableClockData(staffId, searchStartDate, searchEndDate) {
  const tableClockQuery = useQuery({
    queryKey: ["tableClockList", staffId, searchStartDate, searchEndDate],
    queryFn: () =>
      getClockListWithinRange(
        staffId,
        dayjs(searchStartDate).toISOString(),
        dayjs(searchEndDate).toISOString(),
      ),
    enabled: !!staffId && !!searchStartDate && !!searchEndDate,
  });

  return {
    tableClockList: tableClockQuery.data || [],
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
    refetchTodayClockList: todayClockQuery.refetch,
  };
}
