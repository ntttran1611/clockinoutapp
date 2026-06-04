import { forwardRef } from "react";

/**
 * @description Renders a simple information modal with an optional action button.
 * @param {string} id - The unique identifier for the modal.
 * @param {string} heading - The title displayed at the top of the modal.
 * @param {JSX.Element} children - The content rendered inside the modal.
 * @param {JSX.Element} icon - Optional icon displayed next to the heading.
 * @param {string} color - Optional heading color token.
 * @param {Function} action - Optional callback invoked when the action button is clicked.
 * @param {string} actionText - Optional label for the action button.
 * @returns {JSX.Element} A modal dialog with a close button and optional action button.
 */

export default forwardRef(function InformationModal(
  {
    id,
    heading,
    children,
    icon,
    color = "sky-mist-100",
    action,
    actionText = "Confirm",
  },
  ref,
) {
  return (
    <dialog ref={ref} id={id} className="modal">
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
            {action && (
              <button
                type="button"
                className="btn bg-sky-mist-100 text-white font-light font-vietnam mr-2 tracking-wide"
                onClick={action}
              >
                {actionText}
              </button>
            )}
            <button className="btn text-text-primary border-none bg-secondary-bg font-light tracking-wide">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
});
