import React, { useState } from "react";
import {
  useGetMyAppointmentsQuery,
  useCancelAppointmentMutation,
  usePayWithStripeMutation,
  useGetUserLiveBillQuery,
  usePayIndoorBillMutation,
} from "../../store/services/userApi";
import { toast } from "react-toastify";
import {
  FiUser,
  FiLayers,
  FiCalendar,
  FiActivity,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiX,
  FiFileText,
  FiMapPin,
} from "react-icons/fi";

const AppointmentCard = ({
  item,
  handleStripePayment,
  handleCancel,
  handleIndoorPayment,
  processingAppointmentId,
  cancellingAppointmentId,
  setSelectedAppointmentId,
}) => {
  const { data: billResponse } = useGetUserLiveBillQuery(item._id, {
    refetchOnWindowFocus: false,
  });

  const admission = billResponse?.data;

  const isCurrentlyPaying = processingAppointmentId === item._id;
  const isCurrentlyCancelling = cancellingAppointmentId === item._id;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.12)] hover:border-indigo-100/90 transition-all duration-300 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-4xl mx-auto w-full group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-3xl" />

      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1 min-w-0 w-full">
        <div className="relative shrink-0">
          <img
            src={item.docData?.image || "https://via.placeholder.com/150"}
            alt={item.docData?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
        </div>

        <div className="space-y-2.5 flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100/30">
              {item.docData?.speciality}
            </span>

            <span className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
              <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.slotDate}</span>
              <span className="text-slate-300">|</span>
              <FiClock className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.slotTime}</span>
            </span>
          </div>

          <h3 className="font-black text-xl text-slate-800 tracking-tight truncate group-hover:text-indigo-950 transition-colors">
            {item.docData?.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/40">
              <FiUser className="w-3.5 h-3.5 text-slate-400" />
              <span>Patient:</span>
              <strong className="text-slate-800 font-bold">
                {item.patientName || "Self"}
              </strong>
            </span>

            {admission && admission.status && admission.status !== "None" ? (
              admission.status === "Discharged" ? (
                <span className="inline-flex items-center text-xs text-amber-700 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 shadow-inner gap-1.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Medical Treatment Completed (Discharged)</span>
                </span>
              ) : !admission.bedNumber ||
                admission.bedNumber === "Not Assigned" ? (
                <span className="inline-flex items-center text-xs text-amber-800 font-bold bg-amber-50/60 px-3 py-1.5 rounded-xl border border-amber-200/60 shadow-inner gap-1.5 animate-pulse">
                  <FiClock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admission Approved — Bed Allocating...</span>
                </span>
              ) : (
                <span className="inline-flex flex-wrap items-center text-xs text-purple-700 font-bold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200/60 shadow-inner gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                  </span>

                  <span className="text-purple-900 font-black">
                    {admission.wardCategory || "In Ward"}
                  </span>

                  <span className="text-purple-300 font-light">|</span>

                  <span className="bg-purple-100/80 px-2 py-0.5 rounded-md text-[11px] text-purple-800 border border-purple-200/40 flex items-center gap-1">
                    <FiMapPin className="w-3 h-3 text-purple-500" />
                    <span>Location:</span>
                    <strong className="font-extrabold text-purple-900">
                      {admission.locationStatus || "In Ward"}
                    </strong>
                  </span>

                  <span className="text-purple-300 font-light">|</span>

                  <span className="text-purple-700 font-bold flex items-center gap-1">
                    <FiLayers className="w-3 h-3 text-purple-400" />
                    <span>
                      Bed:{" "}
                      {admission.bedNumber
                        ? `Bed ${admission.bedNumber}`
                        : "Assigned"}
                    </span>
                  </span>
                </span>
              )
            ) : (
              <span className="inline-flex items-center text-xs text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-sm gap-1.5">
                <FiActivity className="w-3.5 h-3.5 text-slate-400" />
                <span>OPD Visit</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto border-t border-slate-50 md:border-none pt-4 md:pt-0">
        <div className="flex items-center gap-2">
          {admission && admission.status && admission.status !== "None" ? (
            <>
              {admission.status === "Admitted" &&
                (!admission.bedNumber ||
                  admission.bedNumber === "Not Assigned") && (
                  <span className="px-3 py-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 rounded-full border border-amber-200/60 shadow-sm animate-pulse flex items-center gap-1">
                    ● Awaiting Bed
                  </span>
                )}

              {admission.status === "Admitted" &&
                admission.bedNumber &&
                admission.bedNumber !== "Not Assigned" && (
                  <span className="px-3 py-1 text-[11px] font-extrabold text-purple-700 bg-purple-50 rounded-full border border-purple-200/60 shadow-sm flex items-center gap-1">
                    ● Admitted
                  </span>
                )}

              {admission.status === "Discharged" &&
                admission.dischargeStatus === "Pending Clearance" && (
                  <span className="px-3 py-1 text-[11px] font-extrabold text-amber-700 bg-amber-100 rounded-full border border-amber-200/60 shadow-sm animate-pulse flex items-center gap-1">
                    ● Pending Clearance
                  </span>
                )}

              {admission.dischargeStatus === "Cleared" && (
                <span className="px-3 py-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200/60 shadow-sm flex items-center gap-1">
                  ● Cleared & Discharged
                </span>
              )}
            </>
          ) : item.cancelled ? (
            <span className="px-3 py-1 text-[11px] font-extrabold text-rose-600 bg-rose-50 rounded-full border border-rose-100 shadow-sm flex items-center gap-1">
              ● Cancelled
            </span>
          ) : item.payment ? (
            <span className="px-3 py-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm flex items-center gap-1">
              ● Paid & Confirmed
            </span>
          ) : (
            <span className="px-3 py-1 text-[11px] font-extrabold text-amber-600 bg-amber-50 rounded-full border border-amber-100 shadow-sm flex items-center gap-1">
              ● Unpaid
            </span>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto min-w-44 justify-end">
          {admission && admission.status && admission.status !== "None" ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                onClick={() => setSelectedAppointmentId(item._id)}
                className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md active:scale-[0.98] transition-all duration-200 w-full text-center border whitespace-nowrap ${
                  admission.dischargeStatus === "Cleared"
                    ? "bg-linear-to-r from-emerald-600 to-emerald-700 border-emerald-700 shadow-emerald-600/10 hover:opacity-95"
                    : "bg-linear-to-r from-indigo-600 to-indigo-700 border-indigo-700 shadow-indigo-600/10 hover:opacity-95"
                }`}
              >
                {admission.dischargeStatus === "Cleared"
                  ? "View Invoice 📄"
                  : "View Live Bill"}
              </button>

              {admission.status === "Discharged" &&
                admission.dischargeStatus === "Pending Clearance" && (
                  <button
                    disabled={processingAppointmentId === item._id}
                    onClick={() => handleIndoorPayment(item._id)}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-900 disabled:bg-slate-700 rounded-xl active:scale-[0.98] transition-all duration-200 shadow-md shadow-slate-950/10 text-center whitespace-nowrap"
                  >
                    {isCurrentlyPaying ? "Connecting..." : "Pay Online 💳"}
                  </button>
                )}
            </div>
          ) : !item.payment && !item.cancelled ? (
            <div className="flex gap-2 w-full">
              <button
                disabled={processingAppointmentId === item._id}
                className="flex-1 px-5 py-2.5 text-xs font-bold text-white bg-linear-to-r from-slate-900 to-slate-950 hover:from-slate-850 hover:to-slate-900 rounded-xl active:scale-[0.98] transition-all duration-200 shadow-md disabled:from-slate-400 disabled:to-slate-400 text-center whitespace-nowrap"
                onClick={() => handleStripePayment(item._id)}
              >
                {isCurrentlyPaying ? "Processing..." : "Pay Online"}
              </button>
              <button
                disabled={cancellingAppointmentId === item._id}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-slate-200/80 rounded-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                onClick={() => handleCancel(item._id)}
              >
                {isCurrentlyCancelling ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          ) : item.payment &&
            !item.isCompleted &&
            item.status !== "Completed" ? (
            <div className="px-4 py-2.5 text-xs font-bold bg-amber-50/80 text-amber-800 border border-amber-200/60 rounded-xl w-full text-center shadow-inner flex items-center justify-center gap-1.5 animate-pulse">
              <FiClock className="w-3.5 h-3.5 text-amber-600" />
              <span>Verified — Awaiting Checkup</span>
            </div>
          ) : (
            <button
              disabled
              className="px-4 py-2.5 text-xs font-bold bg-slate-50 text-slate-400 border border-slate-200/40 rounded-xl cursor-not-allowed w-full text-center shadow-sm"
            >
              {item.cancelled ? "Appointment Cancelled" : "Visit Completed ✅"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MyAppointments = () => {
  const { data, isLoading, isError, error } = useGetMyAppointmentsQuery();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [payWithStripe] = usePayWithStripeMutation();
  const [payIndoorBill] = usePayIndoorBillMutation();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const [processingAppointmentId, setProcessingAppointmentId] = useState(null);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState(null);

  const handleCancel = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setCancellingAppointmentId(appointmentId);
      try {
        const res = await cancelAppointment({ appointmentId }).unwrap();
        toast.success(res.message || "Appointment cancelled successfully.");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to cancel appointment.");
      } finally {
        setCancellingAppointmentId(null);
      }
    }
  };

  const handleStripePayment = async (appointmentId) => {
    setProcessingAppointmentId(appointmentId);
    try {
      const res = await payWithStripe({ appointmentId }).unwrap();
      if (res.success && res.session_url) {
        window.location.href = res.session_url;
      } else {
        toast.error("Stripe session URL not found.");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Stripe payment initiation failed.");
    } finally {
      setProcessingAppointmentId(null);
    }
  };

  const handleIndoorPayment = async (appointmentId) => {
    setProcessingAppointmentId(appointmentId);
    try {
      const res = await payIndoorBill({ appointmentId }).unwrap();
      if (res.success && res.session_url) {
        window.location.href = res.session_url;
      } else {
        toast.error("Stripe session URL not found.");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Indoor bill payment initiation failed.",
      );
    } finally {
      setProcessingAppointmentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin border-4 border-indigo-600 border-t-transparent rounded-full w-12 h-12"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto text-center bg-red-50 border border-red-100 p-6 rounded-2xl text-red-600 font-medium my-10 shadow-sm">
        ⚠️{" "}
        {error?.data?.message ||
          "Something went wrong while fetching appointments."}
      </div>
    );
  }

  const appointments = data?.appointments
    ? [...data.appointments].reverse()
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 relative">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          My Appointments
        </h1>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-inner">
          Total: {appointments.length}
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-6 max-w-4xl mx-auto">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-lg font-bold text-slate-700">
            No appointments booked yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((item) => (
            <AppointmentCard
              key={item._id}
              item={item}
              handleStripePayment={handleStripePayment}
              handleCancel={handleCancel}
              handleIndoorPayment={handleIndoorPayment}
              processingAppointmentId={processingAppointmentId}
              cancellingAppointmentId={cancellingAppointmentId}
              setSelectedAppointmentId={setSelectedAppointmentId}
            />
          ))}
        </div>
      )}

      {selectedAppointmentId && (
        <LiveBillModal
          appointmentId={selectedAppointmentId}
          onClose={() => setSelectedAppointmentId(null)}
          handleIndoorPayment={handleIndoorPayment}
        />
      )}
    </div>
  );
};

// const LiveBillModal = ({ appointmentId, onClose, handleIndoorPayment }) => {
//   const { data, isLoading, error } = useGetUserLiveBillQuery(appointmentId);
//   const [payIndoorBill, { isLoading: isPaying }] = usePayIndoorBillMutation();
//   const bill = data?.data;

//   const handleLocalIndoorPayment = async () => {
//     try {
//       const res = await payIndoorBill({ appointmentId }).unwrap();
//       if (res.success && res.session_url) {
//         window.location.href = res.session_url;
//       } else {
//         toast.error("Stripe session URL not found.");
//       }
//     } catch (error) {
//       toast.error(
//         error?.data?.message || "Indoor bill payment initiation failed.",
//       );
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-9999 p-0 sm:p-4 animate-fade-in">
//       <div className="bg-white w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl border border-slate-100 text-left flex flex-col overflow-hidden relative">
//         <div className="bg-slate-950 text-white px-6 py-5 flex justify-between items-center shrink-0">
//           <div>
//             <h3 className="text-lg font-black tracking-tight">
//               {bill?.dischargeStatus === "Cleared"
//                 ? "Official Invoice"
//                 : "Live Hospital Bill"}
//             </h3>
//             <p className="text-xs text-slate-400 font-mono mt-0.5 tracking-wider">
//               Invoice Ref: #{appointmentId?.slice(-6).toUpperCase()}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-slate-400 hover:text-white text-xl font-medium bg-white/10 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
//           >
//             <FiX className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto scrollbar-thin">
//           {isLoading ? (
//             <div className="p-12 text-center space-y-4">
//               <div className="animate-spin border-4 border-indigo-600 border-t-transparent rounded-full w-10 h-10 mx-auto"></div>
//               <p className="text-sm text-slate-500 font-bold tracking-wide">
//                 Calculating charges...
//               </p>
//             </div>
//           ) : error ? (
//             <div className="p-12 text-center space-y-2 text-rose-500 font-bold flex flex-col items-center justify-center gap-2">
//               <FiAlertCircle className="w-8 h-8 text-rose-500" />
//               <span>Error loading bill details.</span>
//             </div>
//           ) : (
//             <>
//               <div className="p-5 bg-slate-50 border-b border-slate-100 space-y-3 text-sm">
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-500 font-semibold flex items-center gap-1.5">
//                     <FiUser className="w-4 h-4 text-slate-400" /> Patient Name:
//                   </span>
//                   <span className="font-extrabold text-slate-800">
//                     {bill?.patientName || "Admitted Patient"}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-500 font-semibold flex items-center gap-1.5">
//                     <FiLayers className="w-4 h-4 text-slate-400" /> Assigned
//                     Bed:
//                   </span>
//                   <span className="font-bold text-slate-700 bg-slate-200/60 px-2.5 py-0.5 rounded-md text-xs border border-slate-300/30">
//                     {!bill?.bedNumber || bill?.bedNumber === "Not Assigned"
//                       ? "Pending Assignment"
//                       : `Bed ${bill.bedNumber}`}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-500 font-semibold flex items-center gap-1.5">
//                     <FiCalendar className="w-4 h-4 text-slate-400" /> Total Stay
//                     duration:
//                   </span>
//                   <span className="font-black text-indigo-700 bg-indigo-50 border border-indigo-100/70 px-3 py-0.5 rounded-lg text-xs">
//                     {bill?.totalDaysCharged || 0} Days
//                   </span>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4 text-sm bg-white">
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-600 font-semibold flex items-center gap-2">
//                     <span className="w-2 h-2 rounded-full bg-blue-500" />
//                     Room & Bed Charges
//                   </span>
//                   <span className="font-black text-slate-900 text-base">
//                     PKR {bill?.breakdown?.totalBedFee?.toLocaleString() || 0}
//                   </span>
//                 </div>

//                 {bill?.breakdown?.surgeryFee > 0 && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 font-semibold flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-purple-500" />
//                       Surgery / Operation Theater Fee
//                     </span>
//                     <span className="font-black text-slate-900 text-base">
//                       PKR {bill?.breakdown?.surgeryFee?.toLocaleString()}
//                     </span>
//                   </div>
//                 )}

//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-600 font-semibold flex items-center gap-2">
//                     <span className="w-2 h-2 rounded-full bg-emerald-500" />
//                     Consultant Round Visits ({bill?.breakdown?.totalRounds ||
//                       0}{" "}
//                     Rounds)
//                   </span>
//                   <span className="font-black text-slate-900 text-base">
//                     PKR{" "}
//                     {bill?.breakdown?.totalDoctorRoundFee?.toLocaleString() ||
//                       0}
//                   </span>
//                 </div>

//                 <hr className="border-dashed border-slate-200 my-4" />

//                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-inner">
//                   <span className="text-sm font-black text-slate-700 uppercase tracking-wide">
//                     Grand Total:
//                   </span>
//                   <span className="text-2xl font-black text-indigo-600 tracking-tight">
//                     PKR {bill?.grandTotal?.toLocaleString() || 0}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center pt-2">
//                   <span className="text-slate-500 font-semibold">
//                     Payment Status:
//                   </span>
//                   <span
//                     className={`text-[10px] font-black tracking-widest uppercase px-3.5 py-1 rounded-full border ${
//                       bill?.isPaid || bill?.dischargeStatus === "Cleared"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                         : "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
//                     }`}
//                   >
//                     {bill?.isPaid || bill?.dischargeStatus === "Cleared"
//                       ? "● PAID"
//                       : "● UNPAID / DUE"}
//                   </span>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {!isLoading && !error && (
//           <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-2.5 shrink-0">
//             {!(bill?.isPaid || bill?.dischargeStatus === "Cleared") &&
//               (bill?.status === "Discharged" ? (
//                 <button
//                   onClick={handleLocalIndoorPayment}
//                   disabled={isPaying}
//                   className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:opacity-95 disabled:from-indigo-400 disabled:to-indigo-400 text-white font-black py-3.5 rounded-xl shadow-md active:scale-[0.99] transition-all text-sm text-center flex items-center justify-center gap-2"
//                 >
//                   {isPaying ? (
//                     <span>Securing Checkout URL...</span>
//                   ) : (
//                     <>
//                       <FiDollarSign className="w-4 h-4" />
//                       <span>
//                         Pay PKR {bill?.grandTotal?.toLocaleString()} via Stripe
//                       </span>
//                     </>
//                   )}
//                 </button>
//               ) : (
//                 <div className="w-full text-center py-3 px-4 bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs font-bold rounded-xl shadow-inner flex items-center justify-center gap-2">
//                   <FiClock className="w-4 h-4 text-amber-600 shrink-0" />
//                   <span>
//                     Final bill payment will open after Doctor's discharge.
//                   </span>
//                 </div>
//               ))}

//             <button
//               onClick={onClose}
//               className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-all active:scale-[0.99] text-center text-sm border border-slate-200/80 shadow-sm"
//             >
//               Close View
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const LiveBillModal = ({ appointmentId, onClose, handleIndoorPayment }) => {
  const { data, isLoading, error } = useGetUserLiveBillQuery(appointmentId);
  const [payIndoorBill, { isLoading: isPaying }] = usePayIndoorBillMutation();
  const bill = data?.data;

  // ماڈل کے اندر موجود لوکل کلک ہینڈلر
  const handleLocalIndoorPayment = async () => {
    try {
      const res = await payIndoorBill({ appointmentId }).unwrap();
      if (res.success && res.session_url) {
        window.location.href = res.session_url;
      } else {
        toast.error("Stripe session URL not found.");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Indoor bill payment initiation failed."
      );
    }
  };

  return (
    // یہاں p-0 کو p-4 کر دیا ہے تاکہ موبائل پر بھی سائیڈز سے تھوڑا گیپ رہے
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-9999 p-4 animate-fade-in">
      {/* 
        یہاں اہم تبدیلیاں کی گئی ہیں:
        1. h-full کو ہٹا کر h-auto (کنٹینٹ کے مطابق اونچائی) کر دیا گیا ہے۔
        2. sm:rounded-3xl کی جگہ ہر اسکرین کے لیے rounded-3xl کر دیا گیا ہے۔
        3. زیادہ لمبا ہونے کی صورت میں کنٹرول کرنے کے لیے max-h-[90vh] لگا دیا گیا ہے۔
      */}
      <div className="bg-white w-full max-w-md h-auto max-h-[90vh] rounded-3xl shadow-2xl border border-slate-100 text-left flex flex-col overflow-hidden relative">
        <div className="bg-slate-950 text-white px-6 py-5 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-black tracking-tight">
              {bill?.dischargeStatus === "Cleared"
                ? "Official Invoice"
                : "Live Hospital Bill"}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5 tracking-wider">
              Invoice Ref: #{appointmentId?.slice(-6).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-medium bg-white/10 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <div className="p-12 text-center space-y-4">
              <div className="animate-spin border-4 border-indigo-600 border-t-transparent rounded-full w-10 h-10 mx-auto"></div>
              <p className="text-sm text-slate-500 font-bold tracking-wide">
                Calculating charges...
              </p>
            </div>
          ) : error ? (
            <div className="p-12 text-center space-y-2 text-rose-500 font-bold flex flex-col items-center justify-center gap-2">
              <FiAlertCircle className="w-8 h-8 text-rose-500" />
              <span>Error loading bill details.</span>
            </div>
          ) : (
            <>
              <div className="p-5 bg-slate-50 border-b border-slate-100 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <FiUser className="w-4 h-4 text-slate-400" /> Patient Name:
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {bill?.patientName || "Admitted Patient"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <FiLayers className="w-4 h-4 text-slate-400" /> Assigned Bed:
                  </span>
                  <span className="font-bold text-slate-700 bg-slate-200/60 px-2.5 py-0.5 rounded-md text-xs border border-slate-300/30">
                    {!bill?.bedNumber || bill?.bedNumber === "Not Assigned"
                      ? "Pending Assignment"
                      : `Bed ${bill.bedNumber}`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <FiCalendar className="w-4 h-4 text-slate-400" /> Total Stay duration:
                  </span>
                  <span className="font-black text-indigo-700 bg-indigo-50 border border-indigo-100/70 px-3 py-0.5 rounded-lg text-xs">
                    {bill?.totalDaysCharged || 0} Days
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4 text-sm bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Room & Bed Charges
                  </span>
                  <span className="font-black text-slate-900 text-base">
                    PKR {bill?.breakdown?.totalBedFee?.toLocaleString() || 0}
                  </span>
                </div>

                {bill?.breakdown?.surgeryFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Surgery / Operation Theater Fee
                    </span>
                    <span className="font-black text-slate-900 text-base">
                      PKR {bill?.breakdown?.surgeryFee?.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Consultant Round Visits ({bill?.breakdown?.totalRounds || 0} Rounds)
                  </span>
                  <span className="font-black text-slate-900 text-base">
                    PKR {bill?.breakdown?.totalDoctorRoundFee?.toLocaleString() || 0}
                  </span>
                </div>

                <hr className="border-dashed border-slate-200 my-4" />

                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-inner">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wide">
                    Grand Total:
                  </span>
                  <span className="text-2xl font-black text-indigo-600 tracking-tight">
                    PKR {bill?.grandTotal?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-500 font-semibold">
                    Payment Status:
                  </span>
                  <span
                    className={`text-[10px] font-black tracking-widest uppercase px-3.5 py-1 rounded-full border ${
                      bill?.isPaid || bill?.dischargeStatus === "Cleared"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {bill?.isPaid || bill?.dischargeStatus === "Cleared"
                      ? "● PAID"
                      : "● UNPAID / DUE"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {!isLoading && !error && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-2.5 shrink-0">
            {!(bill?.isPaid || bill?.dischargeStatus === "Cleared") &&
              (bill?.status === "Discharged" ? (
                <button
                  onClick={handleLocalIndoorPayment}
                  disabled={isPaying}
                  className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:opacity-95 disabled:from-indigo-400 disabled:to-indigo-400 text-white font-black py-3.5 rounded-xl shadow-md active:scale-[0.99] transition-all text-sm text-center flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <span>Securing Checkout URL...</span>
                  ) : (
                    <>
                      <FiDollarSign className="w-4 h-4" />
                      <span>
                        Pay PKR {bill?.grandTotal?.toLocaleString()} via Stripe
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full text-center py-3 px-4 bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs font-bold rounded-xl shadow-inner flex items-center justify-center gap-2">
                  <FiClock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Final bill payment will open after Doctor's discharge.
                  </span>
                </div>
              ))}

            <button
              onClick={onClose}
              className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-all active:scale-[0.99] text-center text-sm border border-slate-200/80 shadow-sm"
            >
              Close View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyAppointments;
