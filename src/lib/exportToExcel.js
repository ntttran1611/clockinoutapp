import * as XLSX from "xlsx";
import {
  formatClockTableRow,
  formatPayrollTableRow,
  getClockoutMethodColor,
} from "./dashboardUtils";
import { getHourDiff } from "./index";
import dayjs from "dayjs";

export function exportTableToExcel(formattedData, sheetName, fileName) {
  // Create a new workbook
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Write the file
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function getFormattedTableClockData(tableClockList) {
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

  return formattedData;
}

export function getFormattedPayrollData(payrollList) {
  const formattedData = payrollList.map((payroll) => {
    const row = formatPayrollTableRow(payroll);
    return {
      "Staff Id:": row.id,
      "Staff Name": row.staffName,
      Role: row.role,
      "Total Hours": row.workingHours,
      "Pay Rate": row.payRate,
      "Gross Wage": row.payable,
    };
  });

  return formattedData;
}
