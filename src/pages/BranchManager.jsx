import { useState } from "react";
import { ManagerLayout, TableContainer, ToolBarContainer, SearchInput, NewVersionButton, BranchTable, BranchFormModal, AlertModal } from "../components";

export default function BranchManager() {
  const [isLoading, setIsLoading] = useState(false);
  const branchList = [{id: 1, isActive: true, name: "Sweeties Nails", startTime: "09:00:00", endTime: "17:00:00", note: "nothing"}]
  const openFormModal = () => {
    document.querySelector("#BRANCH_FORM_MODAL").showModal();
  }
  const openDeleteModal = () => {
    document.querySelector("#DELETE_BRANCH_MODAL").showModal();
  }
  return <>
    <BranchFormModal onSubmit={()=>{}} onClose={()=>{}} />
    <AlertModal
        id="DELETE_BRANCH_MODAL"
        color="alert"
        action={() => {}
        }
        heading="Attention before deleting branch"
        content={`Are you sure you want to delete this branch permanently?`}
      />
    <ManagerLayout tabTitle="Branch Manager">
      <ToolBarContainer>
        <div className="flex-1">
          <SearchInput
            placeholder="Branch name..."
            onChange={()=>{}}
          />
        </div>
        <NewVersionButton onClick={() => openFormModal()}>
          Add a new branch
        </NewVersionButton>
      </ToolBarContainer>
      <TableContainer>
        <div className="flex justify-between">
          <p className="ml-4 text-xs text-mocha-50">
            Total items: {branchList.length}
          </p>
          {isLoading && <div className="flex items-center"><LoadingSpinner size="sm" /> <p className="ml-4 text-xs text-mocha-50">Processing request...</p></div>}
                    
        </div>
        <div className="relative flex-1">
          <BranchTable branchList={branchList} isFetching={false} onEditBranch={openFormModal} onDeleteBranch={openDeleteModal}/>
        </div>
      </TableContainer>
    </ManagerLayout>
  </>;
}
