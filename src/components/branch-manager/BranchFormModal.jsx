import { FormInput } from "../FormInput";
import { FormModal } from "../Modal";
import { Toggle } from "../Toggle";
import {FormTimeInput} from "../FormTimeInput"

export function BranchFormModal({onClose, onSubmit}) {
    return <FormModal id="BRANCH_FORM_MODAL" heading="Adding a new branch" action={onSubmit()} color="sky-mist-100" onClose={onClose()} disableConfirmation={true}>
        <section className="flex flex-col gap-3 py-5">
            <div className="flex gap-4">
                <FormInput label="Branch name" name="Branch name" onChange={()=>{}} />
                <Toggle label="Active: " isChecked={true} onToggle={()=>{}} />
            </div>
            <FormTimeInput label="Opening time: " defaultValue={"09:00:00"} onChange={()=>{}} />
            <FormTimeInput label="Closing time: " defaultValue={"17:00:00"} onChange={()=>{}} />
            
            
        </section>

    </FormModal>
}