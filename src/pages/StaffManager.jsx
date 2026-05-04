import {
  ManagerLayout,
  SearchInput,
  ToolBarContainer,
  NewVersionButton,
  TableContainer,
  StaffTable,
} from "../components";
import { Select } from "../components/Select";
import { StaffFormModal } from "../components/staff-manager/StaffFormModal";
import { useStaffData } from "../hooks";
import { useState, useEffect } from "react";

export default function StaffManager() {
  const { staffList, isFetching } = useStaffData();
  const openModal = () => {
    document.querySelector("#staff-form-modal").showModal();
  };
  return (
    <>
      <StaffFormModal
        initialData={null}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {}}
      />
      <ManagerLayout tabTitle="Staff Manager">
        <ToolBarContainer>
          <div className="flex gap-4 flex-1">
            <Select
              selectLabel="Staff status"
              onChange={() => {}}
              list={[
                {
                  id: 1,
                  name: "All",
                },
                {
                  id: 2,
                  name: "Active",
                },
                {
                  id: 3,
                  name: "Inactive",
                },
              ]}
            />
            <SearchInput
              placeholder="Search for a staff name"
              value=""
              onChange={() => {}}
            />
          </div>
          <NewVersionButton onClick={() => openModal()}>
            Add new staff
          </NewVersionButton>
        </ToolBarContainer>
        <TableContainer>
          <StaffTable
            staffList={staffList}
            isFetching={isFetching}
            onEditStaff={openModal}
          />
        </TableContainer>
      </ManagerLayout>
    </>
  );
}
