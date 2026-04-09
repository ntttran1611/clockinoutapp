import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  SideBar,
  NavBar,
  TimeHolder,
  AlertModal,
  DateInputField,
} from "../components";

import {
  startOfWeek,
  endOfWeek,
  convertToDateObject,
  dayFormatting,
  monthFormatting,
  yearFormatting,
  convertDateObjToISOString,
  getHourDiff,
} from "../lib";

import {
  addClock,
  getClockListWithinRange,
  getCurrentClock,
  getTodayClockList,
  updateClock,
  getStaff,
  updateStaff,
} from "../data";
import { FaEye } from "react-icons/fa";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(customParseFormat);

//const staffId = localStorage.getItem("staffId"); //use location.state || null will cause destructuring from null since
// null || null = null
//?? {} means if location.state is null them fallback to an empty object {}

export default function Dashboard() {
  const defaultStartOfWeek = convertToDateObject(startOfWeek(dayjs()));
  const defaultEndOfWeek = convertToDateObject(endOfWeek(dayjs()));
  const [searchStartDate, setStartDate] = useState(defaultStartOfWeek);
  const [searchEndDate, setEndDate] = useState(defaultEndOfWeek);
  const [tempStaff, setStaff] = useState();
  const [todayClockList, setTodayClockList] = useState([]);
  const [tableClockList, setTableClockList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("staff")) {
      navigate("/");
    } else {
      getStaff(localStorage.getItem("staff")).then((data) => {
        setStaff(data);
      });
    }
  }, []);

  useEffect(() => {
    //tempStaff:isClockIn will be changing => this will be updated too
    if (tempStaff) {
      getTodayClockList(tempStaff.id, dayjs()).then((data) =>
        setTodayClockList(data),
      );
      getClockListWithinRange(
        tempStaff.id,
        convertDateObjToISOString(searchStartDate),
        convertDateObjToISOString(searchEndDate),
      ).then((data) => {
        console.log(data);
        setTableClockList(data);
      });
    }
  }, [tempStaff]);

  function handleClockIn() {
    const newTimeRecord = {
      startTime: dayjs().toISOString(),
      endTime: null,
      staffId: tempStaff.id,
      branch: localStorage.getItem("branch"),
    };
    //add a new clock to database
    addClock(newTimeRecord).then((data) => {
      //notice that this staff is currently clocked in
      const updatedStaff = {
        ...tempStaff,
        isClockIn: true,
        currentClockId: data[0].id,
      };
      setStaff(updatedStaff);
      updateStaff(updatedStaff);
    });
  }

  function handleClockOut() {
    if (tempStaff.currentClockId) {
      getCurrentClock(tempStaff.currentClockId).then(async (data) => {
        //update the clock out time to this clock
        const updatedClock = { ...data, endTime: dayjs().toISOString() };
        //notice that the staff is clocked out
        const updatedStaff = {
          ...tempStaff,
          isClockIn: false,
          currentClockId: null,
        };
        //This makes sure that the current clock and staff updates are finished before get the new clock list
        await updateClock(updatedClock);
        await updateStaff(updatedStaff);
        //update staff and trigger clocks are gotten from the db
        setStaff(updatedStaff);
      });
    }
  }

  function handleClockBtnClicked() {
    if (!tempStaff.isClockIn) {
      document.getElementById("clockInAlert").showModal();
    } else {
      document.getElementById("clockOutAlert").showModal();
    }
  }

  function handleViewBtnClicked() {
    const start = convertDateObjToISOString(searchStartDate);
    const end = convertDateObjToISOString(searchEndDate);
    getClockListWithinRange(tempStaff.id, start, end).then((data) =>
      setTableClockList(data),
    );
  }

  return tempStaff ? (
    <>
      <AlertModal
        id="clockInAlert"
        heading="Attention before action"
        content={`Hi ${tempStaff.firstName}, are you sure to clock in?`}
        color="deep-green"
        action={handleClockIn}
      />
      <AlertModal
        id="clockOutAlert"
        heading="Attention before action"
        content={`Hi ${tempStaff.firstName}, are you sure to clock out?`}
        color="deep-green"
        action={handleClockOut}
      />

      <div className="relative h-screen flex">
        <SideBar footer={`ID number: ${tempStaff.id}`}>
          <div className="px-4">
            <Button
              type="login"
              typeName="login"
              onClick={handleClockBtnClicked}
            >
              {!tempStaff.isClockIn ? "CLOCK IN" : "CLOCK OUT"}
            </Button>
            <TimeHolder timeHolder={todayClockList} />
          </div>
        </SideBar>
        <div className="flex-1 h-screen hidden lg:block">
          <div className="flex flex-col h-full">
            <div className="basis-1/6 ">
              <NavBar
                title={`G'day, ${tempStaff.firstName}! Ready to clock in?`}
              />
            </div>
            <div className="basis-5/6 ">
              <div className="w-5/6 min-h-60 mx-auto rounded-xl shadow-2xl p-10 flex flex-col justify-center items-center">
                <div className="font-vietnam text-md font-semibold text-text-primary mb-5 text-center">
                  <p>CLOCK IN/OUT HISTORY</p>
                </div>

                <div className="flex items-center mb-3 justify-center 2xl:w-1/3 w-5/6 gap-1">
                  <p className="font-vietnam text-sm">from</p>
                  <DateInputField
                    dateObject={searchStartDate}
                    onDayChange={(e) =>
                      setStartDate({ ...searchStartDate, day: e.target.value })
                    }
                    onMonthChange={(e) =>
                      setStartDate({
                        ...searchStartDate,
                        month: e.target.value,
                      })
                    }
                    onYearChange={(e) =>
                      setStartDate({ ...searchStartDate, year: e.target.value })
                    }
                    dayFormatting={(e) =>
                      setStartDate({
                        ...searchStartDate,
                        day: dayFormatting(
                          e.target.value,
                          defaultStartOfWeek.day,
                        ),
                      })
                    }
                    monthFormatting={(e) =>
                      setStartDate({
                        ...searchStartDate,
                        month: monthFormatting(
                          e.target.value,
                          defaultStartOfWeek.month,
                        ),
                      })
                    }
                    yearFormatting={(e) =>
                      setStartDate({
                        ...searchStartDate,
                        year: yearFormatting(
                          e.target.value,
                          defaultStartOfWeek.year,
                        ),
                      })
                    }
                  />
                  <p className="font-vietnam text-sm">to</p>
                  <DateInputField
                    dateObject={searchEndDate}
                    onDayChange={(e) => {
                      setEndDate({ ...searchEndDate, day: e.target.value });
                    }}
                    onMonthChange={(e) =>
                      setEndDate({
                        ...searchEndDate,
                        month: e.target.value,
                      })
                    }
                    onYearChange={(e) =>
                      setEndDate({ ...searchEndDate, year: e.target.value })
                    }
                    dayFormatting={(e) =>
                      setEndDate({
                        ...searchEndDate,
                        day: dayFormatting(
                          e.target.value,
                          defaultEndOfWeek.day,
                        ),
                      })
                    }
                    monthFormatting={(e) =>
                      setEndDate({
                        ...searchEndDate,
                        month: monthFormatting(
                          e.target.value,
                          defaultEndOfWeek.month,
                        ),
                      })
                    }
                    yearFormatting={(e) =>
                      setEndDate({
                        ...searchEndDate,
                        year: yearFormatting(
                          e.target.value,
                          defaultEndOfWeek.year,
                        ),
                      })
                    }
                  />
                  <div className="tooltip" data-tip="view">
                    <Button
                      typeName="icon-primary"
                      onClick={handleViewBtnClicked}
                    >
                      <FaEye />
                    </Button>
                  </div>
                </div>
                <div
                  className={`overflow-y-auto overflow-x-auto no-scrollbar transition-all duration-500 ease-in-out w-full ${
                    tableClockList.length == 0 ? `max-h-10` : `max-h-72`
                  }`}
                >
                  {tableClockList.length > 0 ? (
                    <table className="table table-zebra font-vietnam text-xs text-text-primary table-pin-rows">
                      <thead className="text-deep-green">
                        <tr>
                          <th>Clock In Date</th>
                          <th>Clock In At</th>
                          <th>Clock Out Date</th>
                          <th>Clock Out At</th>
                          <th>Total Hours</th>
                          <th>Branch</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableClockList.map((clock) => {
                          return (
                            <tr key={clock.id}>
                              <td>
                                {dayjs(clock.startTime).format("DD/MM/YYYY")}
                              </td>
                              <td>
                                {dayjs(clock.startTime).format("HH:mm:ss")}
                              </td>
                              <td>
                                {clock.endTime
                                  ? dayjs(clock.endTime).format("DD/MM/YYYY")
                                  : "Unfinished"}
                              </td>
                              <td>
                                {clock.endTime
                                  ? dayjs(clock.endTime).format("HH:mm:ss")
                                  : "Unfinished"}
                              </td>
                              <td>
                                {clock.endTime
                                  ? `${getHourDiff(
                                      clock.startTime,
                                      clock.endTime,
                                    )}h`
                                  : "Unfinished"}
                              </td>
                              <td>{clock.branch}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="w-full">
                      <p className="font-vietnam text-text-secondary text-sm text-center mt-3">
                        No data found
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-xl "></span>
    </div>
  );
}
