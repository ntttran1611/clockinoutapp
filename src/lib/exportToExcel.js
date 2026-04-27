import * as XLSX from "xlsx";
import { formatClockTableRow, getClockoutMethodColor } from "./dashboardUtils";
import { getHourDiff } from "./index";
import dayjs from "dayjs";

export function exportClockTableToExcel(
  tableClockList,
  staffName,
  startDate,
  endDate,
) {
  // Format the data
  const formattedData = tableClockList.map((clock) => {
    const row = formatClockTableRow(clock, getHourDiff);
    return {
      "Clock In Date": row.clockInDate,
      "Clock In Time": row.clockInTime,
      "Clock Out Time": row.clockOutTime,
      "Total Hours": row.totalHours,
      Branch: row.branch,
      "Clock Out Method": row.clockoutMethod,
      Note: row.note,
    };
  });

  // Create a new workbook
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Clock History");

  // Add metadata
  const fileName = `Clock_History_${staffName}_${dayjs().format("YYYY-MM-DD")}.xlsx`;

  // Write the file
  XLSX.writeFile(wb, fileName);
}
