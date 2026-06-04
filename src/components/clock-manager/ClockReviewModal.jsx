import { formatDate, formatTime } from "../../lib";
import dayjs from "dayjs";
import { forwardRef, useState, useEffect } from "react";
import { TimeInput, FormErrorMessage, FormInputModal } from "../../components";

/**
 * @description Renders an admin review modal for an unclosed shift, allowing the end time to be adjusted and confirmed.
 * @param {Object} staff: the selected staff that has the clock reviewed
 * @param {Object} clock: the clock that is being reviewed
 * @param {Function} onConfirm: the action happens when the user hits Confirm
 * @param {Function} onClose: the action happens when the user hits Close
 * @returns {JSX.Element}: A modal that displays the clock details.
 */

export default forwardRef(function ClockReviewModal(
  { staff, clock, onConfirm, onClose },
  ref,
) {
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
    setTempEndTime(formatTime(clock.endTime));
    setIsEditingEndTime(false);
    setErrorMessage("");
  }, [clock.endTime]);

  useEffect(() => {
    // Validate that end time is not less than start time
    if (!dayjs(fullEndDateTime).isValid()) {
      setErrorMessage("Please enter a valid end time.");
      return;
    }

    if (dayjs(fullEndDateTime).isBefore(dayjs(clock.startTime))) {
      setErrorMessage("Make sure end time is LATER than start time.");
    } else {
      setErrorMessage("");
    }
  }, [fullEndDateTime, clock.startTime]);

  const handleCancelEdit = () => {
    setIsEditingEndTime(false);
    setTempEndTime(formatTime(clock.endTime));
    setErrorMessage("");
  };

  const handleFormClose = () => {
    setIsEditingEndTime(false);
    setTempEndTime(formatTime(clock.endTime));
    setErrorMessage("");
    onClose?.();
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
      ref={ref}
      id="CLOCK_REVIEW_MODAL"
      heading="Unclose Shift Review"
      onSubmit={handleVerifyEndTime}
      onClose={handleFormClose}
      disableConfirmation={Boolean(errorMessage)}
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
                  setTempEndTime(formatTime(clock.endTime));
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
                value={tempEndTime}
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
});
