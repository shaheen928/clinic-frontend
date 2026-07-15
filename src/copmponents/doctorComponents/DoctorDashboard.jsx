import { useGetDoctorDashboardQuery } from "../../store/services/doctorApi";
import { useGetDoctorProfileQuery } from "../../store/services/doctorApi";

import {
  LuWallet,
  LuUsers,
  LuCalendarCheck,
  LuUser,
  LuClock,
  LuActivity,
  LuSparkles,
} from "react-icons/lu";

const DoctorDashboard = () => {
  const { data: doctorData } = useGetDoctorProfileQuery();
  console.log("doctorData", doctorData);

  const doctorName = doctorData?.doctorData?.name || "Doctor";
  const available = doctorData?.doctorData?.available ?? true;
  const isSurgeon = doctorData?.doctorData?.isSurgeon ?? false;

  const { data, isLoading, error } = useGetDoctorDashboardQuery();
  const dashData = data?.dashData;

  const formatDate = (slotDate) => {
    if (!slotDate) {
      return "";
    }
    return new Date(slotDate.replaceAll("_", "-")).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 text-left font-sans antialiased">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Welcome, {doctorName}!
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-1">
          Overview and statistics for your clinic today.
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-16 text-slate-400 font-bold tracking-wide animate-pulse flex flex-col items-center justify-center gap-2">
          <LuActivity className="w-6 h-6 text-teal-600 animate-spin" />
          Loading dashboard data...
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-center text-sm font-bold border border-rose-100 shadow-2xs">
          Failed to load dashboard statistics. Please check your connection.
        </div>
      )}

      {!isLoading && !error && dashData && (
        <div className="space-y-6">
          <div
            className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${isSurgeon ? "lg:grid-cols-4" : "md:grid-cols-4"}`}
          >
            <div className="bg-linear-to-br from-teal-600 to-teal-800 p-6 rounded-2xl shadow-lg shadow-teal-600/10 flex items-center justify-between text-white group transition-all duration-200">
              <div>
                <p className="text-xs text-teal-100 font-bold uppercase tracking-wider">
                  Your Earnings (Net)
                </p>
                <h3 className="text-2xl font-black mt-1.5 tracking-tight">
                  Rs. {dashData.earnings?.toLocaleString() || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-white/10 text-white rounded-xl flex items-center justify-center text-xl backdrop-blur-md">
                <LuWallet className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex items-center justify-between group transition-all duration-200">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Total Patients History
                </p>
                <h3 className="text-2xl font-black text-slate-800 mt-1.5 tracking-tight">
                  {dashData.patients || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl">
                <LuUsers className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between overflow-hidden group transition-all duration-200">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Active Bookings
                  </p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1.5 tracking-tight">
                    {dashData.appointments || 0}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                  <LuCalendarCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-rose-50/50 border-t border-rose-100/60 px-6 py-2.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-rose-600">
                  <span>❌ Cancelled OPD</span>
                  <span className="text-rose-700 bg-white px-1.5 py-0.5 rounded-md shadow-2xs border border-rose-100">
                    {dashData.cancelledAppointments || 0}
                  </span>
                </div>
                {isSurgeon && (
                  <div className="flex items-center justify-between text-[11px] font-bold text-rose-600 border-t border-rose-100/40 pt-1.5">
                    <span>✂️ Cancelled Surgery</span>
                    <span className="text-rose-700 bg-white px-1.5 py-0.5 rounded-md shadow-2xs border border-rose-100">
                      {dashData.cancelledSurgeries || 0}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex items-center justify-between group transition-all duration-200">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Availability
                </p>
                <h3
                  className={`text-xl font-black mt-1.5 tracking-tight ${available ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {available ? "Available" : "On Leave"}
                </h3>
              </div>
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl ${available ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
              >
                {available ? <LuSparkles className="w-5 h-5" /> : "💤"}
              </div>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 gap-6 ${isSurgeon && dashData.surgerySchedule?.length > 0 ? "lg:grid-cols-3" : "grid-cols-1"}`}
          >
            <div
              className={`${isSurgeon && dashData.surgerySchedule?.length > 0 ? "lg:col-span-2" : ""} bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs`}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-black text-slate-800 tracking-wide">
                  Recent Bookings
                </h2>
                <span className="text-[11px] bg-slate-50 border border-slate-200/60 text-slate-500 font-bold px-2.5 py-1 rounded-xl tracking-wide">
                  Latest 5 Patients
                </span>
              </div>

              <div className="hidden sm:flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
                <div className="w-1/3 min-w-37">Patient Details</div>
                <div className="text-center flex-1">Schedule</div>
                <div className="text-right w-24">Status</div>
              </div>

              <div className="divide-y divide-slate-100">
                {dashData.latestAppointments &&
                dashData.latestAppointments.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm font-medium">
                    No recent bookings found.
                  </p>
                ) : (
                  dashData.latestAppointments?.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-3.5 hover:bg-slate-50/40 px-2 rounded-xl transition-colors gap-3 sm:gap-0"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-1/3 sm:min-w-37">
                        <div className="h-9 w-9 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl flex items-center justify-center text-xs font-black shrink-0">
                          {item.userData?.name ? (
                            item.userData.name.charAt(0)
                          ) : (
                            <LuUser className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-700 text-sm leading-tight truncate">
                            {item.userData?.name || "Patient"}
                          </h4>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                            {item.patientGender || "Patient Profile"}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:justify-center justify-between flex-1 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-slate-100 sm:border-none">
                        <span className="block text-slate-400 sm:hidden text-[10px] font-bold uppercase tracking-wider">
                          Schedule:
                        </span>
                        <div className="text-right sm:text-center">
                          <span className="block font-bold text-slate-700 text-xs tracking-wide whitespace-nowrap">
                            {formatDate(item.slotDate)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md mt-1 border border-teal-100/50 whitespace-nowrap">
                            <LuClock className="w-3 h-3" /> {item.slotTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex sm:justify-end items-center justify-between sm:w-24 w-full px-1 sm:px-0">
                        <span className="block text-slate-400 sm:hidden text-[10px] font-bold uppercase tracking-wider">
                          Status:
                        </span>
                        <div>
                          {item.cancelled ? (
                            <span className="text-[10px] font-black uppercase tracking-wide text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 inline-block">
                              Cancelled
                            </span>
                          ) : item.isCompleted ? (
                            <span className="text-[10px] font-black uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block">
                              Completed
                            </span>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-wide text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block">
                              Booked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {isSurgeon && dashData.surgerySchedule && (
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-base font-black text-slate-800 tracking-wide">
                      OT Schedule
                    </h2>
                    <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Pending ({dashData.pendingSurgeries || 0})
                    </span>
                  </div>

                  <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
                    {dashData.surgerySchedule.length === 0 ? (
                      <p className="text-center py-12 text-slate-400 text-sm font-medium">
                        No surgeries scheduled.
                      </p>
                    ) : (
                      dashData.surgerySchedule.map((surgery) => (
                        <div
                          key={surgery.id}
                          className="p-3.5 bg-slate-50/60 border border-slate-200/60 rounded-xl space-y-2 hover:border-amber-300/80 transition-all group"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-teal-600 transition-colors truncate">
                              {surgery.patientName}
                            </h4>
                            <span
                              className={`text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${surgery.urgency === "Emergency" ? "bg-rose-100 text-rose-700 border border-rose-200/50" : "bg-blue-100 text-blue-700 border border-blue-200/50"}`}
                            >
                              {surgery.urgency}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                            <span className="text-slate-400 shrink-0">
                              Procedure:
                            </span>{" "}
                            <span className="truncate">
                              ✂️ {surgery.surgeryName}
                            </span>
                          </p>
                          <div className="flex flex-wrap justify-between items-center gap-1 text-[10px] text-slate-400 font-bold border-t border-slate-200/40 pt-2 mt-1.5">
                            <span>📅 {surgery.date}</span>
                            <span>⏰ {surgery.time}</span>
                            <span className="text-teal-700 font-black bg-white border border-slate-200/80 px-1.5 py-0.5 rounded-md shadow-3xs">
                              {surgery.theater}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
