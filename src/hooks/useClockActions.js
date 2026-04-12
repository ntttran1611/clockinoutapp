import dayjs from "dayjs";
import { addClock, getCurrentClock, updateClock, updateStaff } from "../data";

export function useClockActions(tempStaff, setStaff) {
  const handleClockIn = async () => {
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
  };

  const handleClockOut = async () => {
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
    }
  };

  return { handleClockIn, handleClockOut };
}
