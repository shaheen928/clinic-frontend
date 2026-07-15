import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminAddDoctorMutation } from "../../store/services/adminApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  LuCamera,
  LuUser,
  LuMail,
  LuLock,
  LuGraduationCap,
  LuCalendar,
  LuDollarSign,
  LuPercent,
  LuStethoscope,
  LuActivity,
  LuClock,
  LuBan,
  LuFileText,
  LuArrowLeft,
} from "react-icons/lu";

const AddDoctor = () => {
  const [addDoctor, { isLoading }] = useAdminAddDoctorMutation();
  const navigate = useNavigate();

  const [isOpenSurgeonSelect, setIsOpenSurgeonSelect] = useState(false);
  const [isOpenSpecialitySelect, setIsOpenSpecialitySelect] = useState(false);
  const [isOpenExperienceSelect, setIsOpenExperienceSelect] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "General Physician",
    degree: "",
    experience: "1 Year",
    fees: "",
    roundFee: "",
    isSurgeon: false,
    about: "",
    joiningDate: "",
    commission: "20",
  });

  const [image, setImage] = useState(null);

  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
    tuesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
    wednesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
    thursday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
    friday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
    saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
    sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  });

  const closeAllDropdowns = () => {
    setIsOpenSurgeonSelect(false);
    setIsOpenSpecialitySelect(false);
    setIsOpenExperienceSelect(false);
  };

  const convertTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    let [hours, minutes] = timeStr.split(":");
    hours = parseInt(hours);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = hours < 10 ? "0" + hours : hours;
    return `${strHours}:${minutes} ${ampm}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleScheduleChange = (day, field, value) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("email", formData.email);
    dataToSend.append("password", formData.password);
    dataToSend.append("speciality", formData.speciality);
    dataToSend.append("degree", formData.degree);
    dataToSend.append("experience", formData.experience);
    dataToSend.append("fees", Number(formData.fees));
    dataToSend.append(
      "roundFee",
      formData.roundFee ? Number(formData.roundFee) : 0,
    );
    dataToSend.append("isSurgeon", formData.isSurgeon);
    dataToSend.append("about", formData.about);
    dataToSend.append("commission", Number(formData.commission));

    if (formData.joiningDate)
      dataToSend.append("joiningDate", formData.joiningDate);

    const processedSchedule = {};
    Object.keys(weeklySchedule).forEach((day) => {
      processedSchedule[day] = {
        isAvailable: weeklySchedule[day].isAvailable,
        startTime: convertTo12Hour(weeklySchedule[day].startTime),
        endTime: convertTo12Hour(weeklySchedule[day].endTime),
      };
    });
    dataToSend.append("weeklySchedule", JSON.stringify(processedSchedule));

    if (image) dataToSend.append("image", image);

    try {
      const response = await addDoctor(dataToSend).unwrap();
      if (response.success) {
        toast.success("Doctor added successfully 🩺");
        navigate("/admin/doctors");
      }
    } catch (error) {
      console.error("Failed to add doctor:", error);
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center p-4 sm:p-6"
      dir="ltr"
    >
      <div className="w-full max-w-4xl bg-white p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-sm text-left mx-auto">
        <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
          <div className="flex items-center gap-2">
            <LuStethoscope className="text-2xl text-teal-600" />
            <h2 className="text-xl font-bold text-slate-800">Add New Doctor</h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/doctors")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <LuArrowLeft className="text-base" /> Go Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100 w-max">
            <div className="h-16 w-16 bg-white border border-dashed border-slate-200 rounded-full flex items-center justify-center text-xl overflow-hidden shadow-sm text-slate-400">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <LuCamera className="text-teal-600 animate-pulse" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuUser className="text-slate-400 text-base" /> Doctor Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm transition-all"
                placeholder="Dr. John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuActivity className="text-slate-400 text-base" /> Doctor Type
                / Role
              </label>

              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !isOpenSurgeonSelect;
                    closeAllDropdowns();
                    setIsOpenSurgeonSelect(nextState);
                  }}
                  className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 text-left text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-teal-500 shadow-3xs cursor-pointer"
                >
                  <span className="truncate">
                    {formData.isSurgeon
                      ? "Surgeon (OPD + Operation Facility) 🩺"
                      : "General Physician (OPD Only) 👨‍⚕️"}
                  </span>
                  <span
                    className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isOpenSurgeonSelect ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpenSurgeonSelect && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsOpenSurgeonSelect(false)}
                    />
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-50">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, isSurgeon: false });
                          setIsOpenSurgeonSelect(false);
                        }}
                        className={`w-full text-left px-3 py-3 text-xs sm:text-sm font-semibold block transition-colors ${
                          formData.isSurgeon === false
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        General Physician (OPD Only) 👨‍⚕️
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, isSurgeon: true });
                          setIsOpenSurgeonSelect(false);
                        }}
                        className={`w-full text-left px-3 py-3 text-xs sm:text-sm font-semibold block transition-colors ${
                          formData.isSurgeon === true
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Surgeon (OPD + Operation Facility) 🩺
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuMail className="text-slate-400 text-base" /> Doctor Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm transition-all"
                placeholder="johndoe@gmail.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuLock className="text-slate-400 text-base" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuStethoscope className="text-slate-400 text-base" />{" "}
                Speciality
              </label>

              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !isOpenSpecialitySelect;
                    closeAllDropdowns();
                    setIsOpenSpecialitySelect(nextState);
                  }}
                  className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 text-left text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-teal-500 shadow-3xs cursor-pointer"
                >
                  <span className="truncate">{formData.speciality}</span>
                  <span
                    className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isOpenSpecialitySelect ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpenSpecialitySelect && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsOpenSpecialitySelect(false)}
                    />
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto divide-y divide-slate-50">
                      {[
                        "General Physician",
                        "Gynecologist",
                        "Dermatologist",
                        "Pediatrician",
                        "Neurologist",
                        "Gastroenterologist",
                      ].map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, speciality: spec });
                            setIsOpenSpecialitySelect(false);
                          }}
                          className={`w-full text-left px-3 py-3 text-xs sm:text-sm font-semibold block transition-colors ${
                            formData.speciality === spec
                              ? "bg-teal-50 text-teal-700"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuActivity className="text-slate-400 text-base" /> Experience
              </label>

              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !isOpenExperienceSelect;
                    closeAllDropdowns();
                    setIsOpenExperienceSelect(nextState);
                  }}
                  className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3 text-left text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-teal-500 shadow-3xs cursor-pointer"
                >
                  <span className="truncate">{formData.experience}</span>
                  <span
                    className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isOpenExperienceSelect ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpenExperienceSelect && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsOpenExperienceSelect(false)}
                    />
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto divide-y divide-slate-50">
                      {[
                        "1 Year",
                        "2 Years",
                        "3 Years",
                        "5 Years",
                        "10 Years",
                      ].map((exp) => (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, experience: exp });
                            setIsOpenExperienceSelect(false);
                          }}
                          className={`w-full text-left px-3 py-3 text-xs sm:text-sm font-semibold block transition-colors ${
                            formData.experience === exp
                              ? "bg-teal-50 text-teal-700"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuGraduationCap className="text-slate-400 text-lg" /> Degree
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm transition-all"
                placeholder="MBBS, MD"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuCalendar className="text-slate-400 text-base" /> Joining Date
                / Booking Open Date
              </label>
              <div className="w-full relative react-datepicker-custom-wrapper">
                <DatePicker
                  selected={
                    formData.joiningDate ? new Date(formData.joiningDate) : null
                  }
                  onChange={(date) => {
                    let formattedDate = "";
                    if (date) {
                      const offset = date.getTimezoneOffset();
                      const adjustedDate = new Date(
                        date.getTime() - offset * 60 * 1000,
                      );

                      formattedDate = adjustedDate.toISOString().split("T")[0];
                    }

                    handleChange({
                      target: {
                        name: "joiningDate",
                        value: formattedDate,
                      },
                    });
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm bg-white cursor-pointer shadow-3xs"
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    {
                      name: "preventOverflow",
                      options: {
                        boundary: "viewport",
                      },
                    },
                  ]}
                  placeholderText="Select Joining Date"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuDollarSign className="text-slate-400 text-base" /> OPD Fees
                (Rs.)
              </label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm transition-all"
                placeholder="1500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuDollarSign className="text-slate-400 text-base" /> Daily
                Round Fees (Rs.)
              </label>
              <input
                type="number"
                name="roundFee"
                value={formData.roundFee}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm transition-all"
                placeholder="2000"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LuPercent className="text-slate-400 text-base" /> Admin
                Commission (%)
              </label>
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm transition-all"
                placeholder="20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <LuFileText className="text-slate-400 text-base" /> About Doctor
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-teal-500 text-sm resize-none transition-all"
              placeholder="Write a brief description about the doctor's background..."
            ></textarea>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <LuClock className="text-teal-600 text-lg" />
              <h3 className="text-md font-bold text-slate-700">
                Doctor Shift Schedule (Weekly)
              </h3>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {Object.keys(weeklySchedule).map((day) => (
                <div
                  key={day}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2 w-32 select-none">
                    <input
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer accent-teal-600"
                      type="checkbox"
                      id={`check-${day}`}
                      checked={weeklySchedule[day].isAvailable}
                      onChange={(e) =>
                        handleScheduleChange(
                          day,
                          "isAvailable",
                          e.target.checked,
                        )
                      }
                    />
                    <label
                      htmlFor={`check-${day}`}
                      className="text-sm font-semibold text-slate-700 capitalize cursor-pointer"
                    >
                      {day}
                    </label>
                  </div>

                  {weeklySchedule[day].isAvailable ? (
                    <div className="flex justify-between items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <input
                        type="time"
                        value={weeklySchedule[day].startTime}
                        onChange={(e) =>
                          handleScheduleChange(day, "startTime", e.target.value)
                        }
                        className="p-1 px-2 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-teal-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 font-medium">
                        to
                      </span>
                      <input
                        type="time"
                        value={weeklySchedule[day].endTime}
                        onChange={(e) =>
                          handleScheduleChange(day, "endTime", e.target.value)
                        }
                        className="p-1 px-2 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-teal-500 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-semibold bg-rose-50/60 px-2.5 py-1 rounded-lg border border-rose-100">
                      <LuBan className="text-[11px]" /> Off Day
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold p-3.5 rounded-xl transition-all shadow-md shadow-teal-50 active:scale-[0.99] disabled:bg-teal-400 cursor-pointer text-center"
          >
            {isLoading
              ? "Adding Doctor to Directory..."
              : "Save Doctor Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
