import { useState } from "react";
import {
  useGetDoctorAdmissionsQuery,
  useDoctorDischargeInpatientMutation,
  useDoctorMarkPatientRoundMutation,
  useDoctorCompletePatientSurgeryMutation,
  useDoctorCancelSurgeryMutation,
} from "../../store/services/doctorApi";
import { toast } from "react-toastify";

import {
  LuBed,
  LuHospital,
  LuScissors,
  LuStethoscope,
  LuHouse,
  LuClock,
  LuCalendarDays,
  LuActivity,
  LuCircleX,
  LuUser,
} from "react-icons/lu";

const InpatientsManager = () => {
  const { data, isLoading, error } = useGetDoctorAdmissionsQuery();
  const [dischargeInpatient, { isLoading: isDischarging }] =
    useDoctorDischargeInpatientMutation();
  const [markPatientRound, { isLoading: isMarkingRound }] =
    useDoctorMarkPatientRoundMutation();
  const [completeSurgery, { isLoading: isCompletingSurgery }] =
    useDoctorCompletePatientSurgeryMutation();
  const [cancelSurgery, { isLoading: isCancellingSurgery }] =
    useDoctorCancelSurgeryMutation();

  const [activeTab, setActiveTab] = useState("Admitted");
  const admissionsList = data?.data || [];

  const isDoctorSurgeon = data?.isSurgeon === true;

  const admittedPatients = admissionsList.filter(
    (item) =>
      item.status === "Admitted" ||
      item.status === "Active" ||
      item.status === "Awaiting Bed",
  );

  const scheduledSurgeries = admissionsList.filter(
    (item) => item.admissionType === "Surgery" && item.status === "Scheduled",
  );

  const handleCancelSurgerySubmit = async (id) => {
    if (
      !window.confirm("Are you sure you want to cancel this scheduled surgery?")
    )
      return;
    try {
      await cancelSurgery(id).unwrap();
      toast.success(
        "Surgery cancelled successfully and removed from schedule! ❌",
      );
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to cancel surgery");
    }
  };

  const handleCompleteSurgerySubmit = async (id) => {
    if (
      !window.confirm(
        "Are you sure this surgery is completed? Patient will be moved to Post-Op status.",
      )
    )
      return;
    try {
      await completeSurgery(id).unwrap();
      toast.success(
        "Surgery marked as completed! Patient shifted to Post-Op. 🩺",
      );
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to complete surgery");
    }
  };

  const handleMarkRoundSubmit = async (admissionId) => {
    try {
      const res = await markPatientRound(admissionId).unwrap();
      toast.success(res.message || "Round marked! 🩺");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to record round");
    }
  };

  const handleDischarge = async (id) => {
    const notes = prompt("Enter discharge notes (optional):");
    try {
      await dischargeInpatient({ id, dischargeNotes: notes }).unwrap();
      toast.success("Patient discharged successfully! 🏠");
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6 text-left font-sans antialiased">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          In-Patients Manager
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Dynamically manage OT schedules and active ward beds.
        </p>
      </div>

      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("Admitted")}
          className={`py-2.5 px-5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "Admitted"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <LuHospital className="w-4 h-4 " /> Active Ward Admissions (
          {admittedPatients.length})
        </button>

        {isDoctorSurgeon && (
          <button
            onClick={() => setActiveTab("Surgery")}
            className={`py-2.5 px-5 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "Surgery"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <LuCalendarDays className="w-4 h-4 " /> OT Scheduled Surgeries (
            {scheduledSurgeries.length})
          </button>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-20 text-slate-400 font-bold tracking-wide animate-pulse flex flex-col items-center justify-center gap-2">
          <LuActivity className="w-6 h-6 text-teal-600 animate-spin" />
          Loading ledger...
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-center text-sm font-bold border border-rose-100 shadow-2xs">
          Error loading data.
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-widest border-b border-slate-100">
                  <th className="py-4 px-6 whitespace-nowrap">
                    Patient Details
                  </th>
                  <th className="py-4 px-6 whitespace-nowrap">
                    {activeTab === "Admitted"
                      ? "Admission Date"
                      : "Surgery Date"}
                  </th>
                  <th className="py-4 px-6 text-center">Facility/Location</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center w-52">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {activeTab === "Admitted" &&
                  (admittedPatients.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-slate-400 font-medium"
                      >
                        No patients physically in ward.
                      </td>
                    </tr>
                  ) : (
                    admittedPatients.map((item) => {
                      const patientName =
                        item.appointmentId?.patientName ||
                        item.appointmentId?.patientData?.name ||
                        "Patient Ledger Record";
                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-slate-50/40 transition-colors align-middle"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                                {patientName ? (
                                  patientName.charAt(0).toUpperCase()
                                ) : (
                                  <LuUser className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-700 text-sm leading-tight">
                                  {patientName}
                                </h4>
                                <div className="flex flex-col gap-1 mt-1">
                                  <span className="text-[11px] text-slate-400 font-bold">
                                    Type:{" "}
                                    {item.admissionType === "Surgery"
                                      ? "Surgery Admission"
                                      : "General Admission"}
                                  </span>
                                  <span className="text-[11px] font-black text-slate-600 flex items-center gap-1">
                                    🔄 Total Rounds:{" "}
                                    <span className="bg-teal-50 text-teal-700 text-[10px] px-1.5 py-0.2 rounded font-black border border-teal-100/50">
                                      {item.totalRounds || 0}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs font-bold text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <LuCalendarDays className="w-3.5 h-3.5 text-slate-400" />{" "}
                              {formatDate(item.createdAt)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center text-xs font-black text-slate-600">
                            {item.status === "Awaiting Bed" ? (
                              <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50">
                                <LuClock className="w-3 h-3 animate-spin" />{" "}
                                Waiting Area
                              </span>
                            ) : item.admissionType === "Surgery" ? (
                              item.surgeryDetails?.surgeryStatus ===
                              "Completed" ? (
                                <span className="inline-flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100/50">
                                  <LuHospital className="w-3 h-3" /> Post-Op /
                                  Surgical Ward
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/50">
                                  <LuBed className="w-3 h-3" /> Pre-Op Ward
                                </span>
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                                <LuBed className="w-3 h-3" /> General Ward
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {item.status === "Awaiting Bed" ? (
                              <span className="text-[10px] font-black uppercase tracking-wide text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 animate-pulse">
                                Awaiting Bed
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                Admitted
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {item.admissionType === "Surgery" &&
                                item.surgeryDetails?.surgeryStatus ===
                                  "Pending" && (
                                  <button
                                    onClick={() =>
                                      handleCompleteSurgerySubmit(item._id)
                                    }
                                    disabled={isCompletingSurgery}
                                    className="text-[11px] font-black bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white px-2.5 py-2 rounded-xl border border-purple-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                  >
                                    <LuStethoscope className="w-3.5 h-3.5" />
                                    {isCompletingSurgery
                                      ? "..."
                                      : "Complete Surgery"}
                                  </button>
                                )}

                              {item.status === "Awaiting Bed" ? (
                                <>
                                  <button
                                    disabled
                                    title="Bed allocation required from Admin to mark rounds"
                                    className="text-[11px] font-black bg-slate-100 text-slate-400 px-3 py-2 rounded-xl border border-slate-200 opacity-60 cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
                                  >
                                    <LuStethoscope className="w-3.5 h-3.5" />{" "}
                                    Round
                                  </button>
                                  <button
                                    disabled
                                    title="Bed allocation required from Admin to discharge"
                                    className="text-[11px] font-black bg-slate-100 text-slate-400 px-3 py-2 rounded-xl border border-slate-200 opacity-60 cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
                                  >
                                    <LuHouse className="w-3.5 h-3.5" />{" "}
                                    Discharge
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      handleMarkRoundSubmit(item._id)
                                    }
                                    disabled={isMarkingRound}
                                    className="text-[11px] font-black bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white px-3 py-2 rounded-xl border border-teal-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                                  >
                                    <LuStethoscope className="w-3.5 h-3.5" />
                                    {isMarkingRound ? "..." : "Round"}
                                  </button>
                                  <button
                                    onClick={() => handleDischarge(item._id)}
                                    disabled={isDischarging}
                                    className="text-[11px] font-black bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl border border-rose-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                                  >
                                    <LuHouse className="w-3.5 h-3.5" />
                                    Discharge
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ))}

                {activeTab === "Surgery" &&
                  isDoctorSurgeon &&
                  (scheduledSurgeries.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-slate-400 font-medium"
                      >
                        No pending surgeries in schedule.
                      </td>
                    </tr>
                  ) : (
                    scheduledSurgeries.map((item) => {
                      const patientName =
                        item.appointmentId?.patientName ||
                        item.appointmentId?.patientData?.name ||
                        "Patient Ledger Record";
                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-slate-50/40 transition-colors align-middle"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                                {patientName ? (
                                  patientName.charAt(0).toUpperCase()
                                ) : (
                                  <LuUser className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-700 text-sm leading-tight">
                                  {patientName}
                                </h4>
                                <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100/50 font-bold mt-1">
                                  <LuScissors className="w-3 h-3" />{" "}
                                  {item.surgeryDetails?.surgeryName}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs font-bold text-purple-700">
                            <div className="flex items-center gap-1">
                              <LuCalendarDays className="w-3.5 h-3.5 text-purple-400" />{" "}
                              {formatDate(item.surgeryDetails?.surgeryDate)}
                            </div>
                            <div className="text-[10px] text-slate-500 font-black mt-1 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                              <LuClock className="w-3 h-3" />{" "}
                              {formatTime(item.surgeryDetails?.surgeryDate)}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-slate-600 text-xs">
                            <span className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-md shadow-3xs">
                              Theater #{item.surgeryDetails?.theaterNo}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="text-[10px] font-black uppercase tracking-wide text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                              Scheduled
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleCancelSurgerySubmit(item._id)
                                }
                                disabled={isCancellingSurgery}
                                className="w-full text-[11px] font-black bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl border border-rose-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <LuCircleX className="w-3.5 h-3.5" />
                                {isCancellingSurgery ? "..." : "Cancel Surgery"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InpatientsManager;
