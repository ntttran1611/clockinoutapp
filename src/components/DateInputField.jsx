export default function DateInputField({
  dateObject,
  onDayChange,
  onMonthChange,
  onYearChange,
  dayFormatting,
  monthFormatting,
  yearFormatting,
}) {
  return (
    <div className="flex font-vietnam text-text-secondary text-sm rounded-sm border-text-secondary border w-min py-1 px-8">
      <input
        onBlur={dayFormatting}
        maxLength={2}
        value={dateObject.day}
        onChange={onDayChange}
        className="hover:outline-none focus:outline-none w-5 text-center"
      />
      <span>/</span>
      <input
        onBlur={monthFormatting}
        maxLength={2}
        value={dateObject.month}
        onChange={onMonthChange}
        className="hover:outline-none focus:outline-none w-5 text-center"
      />
      <span>/</span>
      <input
        onBlur={yearFormatting}
        maxLength={4}
        value={dateObject.year}
        onChange={onYearChange}
        className="hover:outline-none focus:outline-none w-10 text-center"
      />
    </div>
  );
}
