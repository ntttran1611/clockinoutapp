import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBranchList } from "../../api";

export function useBranchList(searchKeyword) {
  const branchQuery = useQuery({
    queryKey: ["branchList", searchKeyword],
    queryFn: () => getBranchList(searchKeyword),
  });

  return {
    branchList: branchQuery.data?.data || [],
    branchListIsFetching: branchQuery.isFetching,
    refetchBranchList: branchQuery.refetch,
  }
}