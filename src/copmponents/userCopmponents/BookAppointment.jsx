import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetDoctorDetailsQuery,
  useCreateAppointmentMutation,
} from "../../store/services/userApi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userToken = useSelector((state) => state.auth.userToken);

  useEffect(() => {
    if (!userToken) {
      navigate("/user-login", { state: { from: `/book-appointment/${id}` } });
    }
  }, [userToken, id, navigate]);

  const { data: doctorData, isLoading, error } = useGetDoctorDetailsQuery(id);
  const [createAppointment, { isLoading: isBooking }] =
    useCreateAppointmentMutation();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [patientDob, setPatientDob] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const doctor = doctorData?.doctor || {};

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

    const slotsList = [];
    const startMinutes = convertToMinutes(startTimeStr);
    const endMinutes = convertToMinutes(endTimeStr);
    let currentMinutes = startMinutes;
    while (currentMinutes < endMinutes) {
      slotsList.push(formatMinutesToTimeString(currentMinutes));
      currentMinutes += interVelMinutes;
    }
    return slotsList;
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
    return doctor?.slotDuration || 20;
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

  const doctorSpecificSlots = generateDynamicSlots(
    currentDayConfig?.startTime || doctor.slots_start || "09:00 AM",
    currentDayConfig?.endTime || doctor.slots_end || "05:00 PM",
    currentInterval,
  );

  const futureSlotsOnly = doctorSpecificSlots.filter((timeStr) => {
    if (!selectedDate) return false;

    const todayStr = new Date().toISOString().split("T")[0];
    if (selectedDate < todayStr) return false;

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

  const alreadyBookedOrBlocked = doctor?.slots_booked?.[selectedDate] || [];

  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      fullDate: d.toISOString().split("T")[0],
    };
  });

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error("Please select both Date and Time Slot!");
      return;
    }
    if (!patientName || !patientDob || !patientGender || !paymentMethod) {
      toast.error("Please fill all patient details and select payment method!");
      return;
    }
    try {
      const response = await createAppointment({
        docId: id,
        slotDate: selectedDate,
        slotTime: selectedSlot,
        patientName,
        patientDob,
        patientGender,
        paymentMethod,
      }).unwrap();

      setShowModal(false);

      if (
        response.success &&
        response.paymentRequired &&
        response.session_url
      ) {
        toast.info("Redirecting to secure Stripe payment page... 💳");
        window.location.href = response.session_url;
      } else {
        toast.success("🎉 Appointment Booked Successfully (Cash at Clinic)!");
        navigate("/my-appointments");
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to book appointment. Try again.",
      );
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col gap-3 items-center justify-center font-black text-sm uppercase tracking-widest text-teal-600 bg-slate-50/50">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading Dynamic Panel...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-500 font-extrabold text-sm uppercase tracking-wider bg-slate-50/50">
        ⚠️ Error loading doctor details. Please refresh.
      </div>
    );

  return (
    <div
      className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-8 font-sans relative overflow-hidden"
      dir="ltr"
    >
      <div className="absolute top-0 left-0 w-125 h-125 bg-teal-100/20 rounded-full blur-3xl -z-10 -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-emerald-100/15 rounded-full blur-3xl -z-10 translate-x-1/4 translate-y-1/4" />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-100/40 flex flex-col items-center text-center group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/30">
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-50 mb-4 border border-slate-100 shadow-xs relative">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
            ) : (
              <span className="text-5xl h-full w-full flex items-center justify-center bg-teal-50/40">
                🩺
              </span>
            )}
          </div>

          <h3 className="font-black text-xl text-slate-800 tracking-tight">
            {doctor.name}
          </h3>
          <p className="text-teal-600 font-extrabold text-[10px] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-lg mt-2 border border-teal-100/40">
            {doctor.speciality || doctor.specialty || "Specialist"}
          </p>

          <div className="w-full bg-slate-50/70 rounded-2xl p-4 mt-6 space-y-3 text-xs font-bold text-slate-500 border border-slate-100/80">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                Consultation Fee
              </span>
              <span className="font-black text-sm text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                Rs. {doctor.fees}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200/40 pt-2.5">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                Experience
              </span>
              <span className="font-extrabold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                {doctor.experience || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/40 space-y-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/30">
          <div className="space-y-4">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              📅 <span>Select Appointment Date</span>
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {availableDates.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDate(d.fullDate);
                    setSelectedSlot("");
                  }}
                  className={`flex flex-col items-center p-3 px-4 rounded-xl border min-w-16 transition-all cursor-pointer ${
                    selectedDate === d.fullDate
                      ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/10 font-bold scale-102"
                      : "bg-slate-50/50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-semibold"
                  }`}
                >
                  <span
                    className={`text-[9px] uppercase tracking-wider font-extrabold ${selectedDate === d.fullDate ? "text-teal-100" : "text-slate-400"}`}
                  >
                    {d.day}
                  </span>
                  <span className="text-base font-black mt-0.5">{d.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              ⏰ <span>Available Time Slots</span>
            </h2>

            {selectedDate ? (
              isOffDay ? (
                <div className="text-xs font-semibold text-amber-700 bg-amber-50/60 p-4 rounded-2xl border border-dashed border-amber-200/70 flex items-center gap-2">
                  <span>🏖️</span> This day is configured as an 'Off Day' in the
                  doctor's weekly schedule.
                </div>
              ) : futureSlotsOnly.length === 0 ? (
                <div className="text-xs font-semibold text-rose-500 bg-rose-50/50 p-4 rounded-2xl border border-dashed border-rose-100 flex items-center gap-2">
                  <span>🚫</span> No active slots available or all slots for
                  today have elapsed.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {futureSlotsOnly.map((slot) => {
                    const serverSlot = alreadyBookedOrBlocked.find(
                      (s) => s.time === slot,
                    );
                    const isBooked = serverSlot?.status === "booked";
                    const isBlocked =
                      serverSlot?.status === "blocked_by_doctor";
                    const isDisable = isBooked || isBlocked;

                    return (
                      <button
                        key={slot}
                        disabled={isDisable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isBooked
                            ? "bg-rose-50 border-rose-100 text-rose-400 cursor-not-allowed opacity-60"
                            : isBlocked
                              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                              : selectedSlot === slot
                                ? "bg-slate-900 border-slate-900 text-white shadow-md font-black scale-[1.01]"
                                : "bg-slate-50 border-slate-200/60 text-slate-700 hover:bg-slate-100/80"
                        }`}
                      >
                        <span className="font-extrabold">{slot}</span>
                        {isBooked && (
                          <span className="text-[9px] text-rose-500 font-medium mt-0.5">
                            Booked
                          </span>
                        )}
                        {isBlocked && (
                          <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                            Unavailable
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="text-xs font-semibold text-slate-400 bg-slate-50/60 p-4 rounded-2xl border border-dashed border-slate-200/80 flex items-center gap-2">
                <span>💡</span> Please select a preferred date first to unlock
                available timings.
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 -mx-6 -mb-6 p-6 md:-mx-8 md:-mb-8 md:p-8 rounded-b-3xl mt-4">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Payable Amount
              </p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                Rs. {doctor.fees}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              disabled={isBooking || !selectedDate || !selectedSlot}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-xl font-black text-white shadow-xs transition-all active:scale-98 text-center cursor-pointer text-xs uppercase tracking-wider ${
                selectedDate && selectedSlot && !isBooking
                  ? "bg-teal-600 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/20"
                  : "bg-slate-300 border-slate-300 cursor-not-allowed shadow-none"
              }`}
            >
              Proceed to Book 📑
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-5 transform transition-all">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-800 tracking-tight">
                Patient & Payment Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer text-lg font-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-600">
              <div className="flex flex-col gap-1.5">
                <label className="uppercase text-[10px] tracking-wider text-slate-400">
                  Patient's Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase text-[10px] tracking-wider text-slate-400">
                  Patient's Date of Birth
                </label>

                <div className="w-full relative react-datepicker-custom-wrapper">
                  <DatePicker
                    selected={patientDob ? new Date(patientDob) : null}
                    onChange={(date) => {
                      if (date) {
                        const offset = date.getTimezoneOffset();
                        const adjustedDate = new Date(
                          date.getTime() - offset * 60 * 1000,
                        );

                        setPatientDob(adjustedDate.toISOString().split("T")[0]);
                      } else {
                        setPatientDob("");
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white text-sm font-semibold transition-all cursor-pointer shadow-3xs"
                    popperPlacement="bottom-start"
                    popperModifiers={[
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "viewport",
                        },
                      },
                    ]}
                    placeholderText="Select Date of Birth"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase text-[10px] tracking-wider text-slate-400">
                  Patient's Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPatientGender(g)}
                      className={`py-2.5 rounded-xl border font-extrabold text-center cursor-pointer transition-all ${
                        patientGender === g
                          ? "bg-teal-600 border-teal-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                <label className="uppercase text-[10px] tracking-wider text-slate-400">
                  Preferred Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === "Cash"
                        ? "bg-slate-900 border-slate-900 text-white shadow-md font-extrabold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                    }`}
                  >
                    <span className="text-base">💵</span>
                    <span>Cash at Clinic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Stripe")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === "Stripe"
                        ? "bg-slate-900 border-slate-900 text-white shadow-md font-extrabold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                    }`}
                  >
                    <span className="text-base">💳</span>
                    <span>Pay Online (Stripe)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking || !patientDob || !patientName}
                className={`w-1/2 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-center text-white shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  patientName && patientDob && !isBooking
                    ? "bg-teal-600 hover:bg-teal-700 hover:shadow-md hover:shadow-teal-600/10"
                    : "bg-slate-300 cursor-not-allowed shadow-none"
                }`}
              >
                {isBooking ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Booking...</span>
                  </>
                ) : (
                  "Confirm & Book"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
