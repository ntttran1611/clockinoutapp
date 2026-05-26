import {
  ManagerLayout,
  SearchInput,
  ToolBarContainer,
  NewVersionButton,
  TableContainer,
  StaffTable,
  AlertModal,
  ErrorModal,
  SuccessModal,
  LoadingSpinner,
} from "../components";
import { Select } from "../components/Select";
import { StaffFormModal } from "../components/staff-manager/StaffFormModal";
import {
  useStaffList,
  useAddStaffMutation,
  useEditStaffMutation,
  useDeleteStaffMutation,
} from "../hooks";
import { useState, useEffect } from "react";
import { formatDecimal, validateString } from "../lib";

/**
 * 
 * TODO
 * Input validation
 * Delete staff
 */

export default function StaffManager() {
  const initialFormData = {
    email: "",
    password: "",
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
  const [modalContent, setModalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false)

  //staff data query
  const { staffList, staffListIsFetching, refetchStaffList } = useStaffList(
    staffStatusFilter,
    searchKeyword,
  );

  //mutations
  const addStaffMutation = useAddStaffMutation();
  const editStaffMutation = useEditStaffMutation();
  const deleteStaffMutation = useDeleteStaffMutation();

  const openFormModal = (staff) => {
    setFormData(
      !staff
        ? initialFormData
        : {
            email: staff.email,
            password: staff.id,
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

  const handleStaffSubmit = async (e) => {
    setIsLoading(true);
    let payRateCents = 0;
    if (!(formData.payRate === "" || isNaN(formData.payRate))) {
      // Pay rate is already auto-corrected on input change
      payRateCents = parseInt(Math.round(parseFloat(formData.payRate) * 100));
    } else {
      payRateCents = 0; // Default to 0 if empty or invalid
    }

    const staffData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      payRateCents: payRateCents,
      isActive: formData.isActive,
      availability: formData.availability,
    };

    try {
      // Check if this is add or edit
      if (formData.loginId) {
        // Edit existing staff
        await editStaffMutation.mutateAsync({
          ...staffData,
          id: formData.loginId,
        });

        setModalContent("Staff details updated successfully.");
      } else {
        const addResult = await addStaffMutation.mutateAsync({
          ...staffData,
          email: formData.email.trim(),
          password: formData.password,
        });

        setModalContent(
          `New staff added successfully.`,
        );
      }
      setIsLoading(false);
      document.querySelector("#SUCCESS_MODAL").showModal();
    } catch (err) {
      setModalContent(
        err?.message || "An unexpected error occurred. Please try again.",
      );
      setIsLoading(false);
      document.querySelector("#ERROR_MODAL").showModal();
    }

    setFormData(initialFormData);
  };

  const openDeleteModal = (staff) => {
    if (!staff) return;
    setFormData({
      ...initialFormData,
      loginId: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
    });
    document.querySelector("#delete-staff-modal").showModal();
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      const result = await deleteStaffMutation.mutateAsync(staffId);

      if (result.success) {
        setModalContent(result.message);
        document.querySelector("#SUCCESS_MODAL").showModal();
      } else {
        setModalContent(result.message);
        document.querySelector("#ERROR_MODAL").showModal();
      }
    } catch (err) {
      setModalContent("An unexpected error occurred. Please try again.");
      document.querySelector("#ERROR_MODAL").showModal();
    }
  };

  const handleViewClockHistory = (staffId) => {
    navigate(`/admin/clocks?staffId=${staffId}`);
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
        onClose={() => setFormData(initialFormData)}
        onSubmit={handleStaffSubmit}
        setFormData={setFormData}
        isEditing={isEditing}
      />
      <AlertModal
        id="delete-staff-modal"
        color="alert"
        action={() =>
          formData.loginId && handleDeleteStaff(parseInt(formData.loginId))
        }
        heading="Attention before deleting staff"
        content={`Are you sure you want to delete ${formData.firstName} ${formData.lastName}? All related clock-in/out records will also be deleted and this action cannot be undone.`}
      />
      <AlertModal
        id="CLOCK_RUNNING_MODAL"
        color="alert"
        heading="Cannot Delete Staff"
        content={modalContent}
      />
      <ErrorModal
        id="ERROR_MODAL"
        content={modalContent}
        heading="Error happened when processing request"
      />
      <SuccessModal
        id="SUCCESS_MODAL"
        content={modalContent}
        heading="Request processed successfully"
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
          <NewVersionButton disabled={isLoading ? true : undefined} onClick={() => openFormModal(null)}>
            {isLoading ? "Adding staff..." : "Add a new member"}
          </NewVersionButton>
        </ToolBarContainer>
        <TableContainer>
          <div className="flex justify-between">
            <p className="ml-4 text-xs text-mocha-50">
              Total staff: {staffList.length}
            </p>
            {isLoading && 
            <div className="flex items-center"><LoadingSpinner size="sm" /> <p className="ml-4 text-xs text-mocha-50">Processing request...</p></div>}
            
          </div>
          <div className="relative flex-1">
            <StaffTable
              staffList={staffList}
              isFetching={staffListIsFetching}
              onEditStaff={openFormModal}
              onDeleteStaff={openDeleteModal}
              onViewClockHistory={handleViewClockHistory}
            />
          </div>
        </TableContainer>
      </ManagerLayout>
    </>
  );
}
