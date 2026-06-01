import { BRANCH_TABLE_HEADERS, formatBranchTableRow } from "../../lib";
import { Table } from "../Table";
import { NewVersionButton } from "../../components";

export function BranchTable({branchList, isFetching, onEditBranch, onDeleteBranch}) {
    return <Table headers={BRANCH_TABLE_HEADERS} isFetching={isFetching} itemList={branchList} isZebra={true}>
        {
            branchList.map((branch) => {
                const row = formatBranchTableRow(branch);
                return <tr key={row.id}>
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
                        <td>{row.name}</td>
                        <td>{row.openingTime}</td>
                        <td>{row.closingTime}</td>
                        <td className="flex gap-2">
                            <NewVersionButton
                                className="text-mocha hover:text-mocha-80"
                                size="xs"
                                intent="text"
                                onClick={() => onEditBranch(branch)}
                            >
                                Edit
                            </NewVersionButton>{" "}
                            |
                            <NewVersionButton
                                className="text-alert hover:text-alert-80"
                                size="xs"
                                intent="text"
                                onClick={() => onDeleteBranch(branch)}
                            >
                                Delete
                            </NewVersionButton>
                        </td>
                </tr>
            })
        }
    </Table>
}