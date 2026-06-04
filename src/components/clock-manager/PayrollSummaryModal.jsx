import { forwardRef } from "react";
import { formatDate } from "../../lib";
import { InformationModal } from "../modals";
import { PayrollSummaryTable } from "./PayrollSummaryTable";

/**
 * @description Displays the payroll summary table inside a reusable information modal.
 * @param {Object} props
 * @param {{start: string, end: string}|null} props.dateRange - The selected payroll date range.
 * @param {Function} props.onSubmit - Callback for the export action.
 * @param {Array} props.list - The payroll data list to render.
 * @param {React.Ref} ref - Ref forwarded to the modal dialog.
 * @returns {JSX.Element} The payroll summary modal.
 */
export const PayrollSummaryModal = forwardRef(function PayrollSummaryModal(
  { dateRange = null, onSubmit, list },
  ref,
) {
  return (
    <InformationModal
      ref={ref}
      id="PAYROLL_SUMMARY_MODAL"
      heading={`Payroll Summary ${
        dateRange
          ? `(${formatDate(dateRange.start)} - ${formatDate(dateRange.end)})`
          : ""
      }`}
    >
      <div className="relative h-96">
        <PayrollSummaryTable list={list} />
      </div>
    </InformationModal>
  );
});
