import { FormModal } from "../Modal";
import {
  FormInput,
  NewVersionButton,
  Toggle,
  Checkbox,
} from "../../components";
import { useState } from "react";

export function StaffFormModal({ onClose, onSubmit, formData, setFormData }) {
  return (
    <FormModal
      id="staff-form-modal"
      heading={
        formData.loginId ? `Edit Staff #${formData.loginId}` : "Add New Staff"
      }
      action={onSubmit}
      color="sky-mist-100"
      onClose={onClose}
    >
      <section className="flex flex-col gap-3 py-5">
        <div className="flex gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>
        <div className="flex gap-4">
          <FormInput
            label="Pay Rate"
            name="payRate"
            value={formData.payRate}
            onChange={(e) =>
              setFormData({ ...formData, payRate: e.target.value })
            }
          />
          <Toggle
            label="Active:"
            isChecked={formData.isActive}
            onToggle={() =>
              setFormData({ ...formData, isActive: !formData.isActive })
            }
          />
        </div>
        <label className="label text-sm px-3 py-1">Availability</label>
        <div className="grid grid-cols-3 gap-4 px-3">
          <Checkbox
            label="Monday"
            isChecked={formData.availability?.monday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Tuesday"
            isChecked={formData.availability?.tuesday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Wednesday"
            isChecked={formData.availability?.wednesday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Thursday"
            isChecked={formData.availability?.thursday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Friday"
            isChecked={formData.availability?.friday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Saturday"
            isChecked={formData.availability?.saturday || false}
            onChange={() => {}}
          />
          <Checkbox
            label="Sunday"
            isChecked={formData.availability?.sunday || false}
            onChange={() => {}}
          />
        </div>
      </section>
    </FormModal>
  );
}
