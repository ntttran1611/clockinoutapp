import dayjs from "dayjs";
import {
  addClock,
  checkAndAutoClockOut,
  getCurrentClock,
  updateClock,
  updateStaff,
} from "../data";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAutoClockOutMutation() {
  const queryClient = useQueryClient();
  const autoClockOutMutation = useMutation({
    mutationFn: (tempStaff) => checkAndAutoClockOut(tempStaff.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayClockList"] });
      queryClient.invalidateQueries({ queryKey: ["tableClockList"] });
    },
    onError: (error) => {
      console.error("Error during auto clock-out: ", error);
    },
  });

  return autoClockOutMutation;
}

export function useAddClockMutation() {
  const queryClient = useQueryClient();
  const addClockMutation = useMutation({
    mutationFn: (newTimeRecord) => addClock(newTimeRecord),
    onError: (error) => {
      console.error("Error adding clock record: ", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayClockList"] });
      queryClient.invalidateQueries({ queryKey: ["tableClockList"] });
    },
  });

  return addClockMutation;
}

export function useUpdateClockMutation() {
  const queryClient = useQueryClient();
  const updateClockMutation = useMutation({
    mutationFn: (updatedClock) => updateClock(updatedClock),
    onError: (error) => {
      console.error("Error updating clock record: ", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayClockList"] });
      queryClient.invalidateQueries({ queryKey: ["tableClockList"] });
    },
  });

  return updateClockMutation;
}
