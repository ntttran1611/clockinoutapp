import TimeRecord from "./TimeRecord";
export default function TimeHolder({ timeHolder }) {
  return (
    <div className="w-full text-center text-text-secondary font-vietnam font-extralight text-sm">
      {timeHolder === undefined ||
      timeHolder === null ||
      timeHolder.length == 0 ? (
        "No time recorded"
      ) : (
        <ul className="max-h-80 overflow-y-auto p-2 no-scrollbar">
          {timeHolder.map(({ id, startTime, endTime, totalHours, staffId }) => {
            return (
              <li key={id} className="mb-3">
                <TimeRecord
                  startTime={startTime}
                  endTime={endTime}
                  workingHours={totalHours}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
