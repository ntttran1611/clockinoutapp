import dayjs from "dayjs";

//Convert a miliseconds to string format HH:mm:ss
export default function fromIntToTimeString(totalMiliSeconds) {
  // Convert to hh:mm:ss
  const hours = Math.floor(totalMiliSeconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (totalMiliSeconds % (1000 * 60 * 60)) / (1000 * 60),
  );
  const seconds = Math.floor((totalMiliSeconds % (1000 * 60)) / 1000);

  // Format with leading zeros
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`; // Output: 03:20:30
}

//convert miliseconds to hours with two decimal digits
export function fromIntToDecimalHours(totalMiliSeconds) {
  return (totalMiliSeconds / 3600000).toFixed(2);
}

//get the difference in hours between two timestamps
export function getHourDiff(startTime, endTime) {
  return dayjs(endTime).diff(startTime, "hours", true);
}

export function clockSync(displayTime) {
  const currentTime = dayjs();
  const msUntilNextSecond = 1000 - currentTime.millisecond();

  //Await until the next full second...
  setTimeout(() => {
    displayTime;
    //...then run every second
    setInterval(displayTime, 1000);
  }, msUntilNextSecond);
}
