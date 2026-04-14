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

export function useClockActions(
  tempStaff,
  setStaff,
  refetchTableClockList,
  refetchTodayClockList,
) {
  const handleClockIn = async () => {
    if (!tempStaff) return;
    const newTimeRecord = {
      startTime: dayjs().toISOString(),
      endTime: null,
      staffId: tempStaff.id,
      branch: localStorage.getItem("branch"),
    };

    const data = await addClock(newTimeRecord);
    const updatedStaff = {
      ...tempStaff,
      isClockIn: true,
      currentClockId: data[0].id,
    };
    setStaff(updatedStaff);
    await updateStaff(updatedStaff);
    refetchTableClockList();
    refetchTodayClockList();
  };

  const handleClockOut = async () => {
    if (!tempStaff) return;
    if (tempStaff.currentClockId) {
      const data = await getCurrentClock(tempStaff.currentClockId);
      const updatedClock = { ...data, endTime: dayjs().toISOString() };
      const updatedStaff = {
        ...tempStaff,
        isClockIn: false,
        currentClockId: null,
      };
      await updateClock(updatedClock);
      await updateStaff(updatedStaff);
      setStaff(updatedStaff);
      refetchTableClockList();
      refetchTodayClockList();
    }
  };

  return { handleClockIn, handleClockOut };
}
