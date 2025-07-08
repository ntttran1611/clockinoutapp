import generateId from "../lib/math";
import dayjs from "dayjs";
/*
export default class Clock {
  id;
  startTime;
  endTime;
  totalHours;
  staffId;

  constructor(jsonClock) {
    this.id = jsonClock.id;
    this.startTime = jsonClock.startTime;
    this.endTime = jsonClock.endTime;
    this.totalHours = jsonClock.totalHours;
    this.staffId = jsonClock.staffId;
  }

  toJson() {
    return {
      id: this.id,
      startTime: this.startTime,
      endTime: this.endTime,
      totalHours: this.totalHours,
      staffId: this.staffId,
    };
  }

  generateClock(existingClockList, staffId) {
    let clockId = generateId();
    let tempClock = existingClockList.find((clock) => clock.id == clockId);
    while (tempClock) {
      clockId = generateId();
      tempClock = existingClockList.find((clock) => clock.id == clockId);
    }
    return new Clock({
      id: clockId,
      startTime: dayjs(),
      endTime: null,
      totalHours: null,
      staffId: staffId,
    });
  }
}*/

export const Clock = [
  {
    id: 1,
    startTime: dayjs("2025-06-16 9:00", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-16 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 8.0,
    staffId: "934271",
  },
  {
    id: 2,
    startTime: dayjs("2025-06-16 9:20", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-16 16:50", "YYYY-MM-DD HH:mm"),
    totalHours: 7.5,
    staffId: "325431",
  },
  {
    id: 3,
    startTime: dayjs("2025-06-16 9:20", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-16 16:50", "YYYY-MM-DD HH:mm"),
    totalHours: 7.5,
    staffId: "981245",
  },
  {
    id: 4,
    startTime: dayjs("2025-06-17 9:30", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-17 16:15", "YYYY-MM-DD HH:mm"),
    totalHours: 7.15,
    staffId: "342675",
  },
  {
    id: 5,
    startTime: dayjs("2025-06-17 9:15", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-17 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.45,
    staffId: "123456",
  },
  {
    id: 6,
    startTime: dayjs("2025-06-17 9:15", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-17 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.45,
    staffId: "987543",
  },
  {
    id: 7,
    startTime: dayjs("2025-06-18 9:05", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-18 17:05", "YYYY-MM-DD HH:mm"),
    totalHours: 8.0,
    staffId: "934271",
  },
  {
    id: 8,
    startTime: dayjs("2025-06-18 9:05", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-18 18:05", "YYYY-MM-DD HH:mm"),
    totalHours: 8.0,
    staffId: "981245",
  },
  {
    id: 9,
    startTime: dayjs("2025-06-19 10:00", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-19 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.0,
    staffId: "987543",
  },
  {
    id: 10,
    startTime: dayjs("2025-06-19 9:20", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-19 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.5,
    staffId: "321657",
  },
  {
    id: 11,
    startTime: dayjs("2025-06-19 9:20", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-19 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.5,
    staffId: "123456",
  },
  {
    id: 12,
    startTime: dayjs("2025-06-20 9:20", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-20 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.9,
    staffId: "123456",
  },
  {
    id: 13,
    startTime: dayjs("2025-06-20 9:20", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-20 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.9,
    staffId: "934271",
  },
  {
    id: 14,
    startTime: dayjs("2025-06-20 9:30", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-20 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.5,
    staffId: "321657",
  },
  {
    id: 15,
    startTime: dayjs("2025-06-20 9:30", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-20 17:00", "YYYY-MM-DD HH:mm"),
    totalHours: 7.5,
    staffId: "981245",
  },
  {
    id: 16,
    startTime: dayjs("2025-06-21 9:30", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-21 17:30", "YYYY-MM-DD HH:mm"),
    totalHours: 8.0,
    staffId: "123456",
  },
  {
    id: 17,
    startTime: dayjs("2025-06-21 9:30", "YYYY-MM-DD HH:mm"),
    endTime: dayjs("2025-06-21 17:30"),
    totalHours: 8.0,
    staffId: "654234",
  },
  {
    id: 18,
    startTime: dayjs("2025-06-21 9:30"),
    endTime: dayjs("2025-06-21 17:30"),
    totalHours: 8.0,
    staffId: "342675",
  },
  {
    id: 19,
    startTime: dayjs("2025-06-21 9:30"),
    endTime: dayjs("2025-06-21 17:30"),
    totalHours: 8.0,
    staffId: "987543",
  },
  {
    id: 20,
    startTime: dayjs("2025-06-22 9:30"),
    endTime: dayjs("2025-06-22 17:30"),
    totalHours: 8.0,
    staffId: "987543",
  },
  {
    id: 21,
    startTime: dayjs("2025-06-22 10:00"),
    endTime: dayjs("2025-06-22 13:30"),
    totalHours: 3.5,
    staffId: "4761233",
  },
  {
    id: 22,
    startTime: dayjs("2025-06-22 10:00"),
    endTime: dayjs("2025-06-22 16:00"),
    totalHours: 6.0,
    staffId: "654234",
  },
  {
    id: 23,
    startTime: dayjs("2025-06-22 10:00"),
    endTime: dayjs("2025-06-22 16:00"),
    totalHours: 6.0,
    staffId: "342675",
  },
];
