import { useState } from "react";
import {
  ManagerLayout,
  TableContainer,
  ToolBarContainer,
  SearchInput,
  NewVersionButton,
  BranchTable,
  BranchFormModal,
  AlertModal,
  SuccessModal,
  ErrorModal,
} from "../components";
import {
  useBranchList,
  useAddBranchMutation,
  useEditBranchMutation,
  useDeleteBranchMutation,
} from "../hooks";
import { LoadingSpinner } from "../components";

export default function BranchManager() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { branchList, branchListIsFetching, refetchBranchList } =
    useBranchList(searchKeyword);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const addBranchMutation = useAddBranchMutation();
  const editBranchMutation = useEditBranchMutation();
  const deleteBranchMutation = useDeleteBranchMutation();
  const [formData, setFormData] = useState({
    name: "",
    startTime: "09:00:00",
    endTime: "17:00:00",
    isActive: true,
  });
  const openFormModal = (branchData) => {
    if (branchData) {
      setFormData({
        id: branchData.id,
        name: branchData.name,
        startTime: branchData.startTime,
        endTime: branchData.endTime,
        isActive: branchData.isActive,
      });
    }
    document.querySelector("#BRANCH_FORM_MODAL").showModal();
  };
  const openDeleteModal = (branch) => {
    setSelectedBranch(branch);
    document.querySelector("#DELETE_BRANCH_MODAL").showModal();
  };
  const submitForm = async () => {
    setIsLoading(true);
    let response;
    try {
      if (formData.id) {
        response = await editBranchMutation.mutateAsync({
          branchData: formData,
        });
      } else {
        response = await addBranchMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error("Error editing/adding branch:", error);
      showStatusModal("error");
    } finally {
      setIsLoading(false);
      setFormData({
        name: "",
        startTime: "09:00:00",
        endTime: "17:00:00",
        isActive: true,
      });
      showStatusModal(response?.status);
    }
  };
  const onCloseFormModal = () => {
    setFormData({
      name: "",
      startTime: "09:00:00",
      endTime: "17:00:00",
      isActive: true,
    });
  };
  const deleteBranch = async () => {
    setIsLoading(true);
    let response;
    try {
      response = await deleteBranchMutation.mutateAsync(selectedBranch.id);
    } catch (error) {
      console.error("Error deleting branch:", error);
      showStatusModal("error");
    } finally {
      setIsLoading(false);
      setSelectedBranch(null);
      showStatusModal(response?.status);
    }
  };
  const showStatusModal = (status) => {
    if (status === "success") {
      document.querySelector("#SUCCESS_MODAL").showModal();
    } else if (status === "error") {
      document.querySelector("#ERROR_MODAL").showModal();
    }
  };

  return (
    <>
      <BranchFormModal
        onSubmit={submitForm}
        onClose={onCloseFormModal}
        formData={formData}
        setFormData={setFormData}
      />
      <SuccessModal
        id="SUCCESS_MODAL"
        color="success"
        heading="Success"
        content="Request has been processed successfully!"
      />
      <ErrorModal
        id="ERROR_MODAL"
        color="error"
        heading="Error"
        content="An error occurred while processing your request."
      />
      <AlertModal
        id="DELETE_BRANCH_MODAL"
        color="alert"
        action={deleteBranch}
        heading="Attention before deleting branch"
        content={`Are you sure you want to delete ${selectedBranch?.name || "the selected branch"} permanently?`}
      />
      <ManagerLayout tabTitle="Branch Manager">
        <ToolBarContainer>
          <div className="flex-1">
            <SearchInput
              value={searchKeyword}
              placeholder="Branch name..."
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <NewVersionButton
            onClick={() => openFormModal()}
            disabled={isLoading}
          >
            Add a new branch
          </NewVersionButton>
        </ToolBarContainer>
        <TableContainer>
          <div className="flex justify-between">
            <p className="ml-4 text-xs text-mocha-50">
              Total items: {branchList.length}
            </p>
            {isLoading && (
              <div className="flex items-center">
                <LoadingSpinner size="sm" />{" "}
                <p className="ml-4 text-xs text-mocha-50">
                  Processing request...
                </p>
              </div>
            )}
          </div>
          <div className="relative flex-1">
            <BranchTable
              branchList={branchList}
              isRequestLoading={isLoading}
              isFetching={branchListIsFetching}
              onEditBranch={openFormModal}
              onDeleteBranch={openDeleteModal}
            />
          </div>
        </TableContainer>
      </ManagerLayout>
    </>
  );
}
