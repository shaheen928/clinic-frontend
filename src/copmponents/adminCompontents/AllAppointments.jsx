import { useGetAdminAppointmentsQuery } from "../../store/services/adminApi";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaUserMd,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
const AllAppointments = () => {
  const { data, isLoading, error } = useGetAdminAppointmentsQuery();
  const appointmentList = data?.appointments || [];
 
  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "No Date";

    const parts = dateString.split("_");
    if (parts.length !== 3) return dateString;

    const day = parts[0];
    const monthNum = parts[1];
    const year = parts[2];

    const months = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    };

    const monthName = months[monthNum] || "Jun";
    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  };

  return (
    <div className="space-y-6 text-left" dir="ltr">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          All Appointments
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor and manage all patient bookings across ShifaClick.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 font-medium space-y-3">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading appointments log...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-center font-medium shadow-sm animate-in fade-in duration-200">
          Failed to load appointments. Please ensure backend server is running.
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 px-6 text-center w-12">#</th>
                  <th className="p-4 px-6">Patient</th>
                  <th className="p-4 px-6">Date & Time</th>
                  <th className="p-4 px-6">Doctor Info</th>
                  <th className="p-4 px-6">Fees</th>
                  <th className="p-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {appointmentList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      No appointments booked yet.
                    </td>
                  </tr>
                ) : (
                  appointmentList.map((item, index) => (
                
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/40 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-center font-semibold text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
                            <FaUser />
                          </div>
                          <span className="font-semibold text-slate-800 whitespace-nowrap">
                            {item.patientName || "Regular Patient"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <FaCalendarAlt className="text-slate-400 text-xs" />
                          <span>{formatDate(item.slotDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-teal-600 bg-teal-50/60 border border-teal-100/50 px-2 py-0.5 rounded w-max">
                          <FaClock className="text-[10px]" />
                          <span>{item.slotTime || "Default Slot"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-xs mt-0.5">
                            <FaUserMd />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block whitespace-nowrap">
                              {item.docData?.name || "Doctor"}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {item.docData?.speciality}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-bold text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <FaWallet className="text-slate-400 text-xs font-normal" />
                          <span>Rs {item.amount}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {item.cancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                            <FaTimesCircle className="text-[11px]" />
                            Cancelled
                          </span>
                        ) : item.isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                            <FaCheckCircle className="text-[11px]" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                            <FaHourglassHalf className="text-[10px]" />
                            Booked
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

export default AllAppointments;
