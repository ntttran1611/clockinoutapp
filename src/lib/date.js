import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { regexNumber } from "./regex";

dayjs.extend(isoWeek);

export function startOfWeek(date) {
  return date.startOf("isoWeek");
}

export function endOfWeek(date) {
  return date.endOf("isoWeek");
}

export function convertToDateObject(date) {
  return {
    day: date.format("DD"),
    month: date.format("MM"),
    year: date.format("YYYY"),
  };
}

export function convertDateObjToISOString(dateObj) {
  return dayjs(`${dateObj.year}-${dateObj.month}-${dateObj.day}`).toISOString();
}

export function dayFormatting(day, oldDay) {
  if (!regexNumber.test(day)) {
    return oldDay;
  }
  if (parseInt(day) > 31 || parseInt(day) < 0) {
    return oldDay;
  }
  if (day.length == 1) {
    return `0${day}`;
  }
  return day;
}

export function monthFormatting(month, oldMonth) {
  if (!regexNumber.test(month)) {
    return oldMonth;
  }
  if (parseInt(month) > 12 || parseInt(month) < 0) {
    return oldMonth;
  }
  if (month.length == 1) {
    return `0${month}`;
  }
  return month;
}

export function yearFormatting(year, oldYear) {
  if (!regexNumber.test(year)) {
    return oldYear;
  }
  if (parseInt(year) < 0) {
    return oldYear;
  }
  if (year.length < 4) {
    return oldYear;
  }
  return year;
}
