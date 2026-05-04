import { FormModal } from "../Modal";
import {
  FormInput,
  NewVersionButton,
  Toggle,
  Checkbox,
} from "../../components";

export function StaffFormModal({ onClose, onSubmit, initialData }) {
  return (
    <FormModal
      id="staff-form-modal"
      heading={initialData ? "Edit Staff" : "Add New Staff"}
      action={onSubmit}
      color="sky-mist-100"
      onClose={onClose}
    >
      <section className="flex flex-col gap-3 py-5">
        <div className="flex gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={initialData?.firstName || ""}
            onChange={() => {}}
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={initialData?.lastName || ""}
            onChange={() => {}}
          />
        </div>
        <div className="flex gap-4">
          <FormInput
            label="Pay Rate"
            name="payRate"
            value={initialData?.payRate || ""}
            onChange={() => {}}
          />
          <Toggle
            label="Active:"
            isChecked={initialData?.isActive || false}
            onToggle={() => {}}
          />
        </div>
        <label className="label text-sm px-3 py-1">Availability</label>
        <div className="grid grid-cols-3 gap-4 px-3">
          <Checkbox
            label="Monday"
            isChecked={initialData?.availability?.monday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Tuesday"
            isChecked={initialData?.availability?.tuesday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Wednesday"
            isChecked={initialData?.availability?.wednesday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Thursday"
            isChecked={initialData?.availability?.thursday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Friday"
            isChecked={initialData?.availability?.friday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Saturday"
            isChecked={initialData?.availability?.saturday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Sunday"
            isChecked={initialData?.availability?.sunday || false}
            onChange={() => {}}
          />
        </div>
      </section>
    </FormModal>
  );
}
