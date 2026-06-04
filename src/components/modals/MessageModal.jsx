import { forwardRef } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { IoAlertCircle } from "react-icons/io5";
/**
 * @param {string} id - The unique identifier for the modal
 * @param {string} heading - The heading text to display in the modal
 * @param {string} message - The message content to display in the modal
 * @param {string} status - The status of the message (e.g., "success", "error", "warning")
 * @param {JSX.Element} icon - The icon to display alongside the message
 * @returns {JSX.Element} A React component representing the message modal
 *
 * This component renders a modal dialog that displays a message to the user,
 * along with an optional icon and status-based styling.
 * The modal can be used to inform users of the outcome of an action, such as success or failure.
 * It can also show users important information.
 */
export default forwardRef(function MessageModal({ content }, ref) {
  const { heading, message, status } = content;
  const statusColor = () => {
    switch (status) {
      case "error":
        return "alert";
      default:
        return "sky-mist-100";
    }
  };

  const icon = () => {
    switch (status) {
      case "error":
        return <IoAlertCircle className="h-6 w-6" />;
      case "success":
        return <BiCheckCircle className="h-6 w-6" />;
      default:
        return null;
    }
  };
  return (
    <dialog ref={ref} id="MESSAGE_MODAL" className="modal">
      <div className="modal-box font-vietnam">
        <h3
          className={`font-bold text-sm text-${statusColor()} flex items-center gap-1`}
        >
          {icon && <span className="mr-2 h-6 w-6">{icon()}</span>}
          {heading}
        </h3>
        <p className="py-4 text-text-primary">{message}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});
