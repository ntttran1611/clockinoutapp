import { forwardRef } from "react";
import { LoadingSpinner } from "../LoadingSpinner";

export default forwardRef(function LoadingModal({}, ref) {
  return (
    <dialog id="LOADING_MODAL" className="modal" ref={ref}>
      <div className="modal-box">
        <h3 className="font-bold text-lg text-mocha flex gap-5">
          <LoadingSpinner size="sm" />
          Processing request...
        </h3>
      </div>
    </dialog>
  );
});
