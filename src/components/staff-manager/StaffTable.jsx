import { formatStaffTableRow } from "../../lib/dashboardUtils";
import { Table } from "../Table";
import { STAFF_TABLE_HEADERS } from "../../lib/dashboardConstants";
import { LuFolderClock } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { NewVersionButton } from "../NewVersionButton";

export function StaffTable({
  staffList,
  isFetching,
  onViewClockHistory,
  onEditStaff,
  onDeleteStaff,
}) {
  return (
    <Table
      headers={STAFF_TABLE_HEADERS}
      isFetching={isFetching}
      itemList={staffList}
      isZebra={true}
    >
      {staffList.map((staff) => {
        const row = formatStaffTableRow(staff);
        return (
          <tr key={staff.id}>
            <td>
              {row.status ? (
                <div className="bg-sky-mist-80 px-3 py-1 rounded-full text-white text-xs w-fit">
                  Active
                </div>
              ) : (
                <div className="bg-almond-40 px-3 py-1 rounded-full text-text-primary text-xs w-fit">
                  Inactive
                </div>
              )}
            </td>
            <td>{row.loginId}</td>
            <td>{row.name}</td>
            <td>{row.payRate}</td>
            <td>{row.availability}</td>
            <td className="flex gap-2">
              <NewVersionButton
                className="text-sky-mist-100 hover:text-sky-mist-80"
                size="xs"
                intent="text"
                onClick={() => onViewClockHistory(staff.id)}
              >
                View
              </NewVersionButton>{" "}
              |
              <NewVersionButton
                className="text-mocha hover:text-mocha-80"
                size="xs"
                intent="text"
                onClick={() => onEditStaff(staff.id)}
              >
                Edit
              </NewVersionButton>{" "}
              |
              <NewVersionButton
                className="text-alert hover:text-alert-80"
                size="xs"
                intent="text"
                onClick={() => onDeleteStaff(staff.id)}
              >
                Delete
              </NewVersionButton>
            </td>
          </tr>
        );
      })}
    </Table>
  );
}
