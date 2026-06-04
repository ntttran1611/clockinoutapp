import { forwardRef } from "react";
import { IoAlertCircle } from "react-icons/io5";
/**
 *
 * @param {function} action - The function to execute when the user confirms the action
 * @param {string} heading - The heading text to display in the modal
 * @param {string} message - The message content to display in the modal
 * @returns {JSX.Element} A React component representing the alert modal
 *
 * This component renders a modal dialog that prompts the user to confirm an action.
 * It displays a heading, a message, and two buttons: "Confirm" and "Close".
 * When the user clicks "Confirm", the provided action function is executed.
 * The modal can be used to warn users about potential consequences before they proceed with an action.
 */
export default forwardRef(function AlertBeforeActionModal({ content }, ref) {
  const { action, heading, message } = content;
  return (
    <dialog
      ref={ref}
      id="ALERT_BEFORE_ACTION_MODAL"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box font-vietnam ">
        <h3 className={`font-bold text-lg text-mocha flex items-center gap-1`}>
          <IoAlertCircle className="h-6 w-6" />
          {heading}
        </h3>
        <p className="py-4 text-text-primary">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className={`btn bg-mocha text-white font-light font-vietnam mr-2 tracking-wide`}
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
});
