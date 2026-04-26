import { getHourDiff } from "../../lib";
import {
  formatClockTableRow,
  getClockoutMethodColor,
} from "../../lib/dashboardUtils";
import { TABLE_HEADERS } from "../../lib/dashboardConstants";
import LoadingSpinner from "../LoadingSpinner";

export function ClockHistoryTable({ tableClockList, isFetching }) {
  return (
    <div className="max-h-[300px] overflow-y-auto overflow-x-auto no-scrollbar transition-all duration-500 ease-in-out w-full">
      <table className="table font-vietnam text-xs text-text-primary table-pin-rows my-5">
        <thead className="sticky top-0 bg-white text-light-pink">
          <tr>
            {TABLE_HEADERS.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        {isFetching ? (
          <tbody>
            <tr>
              <td colSpan="7" className="text-center py-8">
                <LoadingSpinner />
              </td>
            </tr>
          </tbody>
        ) : tableClockList.length > 0 ? (
          <tbody>
            {tableClockList.map((clock) => {
              const row = formatClockTableRow(clock, getHourDiff);
              return (
                <tr
                  key={clock.id}
                  className={
                    !clock.endTime
                      ? "bg-sky-mist-20"
                      : clock.clockoutMethod == "auto-generated"
                        ? "bg-alert-10 cursor-pointer"
                        : ""
                  }
                >
                  <td>{row.clockInDate}</td>
                  <td>{row.clockInTime}</td>
                  <td>{row.clockOutTime}</td>
                  <td>{row.totalHours}</td>
                  <td>{row.branch}</td>
                  <td className={getClockoutMethodColor(row.clockoutMethod)}>
                    {row.clockoutMethod}
                  </td>
                  <td>
                    {row.note.length > 15
                      ? `${row.note.substring(0, 30)}...`
                      : row.note}
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="7" className="text-center">
                No data found
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
