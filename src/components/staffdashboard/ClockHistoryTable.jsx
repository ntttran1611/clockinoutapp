import { getHourDiff } from "../../lib";
import {
  formatClockTableRow,
  getClockoutMethodColor,
} from "../../lib/dashboardUtils";
import { TABLE_HEADERS } from "../../lib/dashboardConstants";

export function ClockHistoryTable({ tableClockList, isLoading }) {
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
        {isLoading ? (
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
                <tr key={clock.id}>
                  <td>{row.clockInDate}</td>
                  <td>{row.clockInTime}</td>
                  <td>{row.clockOutDate}</td>
                  <td>{row.clockOutTime}</td>
                  <td>{row.totalHours}</td>
                  <td>{row.branch}</td>
                  <td className={getClockoutMethodColor(row.clockoutMethod)}>
                    {row.clockoutMethod}
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
