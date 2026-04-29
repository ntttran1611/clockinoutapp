import { formatDecimal } from "../../lib";

export default function WageSummaryDisplay({
  dateRange,
  totalWorkingHours,
  selectedStaff,
}) {
  if (!dateRange || !totalWorkingHours || !selectedStaff) {
    alert("Error: Undefined items");
    return;
  }
  const staffPayRate = selectedStaff.payRateCents / 100;
  return (
    <section className="h-auto py-3 px-10 bg-sky-mist-50 rounded-lg shadow-xl text-text-primary">
      <p>
        <b>
          Wage Summary from {dateRange.start} to {dateRange.end}
        </b>
      </p>
      <p>Total working hours: {formatDecimal(totalWorkingHours)}h</p>
      <p>Pay rate: ${formatDecimal(staffPayRate)}/h</p>
      <p>
        <b>Total payable amount (before tax):</b> $
        {formatDecimal(totalWorkingHours * staffPayRate)}
      </p>
    </section>
  );
}
