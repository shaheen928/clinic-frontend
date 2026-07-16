import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetDoctorInfoQuery,
  useUpdateDoctorScheduleMutation,
} from "../../store/services/adminApi";
import { toast } from "react-toastify";

const convertTo24Hour = (timeStr) => {
  if (!timeStr) return "09:00";
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = parseInt(hours, 10) + 12;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const convertTo12Hour = (time24) => {
  if (!time24) return "09:00 AM";
  let [hours, minutes] = time24.split(":");
  const modifier = parseInt(hours, 10) >= 12 ? "PM" : "AM";
  hours = parseInt(hours, 10) % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${modifier}`;
};

const EditDoctorSchedule = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetDoctorInfoQuery(docId);
  const [updateSchedule, { isLoading: isUpdating }] =
    useUpdateDoctorScheduleMutation();

  const [weeklySchedule, setWeeklySchedule] = useState({});
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const defaultTimings = {
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      isAvailable: true,
    };

    if (data?.doctor) {
      const dbSchedule = data.doctor.weeklySchedule || {};
      const fullSchedule = {};

      daysOfWeek.forEach((day) => {
        const lowerDay = day.toLowerCase();
        const dayData = dbSchedule[lowerDay] || defaultTimings;

        fullSchedule[lowerDay] = {
          startTime: convertTo24Hour(dayData.startTime),
          endTime: convertTo24Hour(dayData.endTime),
          isAvailable: dayData.isAvailable ?? true,
        };
      });

      setWeeklySchedule(fullSchedule);
    }
  }, [data]);

  const handleTimeChange = (day, field, value) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day.toLowerCase()]: {
        ...prev[day.toLowerCase()],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (day, isChecked) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day.toLowerCase()]: {
        ...prev[day.toLowerCase()],
        isAvailable: !isChecked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduleToSend = {};
      daysOfWeek.forEach((day) => {
        const lowerDay = day.toLowerCase();
        const currentDayData = weeklySchedule[lowerDay];

        scheduleToSend[lowerDay] = {
          startTime: convertTo12Hour(currentDayData?.startTime),
          endTime: convertTo12Hour(currentDayData?.endTime),
          isAvailable: currentDayData?.isAvailable,
        };
      });

      await updateSchedule({ docId, weeklySchedule: scheduleToSend }).unwrap();
      toast.success("Schedule updated successfully!");
      navigate("/admin/doctors");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed:", err);
    }
  };

  if (isLoading)
    return <div className="text-center py-12">Loading Doctor Data...</div>;
  if (error)
    return (
      <div className="text-center py-12 text-rose-600">
        Error loading doctor.
      </div>
    );

  return (
    <div
      className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm max-w-4xl mx-auto mt-6 text-left w-full overflow-hidden"
      dir="ltr"
    >
      <h2 className="text-xl font-extrabold text-slate-800 mb-1">
        Edit Schedule for Dr. {data?.doctor?.name}
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        Modify the weekly shift timings and off days.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4w-full">
        <div className="divide-y divide-slate-100 w-full">
          {daysOfWeek.map((day) => {
            const lowerDay = day.toLowerCase();
            const dayData = weeklySchedule[lowerDay] || {
              startTime: "09:00",
              endTime: "17:00",
              isAvailable: true,
            };

            const isOffDay = !dayData.isAvailable;

            return (
              <div
                key={day}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 w-full"
              >
                {/* Day Name */}
                <span className="font-bold text-slate-700 w-full sm:w-28 text-base">
                  {day}
                </span>

                {/* Time Inputs Wrapper (Fixed for Mobile Screens) */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1 w-full">
                  <div className="flex items-center gap-2 min-w-32 flex-1 sm:flex-initial">
                    <span className="text-xs text-slate-400 min-w-8">
                      Start:
                    </span>
                    <input
                      type="time"
                      disabled={isOffDay}
                      value={dayData.startTime}
                      onChange={(e) =>
                        handleTimeChange(day, "startTime", e.target.value)
                      }
                      className="border border-slate-200 rounded-lg p-1.5 text-sm focus:outline-teal-500 disabled:bg-slate-50 w-full sm:w-auto"
                    />
                  </div>

                  <div className="flex items-center gap-2 min-w-32 flex-1 sm:flex-initial">
                    <span className="text-xs text-slate-400 min-w-8">End:</span>
                    <input
                      type="time"
                      disabled={isOffDay}
                      value={dayData.endTime}
                      onChange={(e) =>
                        handleTimeChange(day, "endTime", e.target.value)
                      }
                      className="border border-slate-200 rounded-lg p-1.5 text-sm focus:outline-teal-500 disabled:bg-slate-50 w-full sm:w-auto"
                    />
                  </div>
                </div>

                {/* Checkbox Section */}
                <div className="flex items-center gap-2 min-w-35 pt-1 sm:pt-0">
                  <input
                    type="checkbox"
                    id={`closed-${lowerDay}`}
                    checked={isOffDay}
                    onChange={(e) =>
                      handleCheckboxChange(day, e.target.checked)
                    }
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  />
                  <label
                    htmlFor={`closed-${lowerDay}`}
                    className="text-sm font-medium text-slate-600 select-none cursor-pointer"
                  >
                    Mark as Off Day
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex justify-end gap-3 w-full">
          <button
            type="button"
            onClick={() => navigate("/admin/doctors")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-teal-600/10 transition-colors disabled:bg-slate-300"
          >
            {isUpdating ? "Saving Changes..." : "Save Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctorSchedule;
