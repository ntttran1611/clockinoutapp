import { useQuery } from "@tanstack/react-query";
import { getStaffList } from "../data";

export function useStaffData(staffStatusFilter, searchKeyword) {
  const staffQuery = useQuery({
    queryKey: ["staffList"],
    queryFn: () => getStaffList(staffStatusFilter, searchKeyword),
  });

  return {
    staffList: staffQuery.data || [],
    staffListIsFetching: staffQuery.isFetching,
    refetchStaffList: staffQuery.refetch,
  };
}
