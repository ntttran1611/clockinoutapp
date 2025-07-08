import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "../components/dashboard/SideBar";
import { Button, InputField } from "../components";
import dayjs from "dayjs";
import NavBar from "../components/dashboard/NaxBar";
import TimeHolder from "../components/dashboard/TimeHolder";
import generateId from "../lib/math";
import AlertModal from "../components/Modal";
import Table from "../components/Table";
import { FaEye } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { startOfWeek, endOfWeek } from "../lib/date";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function Dashboard() {
  const [id, setId] = useState(null);
  const [staff, setStaff] = useState(null);
  const [searchStartDate, setStartDate] = useState(startOfWeek(dayjs()));
  const [searchEndDate, setEndDate] = useState(endOfWeek(dayjs()));
  const [clockList, setClockList] = useState([]);
  const [tableClockList, setTableClockList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId"); //use location.state || null will cause destructuring from null since
  // null || null = null
  //?? {} means if location.state is null them fallback to an empty object {}
  useEffect(() => {
    //**This should be using context and API to get the user */
    async function initData() {
      const staffList = await JSON.parse(localStorage.getItem("staffList"));
      if (location.state === null) {
        navigate("/");
      } else {
        setStaff(
          staffList.find((staff) => {
            return staff.id == staffId;
          })
        );
      }
      setClockList(
        JSON.parse(localStorage.getItem("clock")).filter(
          (clock) => clock.staffId === staffId
        )
      );
    }
    if (!localStorage.getItem("staffId")) navigate("/");
    initData();
    setTableClockList(filterClockList());
  }, []);

  function generateClock() {
    let clockId = generateId();
    let tempClock = clockList.find((clock) => clock.id == clockId);
    while (tempClock) {
      clockId = generateId();
      tempClock = clockList.find((clock) => clock.id == clockId);
    }
    return {
      id: clockId,
      startTime: dayjs().toISOString(),
      endTime: null,
      totalHours: null,
      staffId: staffId,
    };
  }

  function handleClockIn() {
    const newTimeRecord = generateClock();
    //console.log(newTimeRecord);
    //This has to be updated to the db for future clock out
    let tempAllStaff = JSON.parse(localStorage.getItem("staffList"));
    tempAllStaff = tempAllStaff.map((currentStaff) => {
      return currentStaff.id === staffId
        ? { ...currentStaff, isClockIn: true, currentClockId: newTimeRecord.id }
        : currentStaff;
    });

    localStorage.setItem("staffList", JSON.stringify(tempAllStaff)); //this stands for updating to the database

    setStaff({ ...staff, isClockIn: true, currentClockId: newTimeRecord.id });

    //console.log(staff);

    /**THIS SHOULD BE CONNECTED TO THE BACKEND USING API */
    const tempAllClocks = JSON.parse(localStorage.getItem("clock"));
    const tempCurrentClocks = [...clockList];

    tempCurrentClocks.push(newTimeRecord);
    tempAllClocks.push(newTimeRecord); //this is stand for the clock list from the database
    setClockList(tempCurrentClocks);
    localStorage.setItem("clock", JSON.stringify(tempAllClocks));
  }

  function handleClockOut() {
    let currentClock = clockList.find(
      (clock) => clock.id == staff.currentClockId
    );

    let tempAllClocks = JSON.parse(localStorage.getItem("clock"));
    tempAllClocks = tempAllClocks.map((clock) => {
      return clock.id === currentClock.id
        ? {
            ...clock,
            endTime: dayjs().toISOString(),
            totalHours: dayjs().diff(dayjs(currentClock.startTime)),
          }
        : clock;
    });
    let tempClocks = [...clockList];
    tempClocks = tempClocks.map((clock) => {
      return clock.id === currentClock.id
        ? {
            ...clock,
            endTime: dayjs().toISOString(),
            totalHours: dayjs().diff(dayjs(currentClock.startTime)),
          }
        : clock;
    });

    setClockList(tempClocks);
    localStorage.setItem("clock", JSON.stringify(tempAllClocks)); //this stands for updating to the database

    let tempAllStaff = JSON.parse(localStorage.getItem("staffList"));
    tempAllStaff = tempAllStaff.map((staff) => {
      return staff.id == staffId
        ? { ...staff, isClockIn: false, currentClockId: null }
        : staff;
    });
    localStorage.setItem("staffList", JSON.stringify(tempAllStaff)); //this stands for updating to the database
    setStaff({ ...staff, isClockIn: false, currentClockId: null });
  }

  function handleClockBtnClicked() {
    if (!staff.isClockIn) {
      handleClockIn();
    } else {
      document.getElementById("clockOutAlert").showModal();
    }
  }

  function filterClockList() {
    //filter the clocks that have its date within the date range
    return clockList.filter((clock) => {
      const clockDate = dayjs(clock.startTime);
      const start = dayjs(searchStartDate, "DD/MM/YYYY");
      const end = dayjs(searchEndDate, "DD/MM/YYYY");
      return (
        (clockDate.isSame(start, "day") ||
          clockDate.isSame(end, "day") ||
          (clockDate.isAfter(start, "day") &&
            clockDate.isBefore(end, "day"))) &&
        clock.endTime
      );
    });
  }

  function handleViewBtnClicked() {
    console.log(
      dayjs
        .utc("15/06/2025", "DD/MM/YYYY")
        .isSame(dayjs.utc("2025-06-15T23:00:00.000Z"), "day")
    );
    setTableClockList(filterClockList());
    console.log(filterClockList());
    console.log(searchStartDate);
    console.log(searchEndDate);
  }

  return staff ? (
    <>
      <AlertModal
        id="clockOutAlert"
        heading="Attention before action"
        content="Are you sure to clock out?"
        action={handleClockOut}
      />
      <div className="h-screen flex">
        <div>
          <SideBar footer={`ID number: ${staffId}`}>
            <Button type="" typeName="login" onClick={handleClockBtnClicked}>
              {!staff.isClockIn ? "CLOCK IN" : "CLOCK OUT"}
            </Button>
            {/**Start time or endtime should be dayjs() */}
            <TimeHolder timeHolder={clockList} />
          </SideBar>
        </div>
        <div className="flex-1 h-screen">
          <div className="flex flex-col h-full">
            <div className="basis-1/6">
              <NavBar
                title={`Welcome back, ${staff.firstName}!`}
                setStaffId={setId}
              />
            </div>
            <div className="basis-5/6">
              <div className="w-5/6 min-h-60 mx-auto rounded-xl shadow-2xl p-10">
                <div className="font-vietnam text-md font-semibold text-text-primary mb-5 text-center">
                  <p>CLOCK IN/OUT HISTORY</p>
                </div>
                <div className="flex items-center mb-3 justify-between w-1/3 mx-auto gap-1">
                  <p>from</p>
                  <InputField
                    typeName="regular-input"
                    value={searchStartDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <p>to</p>
                  <InputField
                    typeName="regular-input"
                    value={searchEndDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <div className="tooltip" data-tip="view">
                    <Button
                      typeName="icon-primary"
                      onClick={handleViewBtnClicked}
                    >
                      <FaEye />
                    </Button>
                  </div>
                  <div className="tooltip" data-tip="reset">
                    <Button typeName="icon-secondary">
                      <RiResetLeftFill />
                    </Button>
                  </div>
                </div>
                <div className="font-vietnam text-xs font-extralight text-text-secondary mb-5 text-center">
                  <p>
                    <i>*** Required date format: DD/MM/YYYY or D/M/YYYY ***</i>
                  </p>
                </div>
                <div className="overflow-x-auto">
                  {tableClockList.length > 0 ? (
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Date</th>
                          <th>Clock In At</th>
                          <th>Clock Out At</th>
                          <th>Total Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableClockList.map((clock) => {
                          return (
                            <tr key={clock.id}>
                              <td></td>
                              <td>
                                {dayjs(clock.startTime).format("DD/MM/YYYY")}
                              </td>
                              <td>
                                {dayjs(clock.startTime).format("HH:mm:ss")}
                              </td>
                              <td>{dayjs(clock.endTime).format("HH:mm:ss")}</td>
                              <td>{clock.totalHours}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="w-full">
                      <p className="font-vietnam text-text-secondary text-sm text-center mt-5">
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
  ) : null;
}
