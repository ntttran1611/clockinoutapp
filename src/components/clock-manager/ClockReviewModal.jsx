import { formatDate, formatTime } from "../../lib";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { TimeInput, FormErrorMessage, FormInputModal } from "../../components";

export default function ClockReviewModal({ staff, clock, onConfirm, onClose }) {
  if (!staff || !clock) {
    alert("Error: Undefined clock or staff");
    return;
  }

  const [tempEndTime, setTempEndTime] = useState(formatTime(clock.endTime));
  const [isEditingEndTime, setIsEditingEndTime] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fullEndDateTime = (() => {
    const shiftDate = dayjs(clock.startTime).format("YYYY-MM-DD");
    return dayjs(
      `${shiftDate} ${tempEndTime}`,
      "YYYY-MM-DD HH:mm",
    ).toISOString();
  })();

  useEffect(() => {
    // Validate that end time is not less than start time
    if (dayjs(fullEndDateTime).isBefore(dayjs(clock.startTime))) {
      setErrorMessage(
        "Make sure end time is LATER than start time. If not, this clock cannot be approved.",
      );
    } else {
      setErrorMessage("");
    }
  }, [fullEndDateTime, clock.startTime]);

  const handleCancelEdit = () => {
    setIsEditingEndTime(false);
    setTempEndTime(formatTime(clock.endTime));
  };

  const handleVerifyEndTime = () => {
    if (errorMessage.length > 0) {
      return;
    }

    onConfirm({
      ...clock,
      endTime: fullEndDateTime,
      clockoutMethod: "admin-verified",
    });
  };

  return (
    <FormInputModal
      id="CLOCK_REVIEW_MODAL"
      heading="Unclose Shift Review"
      onSubmit={handleVerifyEndTime}
      onClose={onClose}
    >
      <section className="flex flex-col gap-2 py-3 text-text-primary">
        <hr className="text-mocha-30"></hr>
        <p>
          <b>Staff</b>: {staff.firstName} {staff.lastName}
        </p>
        <p>
          <b>Shift date:</b> {formatDate(clock.startTime)}
        </p>
        <p>
          <b>Shift started at:</b> {formatTime(clock.startTime)}
        </p>

        <section className="flex gap-2 items-center">
          <b>Shift closed at:</b>{" "}
          {!isEditingEndTime ? (
            <span className="flex gap-1">
              <span className="font-bold text-alert">
                {formatTime(clock.endTime)} |{" "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsEditingEndTime(true);
                }}
                className="text-mocha underline text-sm font-bold"
              >
                EDIT
              </button>
            </span>
          ) : (
            <div className="flex gap-2 items-center mt-2">
              <TimeInput
                id="endTime"
                defaultValue={tempEndTime}
                onChange={(e) => setTempEndTime(e.target.value)}
              />
              <button
                onClick={handleCancelEdit}
                className="btn btn-sm bg-mocha-30 text-mocha font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </section>
        <FormErrorMessage message={errorMessage} />
      </section>
    </FormInputModal>
  );
}
