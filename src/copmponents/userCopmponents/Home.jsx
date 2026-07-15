import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllDoctorsQuery } from "../../store/services/userApi";

const Home = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetchAllDoctorsQuery();

  const bannerImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=60&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1635151925170-de5e89c3f03f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZyZWUlMjBpbWFnZXMlMjBob3NwaXRhbHxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1764687724929-9acf158beb94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGZyZWUlMjBpbWFnZXMlMjBob3NwaXRhbHxlbnwwfHwwfHx8MA%3D%3D",
      " https://plus.unsplash.com/premium_photo-1764687892536-2239d267cc7f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGZyZWUlMjBpbWFnZXMlMjBob3NwaXRhbHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    [],
  );

  const doctorsList = useMemo(() => {
    return (
      data?.doctors?.map((doc, idx) => ({
        ...doc,
        avatar: doc.image || "🩺",
        bgImage: bannerImages[idx % bannerImages.length],
      })) || []
    );
  }, [data, bannerImages]);

  const [currentDoctorIdx, setCurrentDoctorIdx] = useState(0);
  const [isImagesPreloaded, setIsImagesPreloaded] = useState(false);

  useEffect(() => {
    if (doctorsList.length === 0) return;

    const imageUrls = doctorsList.map((doc) => doc.image).filter(Boolean);

    if (imageUrls.length === 0) {
      setIsImagesPreloaded(true);
      return;
    }

    let loadedCount = 0;
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          setIsImagesPreloaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          setIsImagesPreloaded(true);
        }
      };
    });
  }, [doctorsList]);

  useEffect(() => {
    if (doctorsList.length === 0 || !isImagesPreloaded) return;

    if (currentDoctorIdx >= doctorsList.length) {
      setCurrentDoctorIdx(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentDoctorIdx((prevIdx) => (prevIdx + 1) % doctorsList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [doctorsList, currentDoctorIdx, isImagesPreloaded]);

  const handleViewDetail = (docId) => {
    navigate(`/doctor-detail/${docId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-bold text-sm">
            Loading Certified Doctors...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500 font-bold">
          Error loading doctors. Please check backend.
        </p>
      </div>
    );
  }

  const currentDoctor = doctorsList[currentDoctorIdx];

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between"
      dir="ltr"
    >
      <section className="bg-slate-50/50 relative overflow-hidden py-16 pt-4">
        <div className="absolute top-0 right-0 w-125 h-125 bg-teal-100/30 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-75 h-75 bg-emerald-100/20 rounded-full blur-2xl -z-10 -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-teal-100">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
              Digital Healthcare Solution
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.15] tracking-tight">
              Find Certified Doctors & <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 via-teal-500 to-emerald-600">
                Book Slots Instantly
              </span>
            </h1>

            <p className="text-slate-500 font-medium max-w-xl text-base md:text-lg md:leading-relaxed mx-auto lg:mx-0">
              Skip the long queues. Browse through our verified specialists,
              check their available schedules, and secure your appointment in
              just a click.
            </p>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-end shrink-0 relative pt-6">
            <div className="absolute inset-0 bg-linear-to-tr from-teal-500/10 to-emerald-500/5 rounded-3xl -rotate-2 scale-105 -z-10" />

            <div className="w-full max-w-md aspect-4/3 sm:aspect-square bg-white rounded-3xl border border-slate-100 shadow-xl p-3 relative group overflow-visible">
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-50 border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200"
                  alt="ShifaClick Hospital Interior"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent" />
              </div>

              <div className="absolute -top-4 -left-4 bg-white border border-slate-100/80 shadow-xl p-3.5 rounded-2xl items-center gap-3 hover:scale-105 hidden sm:inline-flex">
                <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                  👨‍⚕️
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-slate-800 font-extrabold text-sm whitespace-nowrap">
                    500+ Verified
                  </span>
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">
                    Top Specialists
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-4 right-4 bg-slate-900 border border-slate-800 shadow-xl p-3.5 rounded-2xl items-center gap-3 hover:scale-105 text-white hidden sm:inline-flex">
                <div className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <div className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center text-lg shrink-0">
                  ⚡
                </div>
                <div className="flex flex-col text-left pr-2">
                  <span className="font-bold text-xs whitespace-nowrap">
                    Instant Booking
                  </span>
                  <span className="text-emerald-400 font-medium text-[10px] whitespace-nowrap">
                    100% Secured Slots
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {doctorsList.length > 0 && currentDoctor && (
        <section className="max-w-7xl md:max-w-[90%] lg:max-w-[94%] w-full mx-auto px-6 mb-10 transition-all duration-300">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
            Featured Specialists This Week
          </div>

          <div
            className="relative p-8 md:p-16 py-14 md:py-20 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 ease-in-out overflow-hidden bg-cover bg-center text-white min-h-88"
            style={{
              backgroundImage: `url(${currentDoctor.bgImage})`,
              transition: "background-image 0.3s ease-in-out",
            }}
          >
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/70 via-slate-900/60 to-slate-950/40 z-0"></div>

            <div className="relative z-10 flex items-center gap-5 text-center md:text-left flex-col md:flex-row w-full">
              <div className="h-28 w-28 md:h-32 md:w-32 bg-white/10 rounded-2xl backdrop-blur-md shadow-inner shrink-0 flex items-center justify-center overflow-hidden border border-white/20 relative">
                {doctorsList.some((d) => d.image) ? (
                  doctorsList.map((doc, idx) => {
                    if (!doc.image) return null;
                    return (
                      <img
                        key={doc._id}
                        src={doc.image}
                        alt={doc.name}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out ${
                          currentDoctorIdx === idx
                            ? "opacity-100 z-10"
                            : "opacity-0 z-0 pointer-events-none"
                        }`}
                        fetchPriority={
                          currentDoctorIdx === idx ? "high" : "low"
                        }
                      />
                    );
                  })
                ) : (
                  <span className="text-6xl">🩺</span>
                )}
              </div>

              <div className="space-y-2 w-full">
                <span className="text-xs font-bold bg-teal-600/80 px-2.5 py-1 rounded-md tracking-wide uppercase">
                  Top Rated Doctor
                </span>
                <h3 className="font-black text-3xl md:text-5xl tracking-tight mt-1">
                  {currentDoctor.name}
                </h3>
                <p className="text-teal-300 font-extrabold text-lg md:text-xl">
                  {currentDoctor.specialty ||
                    currentDoctor.speciality ||
                    "General Specialist"}
                </p>

                <div className="flex flex-wrap gap-x-8 gap-y-2 pt-3 text-sm md:text-base text-white/90 font-medium justify-center md:justify-start border-t border-white/10">
                  <div>
                    💼 Experience:{" "}
                    <span className="font-bold text-white">
                      {currentDoctor.experience || "N/A"}
                    </span>
                  </div>
                  <div>
                    💰 Consultation Fee:{" "}
                    <span className="font-bold text-white">
                      Rs. {currentDoctor.fees}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-auto shrink-0">
              <button
                onClick={() => handleViewDetail(currentDoctor._id)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-black px-8 py-4.5 rounded-xl shadow-lg transition-all active:scale-95 text-sm md:text-base cursor-pointer w-full text-center border border-teal-500"
              >
                View Profile & Slots 📅
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-3">
            {doctorsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDoctorIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentDoctorIdx === idx
                    ? "w-6 bg-teal-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      <main className="flex-1 max-w-7xl md:max-w-[90%] lg:max-w-[94%] w-full mx-auto px-6 py-6">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            All Available Doctors
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-0.5">
            Select a specialist to book your custom slot
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {doctorsList.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] hover:shadow-[0_10px_30px_-5px_rgba(13,148,136,0.15)] hover:border-teal-500/20 transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div>
                <div className="w-full aspect-4/3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden mb-5 group-hover:border-teal-500/20 transition-colors relative">
                  {doc.image ? (
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-5xl bg-teal-50/50 h-full w-full flex items-center justify-center text-teal-600/70">
                      🩺
                    </div>
                  )}

                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/20 shadow-xs flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Available
                  </span>
                </div>

                <div className="space-y-2 px-1">
                  <h3 className="font-extrabold text-slate-800 text-xl group-hover:text-teal-600 transition-colors tracking-tight">
                    {doc.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-teal-700 text-xs font-bold uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-500/10">
                      {doc.speciality || doc.specialty || "General Specialist"}
                    </span>
                    {doc.degree && (
                      <span className="text-slate-400 text-xs font-medium">
                        • {doc.degree}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 bg-slate-50/50 rounded-2xl p-3.5 border border-slate-100 text-xs">
                  <div className="flex flex-col gap-1 border-r border-slate-200/60 pr-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Experience
                    </span>
                    <span className="text-slate-700 font-extrabold text-sm">
                      {doc.experience || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 pl-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Consultation
                    </span>
                    <span className="text-teal-600 font-black text-sm">
                      Rs. {doc.fees}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleViewDetail(doc._id)}
                className="w-full mt-5 text-center bg-slate-900 text-white hover:bg-teal-600 font-bold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.99] text-sm cursor-pointer shadow-sm hover:shadow-md"
              >
                View Full Profile
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
