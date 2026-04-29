import { formatDate, formatTime } from "../../lib";
import dayjs from "dayjs";
import { useUpdateClockMutation } from "../../hooks";
import { useState } from "react";
import { FormModal } from "../Modal";
import TimeInput from "../TimeInput";
import { FaEdit } from "react-icons/fa";
import { FaRegSquareCheck, FaSquareCheck } from "react-icons/fa6";
import FormErrorMessage from "../FormErrorMessage";

export default function ClockReviewModal({
  staff,
  clock,
  setClock,
  setEnableReviewClock,
}) {
  if (!staff || !clock) {
    alert("Error: Undefined items");
    return;
  }

  const [editedEndTime, setEditedEndTime] = useState(formatTime(clock.endTime));
  const [enableEditEndTime, setEnableEditEndTime] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //clock mutation
  const updateClockMutation = useUpdateClockMutation();

  const handleEditEndTime = () => {
    setEnableEditEndTime(true);
    setErrorMessage("");
  };

  const handleQuickVerifyEndTime = () => {
    setErrorMessage("");
    // Validate that current end time is not less than start time
    if (dayjs(clock.endTime).isBefore(dayjs(clock.startTime))) {
      setErrorMessage("End time must not be earlier than start time");
      return;
    }

    setClock((prev) => ({
      ...prev,
      clockoutMethod: "admin-verified",
    }));

    setIsVerified(true);
  };

  const handleCancelEdit = () => {
    setEnableEditEndTime(false);
    setEditedEndTime(formatTime(clock.endTime));
    setErrorMessage("");
  };

  const handleVerifyEndTime = () => {
    setErrorMessage("");
    const shiftDate = dayjs(clock.startTime).format("YYYY-MM-DD");
    const fullEndDateTime = dayjs(
      `${shiftDate} ${editedEndTime}`,
      "YYYY-MM-DD HH:mm",
    ).toISOString();

    // Validate that end time is not less than start time
    if (dayjs(fullEndDateTime).isBefore(dayjs(clock.startTime))) {
      setErrorMessage("End time must not be earlier than start time");
      return;
    }

    setClock((prev) => ({
      ...prev,
      endTime: fullEndDateTime,
      clockoutMethod: "admin-verified",
    }));
    setEnableEditEndTime(false);
    setEditedEndTime(formatTime(clock.endTime));
    setIsVerified(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      const updatedClock = {
        ...clock,
      };
      await updateClockMutation.mutateAsync(updatedClock);
      setEnableEditEndTime(false);
      setEditedEndTime("");
      setClock({});
    } catch (error) {
      console.error("Error updating clock:", error);
    }
    setEnableReviewClock(false);
  };

  const handleModalClose = () => {
    // Reset state when modal is closed without confirmation
    setEnableEditEndTime(false);
    setEditedEndTime("");
    setClock({});
    setEnableReviewClock(false);
  };

  return (
    <FormModal
      id="CLOCK_REVIEW_MODAL"
      heading="Clock Review"
      color="sky-mist-100"
      action={handleConfirmUpdate}
      onClose={handleModalClose}
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
          {!enableEditEndTime ? (
            <span className="flex gap-3">
              <span
                className={`font-medium ${isVerified ? `text-sky-mist-100` : `text-alert`}`}
              >
                {formatTime(clock.endTime)}
              </span>
              {!isVerified && (
                <button
                  onClick={handleEditEndTime}
                  className="font-medium text-mocha hover:underline cursor-pointer"
                >
                  <div className="lg:tooltip" data-tip="Edit">
                    <FaEdit className="h-5 w-5" />
                  </div>
                </button>
              )}
              <button
                onClick={handleQuickVerifyEndTime}
                className="font-medium text-sky-mist-100 hover:underline cursor-pointer"
              >
                {isVerified && (
                  <div className="lg:tooltip" data-tip="Verified">
                    <FaSquareCheck className="h-5 w-5" />
                  </div>
                )}
                {!isVerified && (
                  <div className="lg:tooltip" data-tip="Verify">
                    <FaRegSquareCheck className="h-5 w-5" />
                  </div>
                )}
              </button>
            </span>
          ) : (
            <div className="flex gap-2 items-center mt-2">
              <TimeInput
                id="endTime"
                defaultValue={editedEndTime}
                onChange={(e) => setEditedEndTime(e.target.value)}
              />
              <button
                onClick={handleCancelEdit}
                className="btn btn-sm bg-mocha-30 text-mocha font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyEndTime}
                className="btn btn-sm bg-sky-mist-100 text-white font-medium"
              >
                Verify
              </button>
            </div>
          )}
        </section>
        <FormErrorMessage message={errorMessage} />
      </section>
    </FormModal>
  );
}
