import { formatDecimal, formatDate } from "../../lib";
import { LoadingSpinner } from "../../components";

export default function WageSummaryDisplay({
  wageSnapshot,
  selectedStaff,
  hasUnverifiedClocks,
}) {
  if (!wageSnapshot || !selectedStaff) {
    return;
  }
  const staffPayRate = selectedStaff.payRateCents / 100;

  if (hasUnverifiedClocks) {
    return (
      <section className="h-auto py-3 px-10 bg-almond-40 rounded-lg shadow-xl">
        <p className="text-mocha font-medium text-sm italic">
          Cannot calculate wage with unverified or unfinished clocks. Please
          review or close them first.
        </p>
      </section>
    );
  }
  return (
    <section className="h-auto py-3 px-10 bg-sky-mist-50 rounded-lg shadow-xl text-text-primary text-sm flex gap-2 flex-col">
      <p>
        <b>
          Wage Summary from {formatDate(wageSnapshot.startDate)} to{" "}
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
    </section>
  );
}
