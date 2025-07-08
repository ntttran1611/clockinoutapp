import { useEffect, useRef } from "react";
import fromIntToTimeString, { fromIntToDecimalHours } from "../../lib/time";
import dayjs from "dayjs";

export default function TimeRecord({ startTime, endTime, workingHours }) {
  useEffect(() => {
    const intervalCount = setInterval(() => {
      if (timeCounterRef.current && !endTime) {
        const currentTime = dayjs();
        timeCounterRef.current.innerText = fromIntToTimeString(
          currentTime.diff(startTime)
        );
      }
    }, 1000);

    return () => clearInterval(intervalCount);
  }, [startTime, endTime]);

  const timeCounterRef = useRef(null);
  const clockInText = (
    <p>
      <strong>Clock in: </strong>
      {startTime ? dayjs(startTime).format("HH:mm:ss, DD/MM/YYYY") : ""};
    </p>
  );

  const clockOutText = (
    <p>
      <strong>Clock out: </strong>
      {endTime ? (
        dayjs(endTime).format("HH:mm:ss, DD/MM/YYYY")
      ) : (
        <i className="animate-pulse font-medium text-light-pink">Working...</i>
      )}
    </p>
  );
  const workingHoursText = (
    <p>
      <strong>Worked for: </strong>
      {workingHours ? (
        <span>
          {fromIntToTimeString(workingHours)},{" "}
          {fromIntToDecimalHours(workingHours)}h
        </span>
      ) : (
        <span ref={timeCounterRef}>00:00:00</span>
      )}
    </p>
  );

  return (
    <div className="animate-fade-right-fast bg-white w-full h-auto rounded-lg p-3 shadow-lg font-vietnam font-extralight text-sm text-text-primary text-start">
      <div>
        {clockInText} {clockOutText} {workingHoursText}
      </div>
    </div>
  );
}
