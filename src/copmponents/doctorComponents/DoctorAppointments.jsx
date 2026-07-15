import { useState } from "react";
import {
  useGetDoctorAppointmentsQuery,
  useDoctorCompleteAppointmentMutation,
  useDoctorCancelAppointmentMutation,
} from "../../store/services/doctorApi";
import AdmissionModal from "./AdmissionModal";
import { toast } from "react-toastify";

import {
  LuCalendarDays,
  LuCheck,
  LuX,
  LuClock,
  LuUser,
  LuActivity,
  LuBed,
} from "react-icons/lu";

const DoctorAppointments = () => {
  const { data, isLoading, error } = useGetDoctorAppointmentsQuery();

  const [completeAppointment] = useDoctorCompleteAppointmentMutation();
  const [cancelAppointment] = useDoctorCancelAppointmentMutation();

  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");

  const appointments = data?.appointments || [];

  const isSurgeon = data?.isSurgeon || false;

  const formatDate = (slotDate) => {
    if (!slotDate) return "";
    return new Date(slotDate.replaceAll("_", "-")).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleComplete = async (id) => {
    try {
      await completeAppointment(id).unwrap();
      toast.success("Appointment marked as completed 🌟");
    } catch (err) {
      console.error("Failed to complete appointment:", err);
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id).unwrap();
      toast.error("Appointment cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
  };

  const openAdmission = (id) => {
    setSelectedAppointmentId(id);
    setIsAdmissionOpen(true);
  };

  return (
    <div className="space-y-6 text-left font-sans antialiased">
      <AdmissionModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        appointmentId={selectedAppointmentId}
        isSurgeon={isSurgeon}
      />

      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          All Appointments
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Manage and track all patient bookings here.
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-20 text-slate-400 font-bold tracking-wide animate-pulse flex flex-col items-center justify-center gap-2">
          <LuActivity className="w-6 h-6 text-teal-600 animate-spin" />
          Loading appointments...
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-center text-sm font-bold border border-rose-100 shadow-2xs">
          Failed to load data.
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
            <h2 className="font-black text-slate-800 tracking-wide">
              Appointment List
            </h2>
            <span className="text-[11px] font-black bg-teal-50 text-teal-700 border border-teal-100/60 px-2.5 py-1 rounded-xl tracking-wide">
              Total: {appointments.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-widest border-b border-slate-100">
                  <th className="py-4 px-6 text-center w-16">#</th>
                  <th className="py-4 px-6 whitespace-nowrap">
                    Patient Details
                  </th>
                  <th className="py-4 px-6 text-center whitespace-nowrap">
                    Date & Time
                  </th>
                  <th className="py-4 px-6 text-center">Amount</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center w-32">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      No appointments scheduled yet.
                    </td>
                  </tr>
                ) : (
                  appointments.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="py-4 px-6 text-center font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl flex items-center justify-center font-black text-xs">
                            {item.patientData?.name ? (
                              item.patientData.name.charAt(0).toUpperCase()
                            ) : (
                              <LuUser className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-700 text-sm leading-tight">
                              {item.patientData?.name || "Patient"}
                            </h4>
                            <p className="text-[11px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                              Age: {item.patientData?.age || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="block font-bold text-slate-700 text-xs tracking-wide">
                          {formatDate(item.slotDate)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md mt-1 border border-teal-100/50">
                          <LuClock className="w-3 h-3" /> {item.slotTime}
                        </span>
                      </td>

                      <td className="px-4 py-6 text-center font-black text-slate-700 text-xs">
                        PKR {item.amount || 0}
                      </td>

                      <td className="py-4 px-6 text-center">
                        {item.cancelled ? (
                          <span className="text-[10px] font-black uppercase tracking-wide text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                            Cancelled
                          </span>
                        ) : item.isCompleted ? (
                          item.admissionStatus === "General" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 animate-pulse">
                              <LuActivity className="w-3 h-3" /> Awaiting Bed
                            </span>
                          ) : item.admissionStatus === "Surgery" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                              <LuCalendarDays className="w-3 h-3" /> Surgery
                              Scheduled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                              <LuSparkles className="w-3 h-3" /> Completed
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wide text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                            Booked
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        {!item.cancelled && !item.isCompleted ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openAdmission(item._id)}
                              className="h-8 w-8 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-3xs border border-blue-100/80"
                              title="Admit Patient / Schedule Surgery"
                            >
                              <LuBed className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleComplete(item._id)}
                              className="h-8 w-8 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-3xs border border-emerald-100/80"
                              title="Mark Completed"
                            >
                              <LuCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(item._id)}
                              className="h-8 w-8 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-3xs border border-rose-100/80"
                              title="Cancel Appointment"
                            >
                              <LuX className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-300">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
