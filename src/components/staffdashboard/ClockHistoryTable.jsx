import { getHourDiff } from "../../lib";
import {
  formatClockTableRow,
  getClockoutMethodColor,
} from "../../lib/dashboardUtils";
import { TABLE_HEADERS } from "../../lib/dashboardConstants";
import { LoadingSpinner, Table } from "../../components";

export function ClockHistoryTable({
  tableClockList,
  isFetching,
  isAdminControlled,
  onClick,
}) {
  return (
    <Table
      headers={TABLE_HEADERS}
      isFetching={isFetching}
      itemList={tableClockList}
    >
      {tableClockList.map((clock) => {
        const row = formatClockTableRow(clock, getHourDiff);
        return (
          <tr
            onClick={() => {
              if (
                !isAdminControlled ||
                clock.clockoutMethod != "auto-generated"
              )
                return;
              onClick(clock);
            }}
            key={clock.id}
            className={
              !clock.endTime
                ? "bg-sky-mist-20"
                : clock.clockoutMethod == "auto-generated"
                  ? `bg-alert-10 ${isAdminControlled ? "cursor-pointer" : ""}`
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
    </Table>
  );
}
