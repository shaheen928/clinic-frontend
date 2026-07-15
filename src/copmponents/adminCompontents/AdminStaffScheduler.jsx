import React, { useState } from "react";
import {
  useGetAllStaffQuery,
  useAdminAssignStaffDutyMutation,
} from "../../store/services/adminApi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaLayerGroup,
  FaUserAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarDay,
  FaCheckCircle,
} from "react-icons/fa";

const AdminStaffScheduler = () => {
  const [staffType, setStaffType] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [assignedLocation, setAssignedLocation] = useState("");
  const [shift, setShift] = useState("Morning");
  const [dutyDate, setDutyDate] = useState("");

  const [isOpenStaffTypeSelect, setIsOpenStaffTypeSelect] = useState(false);
  const [isOpenStaffMemberSelect, setIsOpenStaffMemberSelect] = useState(false);
  const [isOpenLocationSelect, setIsOpenLocationSelect] = useState(false);
  const [isOpenShiftSelect, setIsOpenShiftSelect] = useState(false);

  const { data: staffData, isLoading: isStaffLoading } = useGetAllStaffQuery();
  const [assignDuty, { isLoading: isAssigning }] =
    useAdminAssignStaffDutyMutation();

  const staffList = staffData?.staff || [];

  const filteredStaffList = staffList.filter((staff) => {
    return staff.staffType === staffType;
  });

  const closeAllDropdowns = () => {
    setIsOpenStaffTypeSelect(false);
    setIsOpenStaffMemberSelect(false);
    setIsOpenLocationSelect(false);
    setIsOpenShiftSelect(false);
  };

  const handleStaffTypeChange = (type) => {
    setStaffType(type);
    setSelectedStaff("");
    setAssignedLocation("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaff || !assignedLocation || !shift || !dutyDate) {
      toast.error("Please fill all fields! 🛑");
      return;
    }
    try {
      await assignDuty({
        staffId: selectedStaff,
        assignedLocation,
        shift,
        dutyDate,
      }).unwrap();
      toast.success("Staff duty scheduled successfully 📆✨");
      setSelectedStaff("");
      setAssignedLocation("");
      setDutyDate("");
      setStaffType("");
    } catch (err) {
      toast.error(err?.data?.message || "Scheduling failed!");
    }
  };

  return (
    <div
      className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-left"
      dir="ltr"
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
          <FaCalendarAlt className="text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Schedule Staff Duty
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Assign duties based on staff type without overlaps.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            <FaLayerGroup className="text-slate-400 text-[11px]" />
            1. Select Staff Type
          </label>

          <div className="relative w-full">
            <button
              type="button"
              onClick={() => {
                const nextState = !isOpenStaffTypeSelect;
                closeAllDropdowns();
                setIsOpenStaffTypeSelect(nextState);
              }}
              className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-teal-500 shadow-3xs cursor-pointer"
            >
              <span className="truncate">
                {staffType === "Clinical"
                  ? "Clinical Staff (Doctors/Nurses)"
                  : staffType === "Support"
                    ? "Support Staff (Admin/Security/Others)"
                    : "-- Choose Category --"}
              </span>
              <span
                className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                  isOpenStaffTypeSelect ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isOpenStaffTypeSelect && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpenStaffTypeSelect(false)}
                />
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-50">
                  <button
                    type="button"
                    onClick={() => {
                      handleStaffTypeChange("Clinical");
                      setIsOpenStaffTypeSelect(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold block transition-colors ${
                      staffType === "Clinical"
                        ? "bg-teal-50 text-teal-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Clinical Staff (Doctors/Nurses)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleStaffTypeChange("Support");
                      setIsOpenStaffTypeSelect(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold block transition-colors ${
                      staffType === "Support"
                        ? "bg-teal-50 text-teal-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Support Staff (Admin/Security/Others)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            <FaUserAlt className="text-slate-400 text-[11px]" />
            2. Select Staff Member
          </label>

          <div className="relative w-full">
            <button
              type="button"
              disabled={!staffType || isStaffLoading}
              onClick={() => {
                const nextState = !isOpenStaffMemberSelect;
                closeAllDropdowns();
                setIsOpenStaffMemberSelect(nextState);
              }}
              className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-teal-500 shadow-3xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="truncate">
                {selectedStaff
                  ? staffList.find((s) => s._id === selectedStaff)?.name +
                    (staffList.find((s) => s._id === selectedStaff)?.role
                      ? ` (${staffList.find((s) => s._id === selectedStaff)?.role})`
                      : "")
                  : "-- Choose Staff Member --"}
              </span>
              <span
                className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                  isOpenStaffMemberSelect ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isOpenStaffMemberSelect && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpenStaffMemberSelect(false)}
                />
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto divide-y divide-slate-50">
                  {filteredStaffList.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-400 italic">
                      No staff members found
                    </div>
                  ) : (
                    filteredStaffList.map((staff) => (
                      <button
                        key={staff._id}
                        type="button"
                        onClick={() => {
                          setSelectedStaff(staff._id);
                          setAssignedLocation("");
                          setIsOpenStaffMemberSelect(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold block transition-colors ${
                          selectedStaff === staff._id
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {staff.name} {staff.role ? `(${staff.role})` : ""}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            <FaMapMarkerAlt className="text-slate-400 text-[11px]" />
            3. Assigned Location / Station
          </label>

          <div className="relative w-full">
            <button
              type="button"
              disabled={!selectedStaff}
              onClick={() => {
                const nextState = !isOpenLocationSelect;
                closeAllDropdowns();
                setIsOpenLocationSelect(nextState);
              }}
              className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-teal-500 shadow-3xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="truncate">
                {assignedLocation || "-- Select Duty Station --"}
              </span>
              <span
                className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                  isOpenLocationSelect ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isOpenLocationSelect && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpenLocationSelect(false)}
                />
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto divide-y divide-slate-50">
                  {staffType === "Clinical" &&
                    [
                      "General Ward",
                      "Semi-Private Ward",
                      "Private Room",
                      "ICU (Intensive Care Unit)",
                      "CCU (Coronary Care Unit)",
                      "Operation Theater 1",
                      "Emergency Ward",
                    ].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setAssignedLocation(loc);
                          setIsOpenLocationSelect(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold block transition-colors ${
                          assignedLocation === loc
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}

                  {staffType === "Support" &&
                    [
                      "Main Reception",
                      "Emergency Gate Entrance",
                      "Accounts Office",
                      "Pharmacy Counter",
                      "Main Lab Area",
                    ].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setAssignedLocation(loc);
                          setIsOpenLocationSelect(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold block transition-colors ${
                          assignedLocation === loc
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              <FaClock className="text-slate-400 text-[11px]" />
              Shift Type
            </label>

            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  const nextState = !isOpenShiftSelect;
                  closeAllDropdowns();
                  setIsOpenShiftSelect(nextState);
                }}
                className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-teal-500 shadow-3xs cursor-pointer"
              >
                <span className="truncate">{shift} Shift</span>
                <span
                  className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isOpenShiftSelect ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpenShiftSelect && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpenShiftSelect(false)}
                  />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-50">
                    {["Morning", "Evening", "Night"].map((shf) => (
                      <button
                        key={shf}
                        type="button"
                        onClick={() => {
                          setShift(shf);
                          setIsOpenShiftSelect(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold block transition-colors ${
                          shift === shf
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {shf} Shift
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              <FaCalendarDay className="text-slate-400 text-[11px]" />
              Duty Date
            </label>
            <div className="w-full relative react-datepicker-custom-wrapper">
              <DatePicker
                selected={dutyDate ? new Date(dutyDate) : null}
                onChange={(date) => {
                  if (date) {
                    const offset = date.getTimezoneOffset();
                    const adjustedDate = new Date(
                      date.getTime() - offset * 60 * 1000,
                    );
                    setDutyDate(adjustedDate.toISOString().split("T")[0]);
                  } else {
                    setDutyDate("");
                  }
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 bg-white cursor-pointer shadow-3xs"
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "preventOverflow",
                    options: {
                      boundary: "viewport",
                    },
                  },
                ]}
                placeholderText="Select Duty Date"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAssigning}
          className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-slate-900/5 disabled:bg-slate-400 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <FaCheckCircle className="text-sm" />
          {isAssigning ? "Scheduling..." : "Confirm & Save Schedule"}
        </button>
      </form>
    </div>
  );
};

export default AdminStaffScheduler;
