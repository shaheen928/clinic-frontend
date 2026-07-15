import { useState, useEffect } from "react";
import { useLazyGetDoctorTemplateBookedSlotsQuery } from "../../store/services/doctorApi";
import { useDoctorCreateAdmissionMutation } from "../../store/services/doctorApi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdmissionModal = ({
  isOpen,
  onClose,
  appointmentId,
  isSurgeon = false,
}) => {
  const [createAdmission, { isLoading }] = useDoctorCreateAdmissionMutation();

  const [triggerFetchSlots, { data: slotsData, isLoading: slotsLoading }] =
    useLazyGetDoctorTemplateBookedSlotsQuery();

  const [admissionType, setAdmissionType] = useState("General");
  const [notes, setNotes] = useState("");
  const [surgeryName, setSurgeryName] = useState("");

  const [surgeryDateTime, setSurgeryDateTime] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setHours(9, 0, 0, 0);

    const offset = defaultDate.getTimezoneOffset();
    const adjustedDate = new Date(defaultDate.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().slice(0, 16);
  });

  const surgeryDateOnly = surgeryDateTime ? surgeryDateTime.split("T")[0] : "";

  const [durationHours, setDurationHours] = useState(1);
  const [theaterNo, setTheaterNo] = useState("OT-1");
  const [surgeryFee, setSurgeryFee] = useState("");

  const [isOpenAdmissionSelect, setIsOpenAdmissionSelect] = useState(false);
  const [isOpenTheaterSelect, setIsOpenTheaterSelect] = useState(false);
  const [isOpenDurationSelect, setIsOpenDurationSelect] = useState(false);

  useEffect(() => {
    if (!isSurgeon && admissionType === "Surgery") {
      setAdmissionType("General");
    }
  }, [isSurgeon, admissionType]);

  useEffect(() => {
    if (admissionType === "Surgery" && surgeryDateOnly && theaterNo) {
      triggerFetchSlots({ date: surgeryDateOnly, theaterNo });
    }
  }, [surgeryDateOnly, theaterNo, admissionType, triggerFetchSlots]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      appointmentId,
      admissionType,
      notes,
      ...(admissionType === "Surgery" && {
        surgeryDetails: {
          surgeryName,
          surgeryDate: surgeryDateTime,
          durationHours: Number(durationHours),
          theaterNo,
          surgeryFee: Number(surgeryFee) || 0,
        },
      }),
    };

    try {
      const res = await createAdmission(payload).unwrap();
      toast.success(res.message);
      onClose();
    } catch (err) {
      toast.error(
        err?.data?.message || "Time slot conflict! Try another time.",
      );
    }
  };

  const bookedSlots = slotsData?.slots || [];

  const closeAllDropdowns = () => {
    setIsOpenAdmissionSelect(false);
    setIsOpenTheaterSelect(false);
    setIsOpenDurationSelect(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white p-5 sm:p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto relative border border-slate-100">
        <h3 className="text-lg sm:text-xl font-black text-slate-800 text-center">
          🏥 Patient Admission & Surgery
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Admission Type
            </label>

            {isSurgeon ? (
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !isOpenAdmissionSelect;
                    closeAllDropdowns();
                    setIsOpenAdmissionSelect(nextState);
                  }}
                  className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100/40 transition-colors focus:border-teal-500"
                >
                  <span className="truncate pr-2">
                    {admissionType === "General"
                      ? "Recommend Admission (Awaiting Bed) ⏳"
                      : "Surgery / Operation 📆"}
                  </span>
                  <span
                    className={`text-[10px] text-slate-400 transition-transform duration-200 shrink-0 ${isOpenAdmissionSelect ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {isOpenAdmissionSelect && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={closeAllDropdowns}
                    />
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-50 max-w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setAdmissionType("General");
                          closeAllDropdowns();
                        }}
                        className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-semibold block transition-colors ${
                          admissionType === "General"
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="block whitespace-normal wrap-break-word">
                          Recommend Admission (Awaiting Bed) ⏳
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAdmissionType("Surgery");
                          closeAllDropdowns();
                        }}
                        className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-semibold block transition-colors ${
                          admissionType === "Surgery"
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="block whitespace-normal wrap-break-word">
                          Surgery / Operation 📆
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-600 flex items-center gap-2 select-none">
                ⏳ Awaiting Bed (Admission Recommended)
                <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ml-auto shrink-0">
                  Fixed
                </span>
              </div>
            )}
          </div>

          {admissionType === "Surgery" && isSurgeon && (
            <div className="space-y-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="Surgery Name"
                required
                value={surgeryName}
                onChange={(e) => setSurgeryName(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-teal-500 outline-none transition-colors"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                    Theater No
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !isOpenTheaterSelect;
                      closeAllDropdowns();
                      setIsOpenTheaterSelect(nextState);
                    }}
                    className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100/30 transition-colors focus:border-teal-500"
                  >
                    <span className="truncate">{theaterNo}</span>
                    <span
                      className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ${isOpenTheaterSelect ? "rotate-180" : ""}`}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpenTheaterSelect && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={closeAllDropdowns}
                      />
                      <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-50">
                        {["OT-1", "OT-2"].map((ot) => (
                          <button
                            key={ot}
                            type="button"
                            onClick={() => {
                              setTheaterNo(ot);
                              closeAllDropdowns();
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold block transition-colors ${
                              theaterNo === ot
                                ? "bg-teal-50 text-teal-700"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {ot}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                    Duration
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !isOpenDurationSelect;
                      closeAllDropdowns();
                      setIsOpenDurationSelect(nextState);
                    }}
                    className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100/30 transition-colors focus:border-teal-500"
                  >
                    <span className="truncate">
                      {durationHours} {durationHours === 1 ? "Hour" : "Hours"}
                    </span>
                    <span
                      className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ${isOpenDurationSelect ? "rotate-180" : ""}`}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpenDurationSelect && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={closeAllDropdowns}
                      />
                      <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-50">
                        {[1, 2, 3].map((hours) => (
                          <button
                            key={hours}
                            type="button"
                            onClick={() => {
                              setDurationHours(hours);
                              closeAllDropdowns();
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold block transition-colors ${
                              Number(durationHours) === hours
                                ? "bg-teal-50 text-teal-700"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {hours} {hours === 1 ? "Hour" : "Hours"}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Surgery Date & Time
                </label>
                <div className="w-full relative react-datepicker-custom-wrapper">
                  <DatePicker
                    selected={
                      surgeryDateTime ? new Date(surgeryDateTime) : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const offset = date.getTimezoneOffset();
                        const adjustedDate = new Date(
                          date.getTime() - offset * 60 * 1000,
                        );
                        const formattedDateTime = adjustedDate
                          .toISOString()
                          .slice(0, 16);
                        setSurgeryDateTime(formattedDateTime);
                      } else {
                        setSurgeryDateTime("");
                      }
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="dd/MM/yyyy h:mm aa"
                    minDate={new Date()}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer shadow-3xs"
                    popperPlacement="bottom-start"
                    popperModifiers={[
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "viewport",
                        },
                      },
                    ]}
                    placeholderText="Select Surgery Date & Time"
                  />
                </div>
              </div>

              {surgeryDateOnly && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-500 block mb-1.5">
                    打 Booked Timings for {theaterNo}:
                  </span>
                  {slotsLoading && (
                    <p className="text-slate-400 animate-pulse">
                      Checking OT availability...
                    </p>
                  )}
                  {!slotsLoading && bookedSlots.length === 0 && (
                    <p className="text-emerald-600 font-medium">
                      ✨ All slots are free! You can book any time.
                    </p>
                  )}
                  {!slotsLoading &&
                    bookedSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="bg-rose-50 border border-rose-100 text-rose-700 px-2.5 py-1.5 rounded-lg mt-1 font-semibold flex justify-between gap-2"
                      >
                        <span className="truncate">⌛ {slot.displayTime}</span>
                        <span className="text-[10px] opacity-70 truncate shrink-0">
                          ({slot.surgeryName})
                        </span>
                      </div>
                    ))}
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Surgery Fee (PKR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  required={admissionType === "Surgery"}
                  value={surgeryFee}
                  onChange={(e) => setSurgeryFee(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-emerald-600 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          <textarea
            placeholder="Instructions / Clinical Notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm resize-none focus:border-teal-500 outline-none transition-colors"
            rows="2"
          />

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-teal-600/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? "Processing..." : "Confirm 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionModal;
