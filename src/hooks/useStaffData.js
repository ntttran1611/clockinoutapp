import { getStaffList } from "../api";
import { useNavigate } from "react-router-dom";
import {
  getStaff,
  updateStaffClockInStatus,
  updateStaff,
  addStaff,
  deleteStaff,
} from "../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useStaffList(staffStatusFilter, searchKeyword) {
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

export function useStaffInitialisation() {
  const navigate = useNavigate();
  if (!localStorage.getItem("staff")) {
    navigate("/");
  }

  const query = useQuery({
    queryKey: ["staff"],
    queryFn: () => getStaff(localStorage.getItem("staff")),
    enabled: !!localStorage.getItem("staff"),
  });

  if (query.isError) {
    console.error("Error fetching staff data: ", query.error);
    localStorage.removeItem("staff");
    navigate("/"); //This can be replaced with a more user-friendly error handling in the future
    return;
  }

  return {
    tempStaff: query.data,
    refetchStaff: query.refetch,
    isStaffLoading: query.isLoading,
  };
}
