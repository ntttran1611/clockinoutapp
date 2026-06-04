import { formatPayrollTableRow, PAYROLL_TABLE_HEADERS } from "../../lib";
import { Table } from "../Table";

/**
 * @description Renders a payroll summary row table using formatted payroll data.
 * @param {Object} props
 * @param {Array} props.list - Payroll items to render as table rows.
 * @returns {JSX.Element} A table containing payroll summary rows.
 */
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
