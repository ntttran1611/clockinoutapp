import { FormInput } from "../FormInput";
import { FormModal } from "../Modal";
import { Toggle } from "../Toggle";
import { FormTimeInput } from "../FormTimeInput";
import { validateString } from "../../lib";
import { useState, useEffect } from "react";
import { FormErrorMessage } from "../FormErrorMessage";

export function BranchFormModal({ onClose, onSubmit, formData, setFormData }) {
  const [disableConfirmation, setDisableConfirmation] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (formData.name.trim() === "") {
      setDisableConfirmation(true);
      setErrorMessage("Branch name is required.");
    } else {
      setErrorMessage("");
      setDisableConfirmation(false);
    }
  }, [formData.name]);
  return (
    <FormModal
      disableConfirmation={disableConfirmation}
      id="BRANCH_FORM_MODAL"
      heading={
        formData.id ? `Editing Branch #${formData.name}` : `Adding a new branch`
      }
      action={onSubmit}
      color="sky-mist-100"
      onClose={onClose}
    >
      <section className="flex flex-col gap-3 py-5">
        <FormErrorMessage message={errorMessage} />
        <div className="flex gap-4">
          <FormInput
            label="Branch name"
            name="Branch name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Toggle
            label="Active: "
            isChecked={formData.isActive}
            onToggle={() =>
              setFormData({ ...formData, isActive: !formData.isActive })
            }
          />
        </div>
        <FormTimeInput
          label="Opening time: "
          value={formData.startTime}
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })
          }
        />
        <FormTimeInput
          label="Closing time: "
          value={formData.endTime}
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })
          }
        />
      </section>
    </FormModal>
  );
}
