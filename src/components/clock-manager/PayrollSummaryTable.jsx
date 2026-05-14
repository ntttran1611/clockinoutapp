import { formatPayrollTableRow, PAYROLL_TABLE_HEADERS } from "../../lib";
import { Table } from "../Table";

export function PayrollSummaryTable({ list }) {
  return (
    <Table
      headers={PAYROLL_TABLE_HEADERS}
      isFetching={null}
      itemList={list}
      isZebra={true}
    >
      {list &&
        list.map((payroll) => {
          const row = formatPayrollTableRow(payroll);
          return (
            <tr key={row.staffName}>
              <td>#{row.id}</td>
              <td>{row.staffName}</td>
              <td>{row.role}</td>
              <td>{row.workingHours}</td>
              <td>{row.payRate}</td>
              <td>{row.payable}</td>
            </tr>
          );
        })}
    </Table>
  );
}
