import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutStaff } from "../../store/services/authSlice";
import { useGetStaffDashboardQuery } from "../../store/services/staffApi";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaBuilding,
  FaClock,
  FaSyncAlt,
  FaSignOutAlt,
  FaClipboardList,
  FaBed,
  FaExclamationTriangle,
  FaCut,
  FaPills,
  FaHeartbeat,
  FaProcedures,
} from "react-icons/fa";
import { MdOutlineNotes } from "react-icons/md";

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: responseData,
    isLoading,
    error,
    refetch,
  } = useGetStaffDashboardQuery(undefined, {
    pollingInterval: 30000,
  });

  const calculateAge = (dobString) => {
    if (!dobString) return "--";
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return `${age} Yrs`;
  };

  const handleLogout = () => {
    dispatch(logoutStaff());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50/50">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin border-4 border-teal-600 border-t-transparent rounded-full w-14 h-14"></div>
          <div className="absolute text-teal-600 text-base">
            <FaUserMd />
          </div>
        </div>
        <span className="ml-3 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Loading Live Duty Rota...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 text-center max-w-sm w-full">
          <div className="bg-rose-50 border border-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-4">
            <FaExclamationTriangle className="text-xl" />
          </div>
          <h3 className="text-base font-black text-slate-800 tracking-tight">
            Connection Failed
          </h3>
          <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
            {error?.data?.message || "Session expired or unauthorized."}
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all"
          >
            Back to Secure Login
          </button>
        </div>
      </div>
    );
  }

  const {
    staffName,
    dutyWard,
    shiftType,
    indoorAdmissions = [],
  } = responseData?.data || {};

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-800 antialiased font-sans selection:bg-teal-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200/60 p-5 md:p-6 rounded-2xl shadow-xs shadow-slate-100/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-50 text-teal-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0 ring-4 ring-teal-50/50">
              <FaUserMd className="text-xl" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">
                  Welcome, {staffName || "Staff Member"}
                </h1>
                <span className="text-[9px] font-black tracking-wider uppercase bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-2 py-0.5 rounded-md animate-pulse">
                  Live: Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-semibold tracking-wide uppercase">
                Clinical Monitoring Desk
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="bg-slate-50/80 border border-slate-200/40 px-4 py-2 rounded-xl flex-1 xl:flex-initial min-w-35">
              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Assigned Station
              </span>
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <FaBuilding className="text-slate-400 text-[11px]" />{" "}
                {dutyWard || "Not Assigned"}
              </span>
            </div>
            <div className="bg-slate-50/80 border border-slate-200/40 px-4 py-2 rounded-xl flex-1 xl:flex-initial min-w-35">
              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Current Shift
              </span>
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <FaClock className="text-slate-400 text-[11px]" />{" "}
                {shiftType || "Off Duty"}
              </span>
            </div>

            <button
              onClick={() => {
                refetch();
                toast.success("Ward records synchronized!");
              }}
              className="bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-xs font-bold px-4 py-3 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-xs flex items-center justify-center gap-1.5 flex-1 xl:flex-initial"
            >
              <FaSyncAlt className="text-[10px] text-slate-400 group-hover:rotate-180 transition-transform duration-500" />{" "}
              Sync
            </button>
            <button
              onClick={handleLogout}
              className="bg-rose-50/60 hover:bg-rose-50 active:scale-[0.98] text-rose-600 text-xs font-bold px-4 py-3 rounded-xl transition-all border border-rose-100/70 flex items-center justify-center gap-1.5 cursor-pointer flex-1 xl:flex-initial"
            >
              <span>Logout</span> <FaSignOutAlt className="text-[10px]" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FaClipboardList className="text-slate-500" /> Active Ward Census
              <span className="bg-slate-900 text-white text-[11px] px-2.5 py-0.5 rounded-full font-black shadow-sm shadow-slate-900/10">
                {indoorAdmissions.length}
              </span>
            </h2>
          </div>

          {indoorAdmissions.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200/80 rounded-2xl p-16 text-center max-w-xl mx-auto shadow-xs">
              <FaBed className="text-5xl block mx-auto text-slate-200 mb-4" />
              <h3 className="text-slate-700 font-black text-base tracking-tight">
                No Admitted Patients Found
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Currently there are no active indoor admissions assigned here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {indoorAdmissions.map((admission) => {
                const appointment = admission?.appointmentId;
                const doctor = admission?.doctorId;
                const user = appointment?.userId;
                const bed = admission?.bedId;

                return (
                  <div
                    key={admission._id}
                    className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300/80 transition-all flex flex-col justify-between border-t-4 border-t-teal-500 group relative"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                            Admitted Patient
                          </span>
                          <h3 className="font-black text-base text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors">
                            {appointment?.patientName || "Patient Data Missing"}
                          </h3>
                          <span className="text-[10px] font-bold bg-teal-50/70 border border-teal-100/50 text-teal-800 px-2 py-0.5 rounded mt-1.5 inline-flex items-center gap-1">
                            <FaUserMd className="text-[9px]" /> Consultant:{" "}
                            {doctor?.name || "Unknown Doctor"}
                          </span>
                        </div>
                        <span className="bg-slate-50 text-slate-700 text-xs font-black px-2.5 py-1.5 rounded-xl border border-slate-200 whitespace-nowrap flex items-center gap-1.5 shadow-2xs">
                          <FaBed className="text-slate-400" /> Bed:{" "}
                          {bed?.bedNumber || "Pending"}
                        </span>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs text-slate-600 font-medium">
                        <div>
                          <span className="text-slate-400 block font-normal text-[9px] uppercase tracking-wide">
                            Age / Gender
                          </span>
                          <span className="font-bold text-slate-800">
                            {calculateAge(appointment?.patientDob)} /{" "}
                            {appointment?.patientGender || "--"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-normal text-[9px] uppercase tracking-wide">
                            Contact No
                          </span>
                          <span className="font-bold text-slate-800 tracking-wide">
                            {user?.phone || user?.contact || "--"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-normal text-[9px] uppercase tracking-wide">
                            Admission Type
                          </span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                            {admission.admissionType === "Surgery" ? (
                              <>
                                <FaCut className="text-rose-500 text-[10px]" />{" "}
                                Surgery Case
                              </>
                            ) : (
                              <>
                                <FaPills className="text-teal-500 text-[10px]" />{" "}
                                Medical Care
                              </>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-normal text-[9px] uppercase tracking-wide">
                            Live Location
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-extrabold rounded px-2 py-0.5 mt-0.5 text-[9px] border ${
                              admission.locationStatus === "In OT"
                                ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                : admission.locationStatus === "Recovery"
                                  ? "bg-purple-50 text-purple-700 border-purple-200/60"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            }`}
                          >
                            {admission.locationStatus === "In OT" && (
                              <FaCut className="text-[9px]" />
                            )}
                            {admission.locationStatus === "Recovery" && (
                              <FaHeartbeat className="text-[9px]" />
                            )}
                            {admission.locationStatus === "In Ward" && (
                              <FaProcedures className="text-[9px]" />
                            )}
                            {admission.locationStatus || "In Ward"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/50 relative">
                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                          <MdOutlineNotes className="text-teal-600 text-[11px]" />{" "}
                          Medical Directives:
                        </div>
                        <p className="text-xs text-slate-700 font-bold italic leading-relaxed">
                          {admission.notes || "Patient baseline stats clear."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span className="text-slate-400 text-[11px]">
                        Total Rounds Completed
                      </span>
                      <span className="text-slate-800 font-black bg-slate-100 px-2.5 py-1 rounded-lg text-[11px]">
                        {admission.totalRounds || 0} Rounds
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
