import { forwardRef } from "react";
import { formatDate, formatDecimal } from "../../lib";
import { CgFileDocument } from "react-icons/cg";
import { InformationModal } from "../modals";

/**
 * @description Displays individual payroll summary details in an information modal.
 * @param {Object} props
 * @param {Object} props.staff - The staff member whose payroll is being shown.
 * @param {Object} props.wageSnapshot - The payroll snapshot data.
 * @param {React.Ref} ref - Ref forwarded to the modal dialog.
 * @returns {JSX.Element|undefined} The individual payroll modal or undefined when required props are missing.
 */
export const IndividualPayrollModal = forwardRef(
  function IndividualPayrollModal({ staff, wageSnapshot }, ref) {
    if (!staff || !wageSnapshot) {
      return;
    }
    const staffPayRate = staff.payRateCents / 100;
    return (
      <InformationModal
        ref={ref}
        id="INDIVIDUAL_PAYROLL_MODAL"
        heading={`Payroll Summary for ${staff.firstName} ${staff.lastName}`}
        icon={<CgFileDocument className="h-6 w-6" />}
      >
        <div className="flex flex-col gap-2 text-sm text-text-primary">
          <p>
            <b>
              From {formatDate(wageSnapshot.startDate)} to{" "}
              {formatDate(wageSnapshot.endDate)}
            </b>
          </p>
          <p>
            Total working hours: {formatDecimal(wageSnapshot.totalWorkingHours)}
            h
          </p>
          <p>Pay rate: ${formatDecimal(staffPayRate)}/h</p>
          <p>
            <b>Total payable amount (before tax):</b> $
            {formatDecimal(wageSnapshot.totalWorkingHours * staffPayRate)}
          </p>
        </div>
      </InformationModal>
    );
  },
);
