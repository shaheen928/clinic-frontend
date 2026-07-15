import { useParams, useNavigate, Link } from "react-router-dom";
import { useFetchAllDoctorsQuery } from "../../store/services/userApi";
import { useSelector } from "react-redux";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useFetchAllDoctorsQuery();
  const doctor = data?.doctors?.find((doc) => doc._id === id);
  const { isUserAuthenticated } = useSelector((state) => state.auth);

  const handleProceedToBook = () => {
    if (isUserAuthenticated) {
      navigate(`/book-appointment/${id}`);
    } else {
      navigate("/user-login", { state: { from: `/book-appointment/${id}` } });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></div>
          <div className="relative inline-flex rounded-full h-10 w-10 bg-teal-600 border-4 border-teal-200 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-4">
        <div className="text-5xl">🔍</div>
        <p className="font-extrabold text-lg text-slate-700">
          Doctor Profile Not Found!
        </p>
        <Link
          to="/"
          className="bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs hover:bg-teal-700 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  const activeAvailableDays = doctor.weeklySchedule
    ? Object.entries(doctor.weeklySchedule)
        .filter(([_, value]) => value?.isAvailable === true)
        .map(([dayName]) => dayName)
    : [];

  return (
    <div
      className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between relative overflow-hidden"
      dir="ltr"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl -z-10 -translate-x-1/4" />

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0  transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <Link
            to="/"
            className="group font-black text-slate-700 text-sm sm:text-base flex items-center gap-2 hover:text-teal-600 transition-all active:scale-98 cursor-pointer"
          >
            <svg
              className="h-5 w-5 text-slate-500 group-hover:text-teal-600 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back To Home</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            Verified Specialist
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-md">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="h-28 w-28 bg-slate-50 rounded-2xl border border-slate-100 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs group relative">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-5xl">🩺</span>
                  )}
                </div>

                <div className="space-y-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                    {doctor.name}
                  </h1>

                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
                    <span className="text-teal-600 font-extrabold text-[11px] sm:text-xs uppercase tracking-wide bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100/50">
                      {doctor.speciality || "General Specialist"}
                    </span>
                    {doctor.degree && (
                      <span className="text-slate-500 font-bold text-[11px] sm:text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        🎓 {doctor.degree}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1.5 justify-center sm:justify-start text-xs font-bold">
                    <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200/50 shadow-3xs">
                      💼 Experience: {doctor.experience || "N/A"}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100/60 shadow-3xs">
                      💰 Fee: Rs. {doctor.fees}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="font-black text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  About This Specialist
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium bg-slate-50/40 p-5 rounded-2xl border border-slate-100/60 whitespace-pre-line">
                  {doctor.about ||
                    "This specialist is officially certified and registered with ShifaClick. Highly skilled in clinical patient management, providing tailored scheduling options, and delivering top-tier healthcare consultation services."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-md">
            <div className="space-y-5">
              <h3 className="font-black text-lg text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span>📅</span> Clinic Availability
              </h3>

              <div className="space-y-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-100/80 text-sm">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">
                    Daily Timings:
                  </span>
                  <span className="text-slate-800 font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-3xs text-xs">
                    {doctor.slots_start || "09:00 AM"} -{" "}
                    {doctor.slots_end || "05:00 PM"}
                  </span>
                </div>

                <div className="flex justify-between items-center font-medium">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                    Current Status:
                  </span>
                  <span
                    className={`font-black text-[11px] px-2.5 py-1 rounded-lg border uppercase tracking-wide flex items-center gap-1.5 ${
                      doctor.available !== false
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${doctor.available !== false ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    {doctor.available !== false ? "Active" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Available Consultation Days
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeAvailableDays.length > 0 ? (
                    activeAvailableDays.map((day, idx) => (
                      <span
                        key={idx}
                        className="bg-teal-50 border border-teal-100/50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-3xs capitalize"
                      >
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-rose-500 font-bold bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl block w-full text-center">
                      😞 No days selected for consultation.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedToBook}
              className="w-full bg-slate-900 hover:bg-teal-600 text-white font-black py-4 rounded-xl transition-all duration-300 text-sm shadow-xs hover:shadow-lg hover:shadow-teal-600/20 cursor-pointer active:scale-98 border border-slate-900 hover:border-teal-600 block text-center"
            >
              Select Slot & Book Now ⚡
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDetail;
