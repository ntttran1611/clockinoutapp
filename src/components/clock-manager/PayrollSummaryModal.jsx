import { formatDate } from "../../lib";
import { PayrollSummaryTable } from "./PayrollSummaryTable";

export function PayrollSummaryModal({ dateRange = null, onSubmit, list }) {
  return (
    <dialog id="PAYROLL_SUMMARY_MODAL" className="modal">
      <div className="modal-box w-8/12 max-w-5xl flex flex-col">
        <h3 className="font-bold text-lg text-sky-mist-100">
          Payroll Summary{" "}
          {dateRange &&
            `(${formatDate(dateRange.start)} - ${formatDate(dateRange.end)})`}
        </h3>
        <div className="relative h-96">
          <PayrollSummaryTable list={list} />
        </div>

        <div className="modal-action ">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={onSubmit}
              className="btn bg-sky-mist-100 text-white font-light font-vietnam mr-2 tracking-wide"
            >
              Export to Excel
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
