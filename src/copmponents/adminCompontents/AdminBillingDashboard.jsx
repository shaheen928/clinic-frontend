import React, { useState } from "react";
import {
  useGetAdminBillingDashboardQuery,
  useAdminMarkBillAsPaidMutation,
  useAdminMarkAppointmentAsPaidMutation,
} from "../../store/services/adminApi";
import { toast } from "react-toastify";
import {
  FaWallet,
  FaBed,
  FaUserCheck,
  FaLock,
  FaCalendarCheck,
  FaCoins,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const AdminBillingDashboard = () => {
  const [activeTab, setActiveTab] = useState("indoor");

  const { data, isLoading, refetch } = useGetAdminBillingDashboardQuery();
  const [markIndoorPaid, { isLoading: isIndoorPaying }] =
    useAdminMarkBillAsPaidMutation();
  const [markAppointmentPaid, { isLoading: isCounterPaying }] =
    useAdminMarkAppointmentAsPaidMutation();

  const handleIndoorPay = async (admissionId) => {
    if (
      !window.confirm(
        "Are you sure you want to receive cash and close this admission bill?",
      )
    )
      return;
    try {
      await markIndoorPaid(admissionId).unwrap();
      toast.success("Indoor bill closed and bed released successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleCounterPay = async (appointmentId) => {
    try {
      await markAppointmentPaid(appointmentId).unwrap();
      toast.success("Checkup fee received via cash successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        Loading Dashboard Data...
      </div>
    );

  const { counterBookings = [], indoorAdmissions = [] } = data?.data || {};

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
            <FaWallet className="text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              Counter Finance Monitor
            </h2>
            <p className="text-sm text-gray-500">
              Live management of counter cash collections and indoor billing
            </p>
          </div>
        </div>

        <div className="flex bg-slate-200/70 p-1 rounded-xl w-full md:w-auto overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab("indoor")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
              activeTab === "indoor"
                ? "bg-slate-800 text-white shadow"
                : "text-gray-600 hover:text-slate-800"
            }`}
          >
            <FaBed className="text-xs" /> Indoor Patients (
            {indoorAdmissions.length})
          </button>
          <button
            onClick={() => setActiveTab("counter")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
              activeTab === "counter"
                ? "bg-slate-800 text-white shadow"
                : "text-gray-600 hover:text-slate-800"
            }`}
          >
            <FaUserCheck className="text-xs" /> Counter Bookings / OPD (
            {counterBookings.length})
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 transition-colors duration-150">
          <table className="w-full text-left border-collapse min-w-240">
            <thead className="bg-slate-800 text-white text-xs uppercase tracking-wider font-bold">
              {activeTab === "indoor" ? (
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Bed No.</th>
                  <th className="p-4">Admission Type</th>
                  <th className="p-4">Live Status</th>
                  <th className="p-4">Total Days</th>
                  <th className="p-4">Live Current Bill</th>
                  <th className="p-4 text-center w-48">Action</th>
                </tr>
              ) : (
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Doctor Name</th>
                  <th className="p-4">Date / Time</th>
                  <th className="p-4">Checkup Fee</th>
                  <th className="p-4 text-center w-40">Action</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {activeTab === "indoor" &&
                indoorAdmissions.map((bill) => {
                  const isDischarged = bill.status === "Discharged";
                  const isAwaitingBed =
                    !bill.bedNumber || bill.bedNumber === "Not Assigned";

                  return (
                    <tr
                      key={bill.admissionId}
                      className="hover:bg-slate-50/80 transition-colors align-middle"
                    >
                      <td className="p-4 font-semibold text-gray-800 whitespace-nowrap">
                        {bill.patientName}
                      </td>
                      <td className="p-4 text-gray-600 font-medium whitespace-nowrap">
                        {isAwaitingBed ? (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                            Pending Assignment
                          </span>
                        ) : (
                          `Bed ${bill.bedNumber}`
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                          {bill.admissionType}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {isDischarged ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-full border border-amber-200 animate-pulse">
                            <FaCalendarCheck className="text-[10px]" /> Ready
                            for Clearance
                          </span>
                        ) : isAwaitingBed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-full border border-amber-200">
                            <FaBed className="text-[10px]" /> Awaiting Bed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 rounded-full border border-purple-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-ping"></span>
                            Active In-Patient
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-bold text-slate-700 whitespace-nowrap">
                        {bill.totalDays || 0} Days
                      </td>
                      <td className="p-4 font-black text-slate-900 whitespace-nowrap">
                        PKR {bill.grandTotal?.toLocaleString() || 0}
                      </td>

                      <td className="p-4 text-center whitespace-nowrap">
                        {isDischarged ? (
                          <button
                            disabled={isIndoorPaying}
                            onClick={() => handleIndoorPay(bill.admissionId)}
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:bg-emerald-400 cursor-pointer"
                          >
                            <FaCheckCircle className="text-xs" />
                            {isIndoorPaying
                              ? "Processing..."
                              : "Receive Cash & Close"}
                          </button>
                        ) : (
                          <span className="w-full inline-flex items-center justify-center gap-1 text-xs text-gray-400 font-medium bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-xl cursor-not-allowed">
                            <FaLock className="text-[10px]" /> Waiting for
                            Discharge
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

              {activeTab === "counter" &&
                counterBookings.map((app) => (
                  <tr
                    key={app.appointmentId}
                    className="hover:bg-slate-50/80 transition-colors align-middle"
                  >
                    <td className="p-4 font-semibold text-gray-800 whitespace-nowrap">
                      {app.patientName}
                    </td>
                    <td className="p-4 text-gray-600 font-medium whitespace-nowrap">
                     {app.doctorName}
                    </td>
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      {app.appointmentDate} - {app.slotTime}
                    </td>
                    <td className="p-4 font-black text-emerald-700 whitespace-nowrap">
                      PKR {app.feeAmount?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        disabled={isCounterPaying}
                        onClick={() => handleCounterPay(app.appointmentId)}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:bg-blue-400 cursor-pointer"
                      >
                        {isCounterPaying ? (
                          <FaSpinner className="animate-spin text-xs" />
                        ) : (
                          <FaCoins className="text-xs" />
                        )}
                        {isCounterPaying ? "..." : "Receive Cash"}
                      </button>
                    </td>
                  </tr>
                ))}

              {((activeTab === "indoor" && indoorAdmissions.length === 0) ||
                (activeTab === "counter" && counterBookings.length === 0)) && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-12 text-gray-400 font-medium whitespace-nowrap"
                  >
                    No records found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBillingDashboard;
