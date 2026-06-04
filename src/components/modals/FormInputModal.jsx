/**
 *
 * @param {string} id - The unique identifier for the modal
 * @param {string} heading - The heading text to display in the modal
 * @param {JSX.Element} children - The content to display inside the modal
 * @param {function} onSubmit - The function to execute when the user confirms the action
 * @param {function} onClose - The function to execute when the modal is closed
 * @param {boolean} disableConfirmation - A flag to disable the confirmation button
 * @returns {JSX.Element} A React component representing the form modal
 *
 * This component renders a modal dialog that contains a form or any content passed as children.
 */

export default function FormInputModal({
  id,
  heading,
  onSubmit,
  children,
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
          className={`font-bold text-lg text-sky-mist-100  flex items-center gap-1`}
        >
          {heading}
        </h3>
        {children}
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className={`btn bg-sky-mist-100 text-white font-light font-vietnam mr-2 tracking-wide`}
              onClick={onSubmit}
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
