import { InfoModal } from "../Modal";
import { formatDate, formatDecimal } from "../../lib";
import { CgFileDocument } from "react-icons/cg";
import { MessageModal } from "../../components";

export function IndividualPayrollModal({ staff, wageSnapshot }) {
  if (!staff || !wageSnapshot) {
    return;
  }
  const staffPayRate = staff.payRateCents / 100;
  return (
    <InfoModal
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
          Total working hours: {formatDecimal(wageSnapshot.totalWorkingHours)}h
        </p>
        <p>Pay rate: ${formatDecimal(staffPayRate)}/h</p>
        <p>
          <b>Total payable amount (before tax):</b> $
          {formatDecimal(wageSnapshot.totalWorkingHours * staffPayRate)}
        </p>
      </div>
    </InfoModal>
  );
}
