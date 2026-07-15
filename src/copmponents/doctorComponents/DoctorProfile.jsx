import { useState } from "react";
import {
  useGetDoctorProfileQuery,
  useBlockDoctorSlotsMutation,
  useDoctorUpdateSlotDurationMutation,
} from "../../store/services/doctorApi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  LuUser,
  LuLock,
  LuActivity,
  LuCalendarDays,
  LuClock,
  LuCircleX,
  LuCircleCheck,
  LuSettings,
  LuTriangleAlert,
} from "react-icons/lu";

const DoctorProfile = () => {
  const { data: profileData, isLoading } = useGetDoctorProfileQuery();
  const [blockSlots, { isLoading: isBlocking }] = useBlockDoctorSlotsMutation();
  const [updateDuration, { isLoading: isUpdatingDuration }] =
    useDoctorUpdateSlotDurationMutation();

  const doctor = profileData?.doctorData;
  console.log(doctor);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [localDuration, setLocalDuration] = useState("");
  const [isOpenSlotDurationSelect, setIsOpenSlotDurationSelect] =
    useState(false);
  const closeAllDropdowns = () => {
    setIsOpenSlotDurationSelect(false);
  };
  const convert24To12 = (time24) => {
    if (!time24) return "09:00 AM";
    const [hoursStr, minutesStr] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const modifier = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${String(hours).padStart(2, "0")}:${minutesStr} ${modifier}`;
  };

  const generateDynamicSlots = (
    startTimeStr,
    endTimeStr,
    interVelMinutes = 20,
  ) => {
    if (!startTimeStr || !endTimeStr) return [];

    const convertToMinutes = (timeStr) => {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (hours === 12) {
        hours = modifier === "AM" ? 0 : 12;
      } else if (modifier === "PM") {
        hours += 12;
      }
      return hours * 60 + minutes;
    };

    const formatMinutesToTimeString = (totalMinutes) => {
      let hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const modifier = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      if (hours === 0) hours = 12;
      const strHours = String(hours).padStart(2, "0");
      const strMinutes = String(minutes).padStart(2, "0");
      return `${strHours}:${strMinutes} ${modifier}`;
    };

    const slots = [];
    const startMinutes = convertToMinutes(startTimeStr);
    const endMinutes = convertToMinutes(endTimeStr);
    let currentMinutes = startMinutes;
    while (currentMinutes < endMinutes) {
      slots.push(formatMinutesToTimeString(currentMinutes));
      currentMinutes += interVelMinutes;
    }
    return slots;
  };

  const handleDurationChangeSubmit = async () => {
    const durationToSend = localDuration || doctor?.slotDuration || 20;

    if (!effectiveDate) {
      return toast.error("Please select the effective date for this scheme.");
    }

    try {
      const res = await updateDuration({
        slotDuration: Number(durationToSend),
        effectiveDate: effectiveDate,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Slot scheme updated successfully! ⚙️");
        setSelectedSlots([]);
        setEffectiveDate("");
        setLocalDuration("");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update duration scheme");
    }
  };

  const handleSlotClick = (time) => {
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter((slot) => slot !== time));
    } else {
      setSelectedSlots([...selectedSlots, time]);
    }
  };

  const handleBlockAction = async () => {
    if (!selectedDate) return toast.error("Please select a date first");
    if (selectedSlots.length === 0)
      return toast.error("Select at least one slot to block");

    try {
      const res = await blockSlots({
        slotDate: selectedDate,
        slotsToBlock: selectedSlots,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Slots blocked successfully! 🔒");
        setSelectedSlots([]);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const getDurationForSelectedDate = () => {
    if (
      !doctor?.slotDurationHistory ||
      doctor.slotDurationHistory.length === 0
    ) {
      return doctor?.slotDuration || 20;
    }

    if (!selectedDate) {
      return doctor?.slotDuration || 20;
    }

    const selectedStr = new Date(selectedDate).toISOString().split("T")[0];

    const applicableSchemes = doctor.slotDurationHistory.filter((scheme) => {
      if (!scheme.effectiveFrom) return false;
      const effectiveStr = new Date(scheme.effectiveFrom)
        .toISOString()
        .split("T")[0];
      return selectedStr >= effectiveStr;
    });

    if (applicableSchemes.length > 0) {
      applicableSchemes.sort(
        (a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom),
      );
      return applicableSchemes[applicableSchemes.length - 1].slotDuration;
    }

    return 20;
  };

  const currentInterval = getDurationForSelectedDate();

  const getDayScheduleForSelectedDate = () => {
    if (!selectedDate || !doctor?.weeklySchedule) return null;
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = daysOfWeek[new Date(selectedDate).getDay()];
    return doctor.weeklySchedule[dayName] || null;
  };

  const currentDayConfig = getDayScheduleForSelectedDate();
  const isOffDay = currentDayConfig?.isAvailable === false;

  const isBeforeJoiningDate =
    doctor?.scheduledActivationDate && selectedDate
      ? selectedDate <
        new Date(doctor.scheduledActivationDate).toISOString().split("T")[0]
      : false;

  const doctorSpecificSlots = generateDynamicSlots(
    currentDayConfig?.startTime
      ? convert24To12(currentDayConfig.startTime)
      : "09:00 AM",
    currentDayConfig?.endTime
      ? convert24To12(currentDayConfig.endTime)
      : "05:00 PM",
    currentInterval,
  );

  const futureSlotsOnly = doctorSpecificSlots.filter((timeStr) => {
    if (!selectedDate) return false;

    const todayStr = new Date().toISOString().split("T")[0];
    if (selectedDate < todayStr) {
      return false;
    }
    if (selectedDate === todayStr) {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (hours === 12) {
        hours = modifier === "AM" ? 0 : 12;
      } else if (modifier === "PM") {
        hours += 12;
      }
      const slotTotalMinutes = hours * 60 + minutes;
      const now = new Date();
      const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
      return slotTotalMinutes > currentTotalMinutes;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-12 font-bold text-slate-500 animate-pulse flex flex-col items-center justify-center gap-2">
          <LuActivity className="w-6 h-6 text-teal-600 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  const alreadyBookedOrBlocked = doctor?.slots_booked?.[selectedDate] || [];

  return (
    <div
      className="max-w-4xl mx-auto space-y-8 font-sans antialiased text-left"
      dir="ltr"
    >
      {doctor?.available === false && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 mb-6 animate-pulse shadow-3xs">
          <LuTriangleAlert className="w-4 h-4 shrink-0 text-amber-600" />
          Your account is currently marked as INACTIVE by the Admin. You can
          view your details but slots or scheme management is disabled.
        </div>
      )}

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <LuUser className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Doctor Profile Details
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                Configuration managed by Administrator
              </p>
            </div>
          </div>
          <span className="text-[11px] font-black uppercase tracking-wide text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 flex items-center gap-1 whitespace-nowrap">
            <LuLock className="w-3 h-3" /> Read-Only Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-extrabold text-slate-700">
              Dr. {doctor?.name || "Not Available"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Speciality & Degree
            </label>
            <div className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-extrabold text-slate-700">
              {doctor?.speciality || "N/A"} ({doctor?.degree || "N/A"})
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              OPD Consultation Fees
            </label>
            <div className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-black text-teal-600">
              {doctor?.fees ? `${doctor.fees} PKR` : "Not set"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              In-Patient Round Fees
            </label>
            <div className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-black text-purple-600">
              {doctor?.roundFee ? `${doctor.roundFee} PKR` : "—"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Admin Commission Rate
            </label>
            <div className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-black text-rose-600">
              {doctor?.commission !== undefined ? `${doctor.commission}%` : "—"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Base Shift Status
            </label>
            <div className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600">
              🕒 Dynamic - Controlled by Weekly Shift Schedule
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
            <LuSettings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              Dynamic Slot Interval Config
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Active Base Scheme:{" "}
              <span className="font-bold text-teal-600">
                {doctor?.slotDuration || 20} Minutes
              </span>
              {doctor?.durationEffectiveFrom &&
                ` (Scheduled change from date: ${new Date(doctor.durationEffectiveFrom).toLocaleDateString()})`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50/30 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">
              1. Choose Interval
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const nextState = !isOpenSlotDurationSelect;
                  if (typeof closeAllDropdowns === "function") {
                    closeAllDropdowns();
                  } else {
                    setIsOpenSlotDurationSelect(false);
                  }
                  setIsOpenSlotDurationSelect(nextState);
                }}
                className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-left text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors focus:border-teal-500 shadow-3xs cursor-pointer"
              >
                <span className="truncate">
                  {(() => {
                    const val = localDuration || doctor?.slotDuration || "20";
                    if (val === "20") return "20 Minutes (Default)";
                    return `${val} Minutes`;
                  })()}
                </span>
                <span
                  className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isOpenSlotDurationSelect ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpenSlotDurationSelect && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpenSlotDurationSelect(false)}
                  />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-50">
                    {[
                      { value: "15", label: "15 Minutes" },
                      { value: "20", label: "20 Minutes (Default)" },
                      { value: "30", label: "30 Minutes" },
                      { value: "45", label: "45 Minutes" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setLocalDuration(opt.value);
                          setIsOpenSlotDurationSelect(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-xs sm:text-sm font-semibold block transition-colors ${
                          (localDuration || doctor?.slotDuration || "20") ===
                          opt.value
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">
              2. Effective From Date
            </label>

            <div className="w-full relative react-datepicker-custom-wrapper">
              <DatePicker
                selected={effectiveDate ? new Date(effectiveDate) : null}
                onChange={(date) => {
                  if (date) {
                    const offset = date.getTimezoneOffset();
                    const adjustedDate = new Date(
                      date.getTime() - offset * 60 * 1000,
                    );
                    setEffectiveDate(adjustedDate.toISOString().split("T")[0]);
                  } else {
                    setEffectiveDate("");
                  }
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer shadow-3xs"
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "preventOverflow",
                    options: {
                      boundary: "viewport",
                    },
                  },
                ]}
                placeholderText="Select Effective Date"
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleDurationChangeSubmit}
              disabled={
                isUpdatingDuration ||
                !effectiveDate ||
                doctor?.available === false
              }
              className="w-full px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
            >
              {isUpdatingDuration ? "Updating..." : "Update Scheme"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
            <LuCalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              Manage Slot Availability
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Currently rendering slots with{" "}
              <span className="font-bold text-slate-700">
                {currentInterval} minutes
              </span>{" "}
              spacing for selected day.
            </p>
          </div>
        </div>

        <div className="max-w-xs mb-6">
          <label className="block text-xs font-bold text-slate-500 mb-2">
            Select Working Date
          </label>

          <div className="w-full relative react-datepicker-custom-wrapper">
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={(date) => {
                if (date) {
                  const offset = date.getTimezoneOffset();
                  const adjustedDate = new Date(
                    date.getTime() - offset * 60 * 1000,
                  );

                  setSelectedDate(adjustedDate.toISOString().split("T")[0]);
                } else {
                  setSelectedDate("");
                }

                setSelectedSlots([]);
              }}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer shadow-3xs"
              popperPlacement="bottom-start"
              popperModifiers={[
                {
                  name: "preventOverflow",
                  options: {
                    boundary: "viewport",
                  },
                },
              ]}
              placeholderText="Select Date"
            />
          </div>
        </div>

        {selectedDate ? (
          <div className="space-y-6">
            {isBeforeJoiningDate && (
              <div className="text-center py-6 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-700 font-semibold flex items-center justify-center gap-1.5">
                🚫 You cannot manage or block slots before your official joining
                date (
                {new Date(doctor.scheduledActivationDate).toLocaleDateString()}
                ).
              </div>
            )}

            {!isBeforeJoiningDate && isOffDay && (
              <div className="text-center py-6 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-700 font-semibold flex items-center justify-center gap-1.5">
                🏖️ This day is configured as your 'Off Day' in the weekly shift
                schedule. No slots are active.
              </div>
            )}

            {!isBeforeJoiningDate && !isOffDay && (
              <>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                    Click on individual slots to toggle block list
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {futureSlotsOnly.map((time) => {
                      const serverSlot = alreadyBookedOrBlocked.find(
                        (s) => s.time === time,
                      );
                      const isBooked = serverSlot?.status === "booked";
                      const isBlocked =
                        serverSlot?.status === "blocked_by_doctor";
                      const isSelected = selectedSlots.includes(time);

                      return (
                        <button
                          key={time}
                          disabled={
                            isBooked || isBlocked || doctor?.available === false
                          }
                          onClick={() => handleSlotClick(time)}
                          className={`px-3 py-2.5 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                            isBooked
                              ? "bg-rose-50 border-rose-100 text-rose-500 cursor-not-allowed"
                              : isBlocked
                                ? "bg-slate-100 border-slate-200/80 text-slate-400 cursor-not-allowed"
                                : isSelected
                                  ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                                  : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="tracking-tight">{time}</div>
                          <div className="text-[9px] font-bold mt-0.5 opacity-80 uppercase tracking-wide">
                            {isBooked
                              ? "Booked"
                              : isBlocked
                                ? "Blocked"
                                : isSelected
                                  ? "To Block"
                                  : "Available"}
                          </div>
                        </button>
                      );
                    })}

                    {futureSlotsOnly.length === 0 && (
                      <div className="col-span-full text-center py-6 bg-rose-50/40 border border-rose-100 rounded-xl text-xs text-rose-500 font-semibold">
                        🚫 Slots for past dates or elapsed hours cannot be
                        managed.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 bg-white border border-slate-200 rounded-sm"></span>
                      Available
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 bg-amber-500 rounded-sm"></span>{" "}
                      Selected
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 bg-slate-200 rounded-sm"></span>{" "}
                      Blocked
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 bg-rose-100 rounded-sm"></span>{" "}
                      Patient Booked
                    </span>
                  </div>

                  <button
                    onClick={handleBlockAction}
                    disabled={isBlocking || selectedSlots.length === 0}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <LuCircleCheck className="w-4 h-4" />
                    {isBlocking ? "Processing..." : "Apply Block Selection"}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-3 rounded-xl text-xs font-semibold shadow-3xs">
            <LuClock className="w-4 h-4 text-slate-400 shrink-0" />
            <p>
              Please select a date above to load available slots for that day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
