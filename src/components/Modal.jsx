import { IoAlertCircle } from "react-icons/io5";

export default function AlertModal({ id, action, heading, content }) {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box font-vietnam">
        <h3 className="font-bold text-lg text-alert flex items-center gap-1">
          <IoAlertCircle className="h-6 w-6" />

          {heading}
        </h3>
        <p className="py-4 text-text-primary">{content}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn bg-alert text-white font-light font-vietnam mr-2 tracking-wide"
              onClick={action}
            >
              Confirm
            </button>
            <button className="btn text-black border-none bg-secondary-bg font-light tracking-wide">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
