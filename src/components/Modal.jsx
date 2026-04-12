import { IoAlertCircle } from "react-icons/io5";

export function AlertModal({ id, action, heading, content, color }) {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box font-vietnam">
        <h3
          className={`font-bold text-lg text-${color} flex items-center gap-1`}
        >
          <IoAlertCircle className="h-6 w-6" />
          {heading}
        </h3>
        <p className="py-4 text-mocha">{content}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className={`btn bg-${color} text-white font-light font-vietnam mr-2 tracking-wide`}
              onClick={action}
            >
              Confirm
            </button>
            <button className="btn text-text-primary border-none bg-secondary-bg font-light tracking-wide">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export function ErrorModal({ id, heading, content }) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box font-vietnam">
        <h3 className="font-bold text-sm text-alert flex items-center gap-1">
          <IoAlertCircle className="h-6 w-6" />
          {heading}
        </h3>
        <p className="py-4 text-text-primary">{content}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
