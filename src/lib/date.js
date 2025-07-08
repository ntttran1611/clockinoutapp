import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export function startOfWeek(date) {
  return date.startOf("isoWeek").format("DD/MM/YYYY");
}

export function endOfWeek(date) {
  return date.endOf("isoWeek").format("DD/MM/YYYY");
}
