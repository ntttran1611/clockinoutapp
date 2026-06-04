import { IoAlertCircle } from "react-icons/io5";
import { NewVersionButton } from "./NewVersionButton";
import { FaCheckCircle } from "react-icons/fa";

export function AlertModal({
  id,
  action,
  heading,
  content,
  color,
  textContent,
  setTextContent,
  isWithTextNote,
}) {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box font-vietnam ">
        <h3
          className={`font-bold text-lg text-${color} flex items-center gap-1`}
        >
          <IoAlertCircle className="h-6 w-6" />
          {heading}
        </h3>
        <p className="py-4 text-mocha">{content}</p>
        {isWithTextNote && (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Leave a note here if needed..."
            className="textarea textarea-md w-full focus:outline-none"
          ></textarea>
        )}

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

export function InfoModal({
  id,
  heading,
  children,
  icon,
  color = "sky-mist-100",
}) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3
          className={`font-bold text-md text-${color} flex items-center gap-1 mb-4`}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {heading}
        </h3>
        {children}
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
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

export function SuccessModal({ id, heading, content }) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box font-vietnam">
        <h3 className="font-bold text-sm text-sky-mist-100 flex items-center gap-1">
          <FaCheckCircle className="h-6 w-6" />
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

export function FormModal({
  id,
  heading,
  action,
  children,
  color,
  onClose,
  disableConfirmation,
}) {
  return (
    <dialog
      id={id}
      className="modal modal-bottom sm:modal-middle"
      onClose={onClose}
    >
      <div className="modal-box font-vietnam ">
        <h3
          className={`font-bold text-lg text-${color}  flex items-center gap-1`}
        >
          {heading}
        </h3>
        {children}
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className={`btn bg-${color} text-white font-light font-vietnam mr-2 tracking-wide`}
              onClick={action}
              disabled={disableConfirmation}
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
