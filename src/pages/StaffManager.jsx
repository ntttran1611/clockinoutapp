import {
  ManagerLayout,
  SearchInput,
  ToolBarContainer,
  NewVersionButton,
  TableContainer,
  StaffTable,
  AlertModal,
} from "../components";
import { Select } from "../components/Select";
import { StaffFormModal } from "../components/staff-manager/StaffFormModal";
import { useStaffData } from "../hooks";
import { useAddStaffMutation, useEditStaffMutation } from "../hooks/useStaff";
import { useState, useEffect } from "react";
import { formatDecimal, validateString } from "../lib";

export default function StaffManager() {
  const initialFormData = {
    loginId: null,
    firstName: "",
    lastName: "",
    payRate: "",
    isActive: true,
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  };
  const [staffStatusFilter, setStaffStatusFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  //staff data query
  const { staffList, staffListIsFetching, refetchStaffList } = useStaffData(
    staffStatusFilter,
    searchKeyword,
  );
  //mutations
  const addStaffMutation = useAddStaffMutation();
  const editStaffMutation = useEditStaffMutation();

  const openFormModal = (staff) => {
    setFormData(
      !staff
        ? initialFormData
        : {
            loginId: staff.id,
            firstName: staff.firstName,
            lastName: staff.lastName,
            payRate: formatDecimal(staff.payRateCents / 100) || "",
            isActive: staff.isActive,
            availability: staff.availability,
          },
    );
    document.querySelector("#staff-form-modal").showModal();
  };

  const closeFormModal = () => {
    document.querySelector("#staff-form-modal").close();
    setFormData(initialFormData);
  };

  const handleStaffSubmit = async () => {
    // Validate first name
    if (!validateString(formData.firstName)) {
      alert("First Name is required and cannot be empty");
      return;
    }

    // Validate last name
    if (!validateString(formData.lastName)) {
      alert("Last Name is required and cannot be empty");
      return;
    }

    // Pay rate is already auto-corrected on input change
    const payRateCents = Math.round(parseFloat(formData.payRate) * 100);

    const staffData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      payRateCents: payRateCents,
      isActive: formData.isActive,
      availability: formData.availability,
    };

    // Check if this is add or edit
    if (formData.loginId) {
      // Edit existing staff
      await editStaffMutation.mutateAsync({
        ...staffData,
        id: formData.loginId,
      });
    } else {
      // Add new staff
      await addStaffMutation.mutateAsync(staffData);
    }

    closeFormModal();
  };

  const openDeleteModal = () => {
    document.querySelector("#delete-staff-modal").showModal();
  };
  const onStatusFilterChange = (e) => {
    switch (e.target.value) {
      case "1":
        setStaffStatusFilter("all");
        break;
      case "2":
        setStaffStatusFilter("active");
        break;
      case "3":
        setStaffStatusFilter("inactive");
        break;
      default:
        setStaffStatusFilter("all");
    }
  };
  useEffect(() => {
    refetchStaffList();
  }, [staffStatusFilter, searchKeyword]);

  return (
    <>
      <StaffFormModal
        formData={formData}
        onClose={closeFormModal}
        onSubmit={handleStaffSubmit}
        setFormData={setFormData}
      />
      <AlertModal
        id="delete-staff-modal"
        color="alert"
        action={() => {}}
        heading="Attention before deleting staff"
        content="Are you sure you want to delete this staff member?"
      />
      <ManagerLayout tabTitle="Staff Manager">
        <ToolBarContainer>
          <div className="flex gap-4 flex-1">
            <Select
              selectLabel="Staff status"
              onChange={onStatusFilterChange}
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
              placeholder="Staff name..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <NewVersionButton onClick={() => openFormModal(null)}>
            Add new staff
          </NewVersionButton>
        </ToolBarContainer>
        <TableContainer>
          <StaffTable
            staffList={staffList}
            isFetching={staffListIsFetching}
            onEditStaff={openFormModal}
            onDeleteStaff={openDeleteModal}
            onViewClockHistory={() => {}}
          />
        </TableContainer>
      </ManagerLayout>
    </>
  );
}
