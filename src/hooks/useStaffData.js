import { useQuery } from "@tanstack/react-query";
import { getStaffList } from "../data";

export function useStaffData() {
  const staffQuery = useQuery({
    queryKey: ["staffList"],
    queryFn: () => getStaffList(),
  });

  return {
    staffList: staffQuery.data || [],
    staffListIsFetching: staffQuery.isFetching,
    refetchStaffList: staffQuery.refetch,
  };
}
