import { useNavigate } from "react-router-dom";
import {
  getStaff,
  updateStaffClockInStatus,
  updateStaff,
  addStaff,
  deleteStaff,
} from "../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//staff list mudations

export function useAddStaffMutation() {
  const queryClient = useQueryClient();
  const addStaffMutation = useMutation({
    mutationFn: (staffData) => addStaff(staffData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: (error) => {
      console.error("Mutation - Error adding staff: ", error);
    },
  });
  return addStaffMutation;
}

export function useEditStaffMutation() {
  const queryClient = useQueryClient();
  const editStaffMutation = useMutation({
    mutationFn: (staffData) => updateStaff(staffData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: (error) => {
      console.error("Error editing staff: ", error);
    },
  });
  return editStaffMutation;
}

export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();
  const deleteStaffMutation = useMutation({
    mutationFn: (staffId) => deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: (error) => {
      console.error("Error deleting staff: ", error);
    },
  });
  return deleteStaffMutation;
}

//Single Staff mutations
export function useStaffUpdateClockStatusMutation() {
  const queryClient = useQueryClient();
  const staffClockInStatusMutation = useMutation({
    mutationFn: ({ staffID, isClockIn, currentClockId }) =>
      updateStaffClockInStatus(staffID, isClockIn, currentClockId),
    onSuccess: () => {
      // After successfully updating the clock-in status, refetch the staff data to get the latest information
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });

  return staffClockInStatusMutation;
}

export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();
  const updateStaffMutation = useMutation({
    mutationFn: (updatedStaff) => updateStaff(updatedStaff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => {
      console.error("Error updating staff clock status: ", error);
    },
  });
  return updateStaffMutation;
}
