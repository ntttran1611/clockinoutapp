import { Button, DateInputField } from "../index";
import { FaEye } from "react-icons/fa";
import { dayFormatting, monthFormatting, yearFormatting } from "../../lib";

export function DateRangeFilter({
  searchStartDate,
  setStartDate,
  searchEndDate,
  setEndDate,
  defaultStartOfWeek,
  defaultEndOfWeek,
  onViewClicked,
}) {
  return (
    <div className="flex items-center 2xl:w-1/3 w-5/6 gap-1">
      <p className="font-vietnam text-sm">from</p>
      <DateInputField
        dateObject={searchStartDate}
        onDayChange={(e) =>
          setStartDate({ ...searchStartDate, day: e.target.value })
        }
        onMonthChange={(e) =>
          setStartDate({
            ...searchStartDate,
            month: e.target.value,
          })
        }
        onYearChange={(e) =>
          setStartDate({ ...searchStartDate, year: e.target.value })
        }
        dayFormatting={(e) =>
          setStartDate({
            ...searchStartDate,
            day: dayFormatting(e.target.value, defaultStartOfWeek.day),
          })
        }
        monthFormatting={(e) =>
          setStartDate({
            ...searchStartDate,
            month: monthFormatting(e.target.value, defaultStartOfWeek.month),
          })
        }
        yearFormatting={(e) =>
          setStartDate({
            ...searchStartDate,
            year: yearFormatting(e.target.value, defaultStartOfWeek.year),
          })
        }
      />
      <p className="font-vietnam text-sm">to</p>
      <DateInputField
        dateObject={searchEndDate}
        onDayChange={(e) => {
          setEndDate({ ...searchEndDate, day: e.target.value });
        }}
        onMonthChange={(e) =>
          setEndDate({
            ...searchEndDate,
            month: e.target.value,
          })
        }
        onYearChange={(e) =>
          setEndDate({ ...searchEndDate, year: e.target.value })
        }
        dayFormatting={(e) =>
          setEndDate({
            ...searchEndDate,
            day: dayFormatting(e.target.value, defaultEndOfWeek.day),
          })
        }
        monthFormatting={(e) =>
          setEndDate({
            ...searchEndDate,
            month: monthFormatting(e.target.value, defaultEndOfWeek.month),
          })
        }
        yearFormatting={(e) =>
          setEndDate({
            ...searchEndDate,
            year: yearFormatting(e.target.value, defaultEndOfWeek.year),
          })
        }
      />
      <div className="tooltip" data-tip="view">
        <Button variant="icon-primary" onClick={onViewClicked}>
          <FaEye />
        </Button>
      </div>
    </div>
  );
}
