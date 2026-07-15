import React, { useState } from "react";
import {
  useAdminGetAwaitingAdmissionsQuery,
  useAdminGetAllBedsQuery,
  useAdminAllocateBedMutation,
  useAdminUpdatePatientLocationMutation,
} from "../../store/services/adminApi";
import { toast } from "react-toastify";
import {
  FaSlidersH,
  FaCalendarAlt,
  FaHourglassHalf,
  FaClinicMedical,
  FaCut,
  FaPills,
  FaBed,
  FaArrowAltCircleRight,
  FaProcedures,
  FaHeartbeat,
} from "react-icons/fa";

const AdminAdmissionsManager = () => {
  const {
    data: admissionsData,
    isLoading: isAdmissionsLoading,
    error: admissionsError,
  } = useAdminGetAwaitingAdmissionsQuery();
  const [updateLocation, { isLoading: isUpdatingLocation }] =
    useAdminUpdatePatientLocationMutation();
  const { data: bedsData, isLoading: isBedsLoading } =
    useAdminGetAllBedsQuery();
  const [allocateBed, { isLoading: isAllocating }] =
    useAdminAllocateBedMutation();

  const [activeTab, setActiveTab] = useState("scheduled");

  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedBeds, setSelectedBeds] = useState({});

  const [openCategoryDropdownId, setOpenCategoryDropdownId] = useState(null);
  const [openBedDropdownId, setOpenBedDropdownId] = useState(null);
  const [openLocationDropdownId, setOpenLocationDropdownId] = useState(null);

  const admissionsList = admissionsData?.data || [];
  const bedsList = bedsData?.beds || [];

  const availableBeds = bedsList.filter((bed) => bed.status === "Available");
  const uniqueCategories = [
    ...new Set(availableBeds.map((bed) => bed.category)),
  ];

  const scheduledPatients = admissionsList.filter(
    (item) => item.status === "Scheduled",
  );
  const awaitingPatients = admissionsList.filter(
    (item) => item.status === "Awaiting Bed",
  );
  const admittedPatients = admissionsList.filter(
    (item) => item.status === "Admitted",
  );

  const closeAllDropdowns = () => {
    setOpenCategoryDropdownId(null);
    setOpenBedDropdownId(null);
    setOpenLocationDropdownId(null);
  };

  const handleCategoryChange = (admissionId, category) => {
    setSelectedCategories((prev) => ({ ...prev, [admissionId]: category }));
    setSelectedBeds((prev) => ({ ...prev, [admissionId]: "" }));
    closeAllDropdowns();
  };

  const handleBedChange = (admissionId, bedId) => {
    setSelectedBeds((prev) => ({ ...prev, [admissionId]: bedId }));
    closeAllDropdowns();
  };

  const handleAllocationSubmit = async (admissionId) => {
    const bedId = selectedBeds[admissionId];
    if (!bedId) {
      toast.error("Please select a bed first! 🛏️");
      return;
    }

    try {
      await allocateBed({ admissionId, bedId }).unwrap();
      toast.success("Patient admitted successfully! 🎉");

      setSelectedCategories((prev) => {
        const u = { ...prev };
        delete u[admissionId];
        return u;
      });
      setSelectedBeds((prev) => {
        const u = { ...prev };
        delete u[admissionId];
        return u;
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to admit patient");
    }
  };

  const handleLocationChange = async (admissionId, newLocation) => {
    try {
      await updateLocation({
        admissionId,
        locationStatus: newLocation,
      }).unwrap();

      toast.success(`Patient moved to ${newLocation} 🏥`);
      closeAllDropdowns();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update location");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getLocationIcon = (status) => {
    switch (status) {
      case "In OT":
        return <FaCut className="text-amber-600 text-xs" />;
      case "Recovery":
        return <FaHeartbeat className="text-purple-600 text-xs" />;
      case "In Ward":
      default:
        return <FaProcedures className="text-slate-600 text-xs" />;
    }
  };

  if (isAdmissionsLoading || isBedsLoading) {
    return (
      <div className="text-center py-12 text-slate-500 font-medium">
        Loading Admissions Data...
      </div>
    );
  }

  if (admissionsError) {
    return (
      <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-center border border-rose-100">
        Error loading data.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-full overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
          <FaSlidersH className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Hospital Admissions Control
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage physical bed allocations for scheduled and waiting patients.
          </p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => {
            setActiveTab("scheduled");
            closeAllDropdowns();
          }}
          className={`flex items-center gap-2 py-2.5 px-5 font-bold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "scheduled"
              ? "border-blue-600 text-blue-600 bg-blue-50/40"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <FaCalendarAlt className="text-xs" /> Scheduled (
          {scheduledPatients.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("waiting");
            closeAllDropdowns();
          }}
          className={`flex items-center gap-2 py-2.5 px-5 font-bold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "waiting"
              ? "border-amber-600 text-amber-600 bg-amber-50/40"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <FaHourglassHalf className="text-xs" /> Waiting List (
          {awaitingPatients.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("admitted");
            closeAllDropdowns();
          }}
          className={`flex items-center gap-2 py-2.5 px-5 font-bold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "admitted"
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/40"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <FaClinicMedical className="text-xs" /> Currently Admitted (
          {admittedPatients.length})
        </button>
      </div>

      {activeTab === "scheduled" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto pb-28 transition-colors duration-150 scrollbar-thin">
            <table className="w-full text-sm text-left border-collapse min-w-225">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6">Patient Details</th>
                  <th className="py-4 px-6">Admission Type</th>
                  <th className="py-4 px-6">Scheduled Date</th>
                  <th className="py-4 px-6 w-52">Ward Category</th>
                  <th className="py-4 px-6 w-52">Available Bed</th>
                  <th className="py-4 px-6 text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduledPatients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      No scheduled admissions for today.
                    </td>
                  </tr>
                ) : (
                  scheduledPatients.map((item) => {
                    const patientName =
                      item.appointmentId?.patientName || "Patient Record";
                    const currentCat = selectedCategories[item._id] || "";
                    const filteredBeds = availableBeds.filter(
                      (bed) => bed.category === currentCat,
                    );

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/50 transition-colors align-middle"
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          <h4 className="font-bold text-slate-700">
                            {patientName}
                          </h4>
                          <span className="text-xs text-slate-400">
                            Doctor: {item.doctorId?.name || "Assigned Doctor"}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                            {item.admissionType}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600 whitespace-nowrap">
                          {formatDate(item.admissionDate || item.createdAt)}
                        </td>

                        <td className="py-4 px-6">
                          <div className="relative w-full z-30">
                            <button
                              type="button"
                              onClick={() => {
                                const isOpened =
                                  openCategoryDropdownId === item._id;
                                closeAllDropdowns();
                                if (!isOpened)
                                  setOpenCategoryDropdownId(item._id);
                              }}
                              className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-blue-500 shadow-3xs cursor-pointer"
                            >
                              <span className="truncate">
                                {currentCat || "Select Category"}
                              </span>
                              <span className="text-[8px] text-slate-400 shrink-0 ml-1">
                                {openCategoryDropdownId === item._id
                                  ? "▲"
                                  : "▼"}
                              </span>
                            </button>

                            {openCategoryDropdownId === item._id && (
                              <>
                                <div
                                  className="fixed inset-0 z-20"
                                  onClick={closeAllDropdowns}
                                />
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-50">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCategoryChange(item._id, "")
                                    }
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-50 whitespace-nowrap"
                                  >
                                    -- Select Category --
                                  </button>
                                  {uniqueCategories.map((cat) => (
                                    <button
                                      key={cat}
                                      type="button"
                                      onClick={() =>
                                        handleCategoryChange(item._id, cat)
                                      }
                                      className={`w-full text-left px-3 py-2 text-xs font-semibold block transition-colors ${
                                        currentCat === cat
                                          ? "bg-blue-50 text-blue-700"
                                          : "text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      {cat}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="relative w-full z-30">
                            <button
                              type="button"
                              disabled={!currentCat}
                              onClick={() => {
                                const isOpened = openBedDropdownId === item._id;
                                closeAllDropdowns();
                                if (!isOpened) setOpenBedDropdownId(item._id);
                              }}
                              className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:border-blue-500 shadow-3xs cursor-pointer"
                            >
                              <span className="truncate">
                                {selectedBeds[item._id]
                                  ? filteredBeds.find(
                                      (b) => b._id === selectedBeds[item._id],
                                    )?.bedNumber || "Selected Bed"
                                  : "Select Bed"}
                              </span>
                              <span className="text-[8px] text-slate-400 shrink-0 ml-1">
                                {openBedDropdownId === item._id ? "▲" : "▼"}
                              </span>
                            </button>

                            {openBedDropdownId === item._id && (
                              <>
                                <div
                                  className="fixed inset-0 z-20"
                                  onClick={closeAllDropdowns}
                                />
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-50">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleBedChange(item._id, "")
                                    }
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-50"
                                  >
                                    -- Select Bed --
                                  </button>
                                  {filteredBeds.map((bed) => (
                                    <button
                                      key={bed._id}
                                      type="button"
                                      onClick={() =>
                                        handleBedChange(item._id, bed._id)
                                      }
                                      className={`w-full text-left px-3 py-2 text-xs font-semibold block transition-colors ${
                                        selectedBeds[item._id] === bed._id
                                          ? "bg-blue-50 text-blue-700"
                                          : "text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      {bed.bedNumber} (Rs.{bed.pricePerDay})
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleAllocationSubmit(item._id)}
                            disabled={isAllocating || !selectedBeds[item._id]}
                            className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-xl transition-all disabled:opacity-40 whitespace-nowrap cursor-pointer active:scale-[0.98]"
                          >
                            <FaArrowAltCircleRight className="text-[11px]" />
                            {isAllocating ? "Admitting..." : "Admit Directly"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "waiting" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto pb-28 transition-colors duration-150 scrollbar-thin">
            <table className="w-full text-sm text-left border-collapse min-w-225">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6">Patient Details</th>
                  <th className="py-4 px-6">Requested Type</th>
                  <th className="py-4 px-6">Request Date</th>
                  <th className="py-4 px-6 w-52">Ward Category</th>
                  <th className="py-4 px-6 w-52">Available Bed</th>
                  <th className="py-4 px-6 text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {awaitingPatients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      No patients in waiting list.
                    </td>
                  </tr>
                ) : (
                  awaitingPatients.map((item) => {
                    const patientName =
                      item.appointmentId?.patientName || "Patient Record";
                    const currentCat = selectedCategories[item._id] || "";
                    const filteredBeds = availableBeds.filter(
                      (bed) => bed.category === currentCat,
                    );

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/50 transition-colors align-middle"
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          <h4 className="font-bold text-slate-700">
                            {patientName}
                          </h4>
                          <span className="text-xs text-slate-400">
                            Doctor: {item.doctorId?.name || "Assigned Doctor"}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600">
                            {item.admissionType}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="py-4 px-6">
                          <div className="relative w-full z-30">
                            <button
                              type="button"
                              onClick={() => {
                                const isOpened =
                                  openCategoryDropdownId === item._id;
                                closeAllDropdowns();
                                if (!isOpened)
                                  setOpenCategoryDropdownId(item._id);
                              }}
                              className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:border-amber-500 shadow-3xs cursor-pointer"
                            >
                              <span className="truncate">
                                {currentCat || "Select Category"}
                              </span>
                              <span className="text-[8px] text-slate-400 shrink-0 ml-1">
                                {openCategoryDropdownId === item._id
                                  ? "▲"
                                  : "▼"}
                              </span>
                            </button>

                            {openCategoryDropdownId === item._id && (
                              <>
                                <div
                                  className="fixed inset-0 z-20"
                                  onClick={closeAllDropdowns}
                                />
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-50">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCategoryChange(item._id, "")
                                    }
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-50 whitespace-nowrap"
                                  >
                                    -- Select Category --
                                  </button>
                                  {uniqueCategories.map((cat) => (
                                    <button
                                      key={cat}
                                      type="button"
                                      onClick={() =>
                                        handleCategoryChange(item._id, cat)
                                      }
                                      className={`w-full text-left px-3 py-2 text-xs font-semibold block transition-colors ${
                                        currentCat === cat
                                          ? "bg-amber-50 text-amber-700"
                                          : "text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      {cat}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="relative w-full z-30">
                            <button
                              type="button"
                              disabled={!currentCat}
                              onClick={() => {
                                const isOpened = openBedDropdownId === item._id;
                                closeAllDropdowns();
                                if (!isOpened) setOpenBedDropdownId(item._id);
                              }}
                              className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:border-amber-500 shadow-3xs cursor-pointer"
                            >
                              <span className="truncate">
                                {selectedBeds[item._id]
                                  ? filteredBeds.find(
                                      (b) => b._id === selectedBeds[item._id],
                                    )?.bedNumber || "Selected Bed"
                                  : "Select Bed"}
                              </span>
                              <span className="text-[8px] text-slate-400 shrink-0 ml-1">
                                {openBedDropdownId === item._id ? "▲" : "▼"}
                              </span>
                            </button>

                            {openBedDropdownId === item._id && (
                              <>
                                <div
                                  className="fixed inset-0 z-20"
                                  onClick={closeAllDropdowns}
                                />
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-50">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleBedChange(item._id, "")
                                    }
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-50"
                                  >
                                    -- Select Bed --
                                  </button>
                                  {filteredBeds.map((bed) => (
                                    <button
                                      key={bed._id}
                                      type="button"
                                      onClick={() =>
                                        handleBedChange(item._id, bed._id)
                                      }
                                      className={`w-full text-left px-3 py-2 text-xs font-semibold block transition-colors ${
                                        selectedBeds[item._id] === bed._id
                                          ? "bg-amber-50 text-amber-700"
                                          : "text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      {bed.bedNumber} (Rs.{bed.pricePerDay})
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleAllocationSubmit(item._id)}
                            disabled={isAllocating || !selectedBeds[item._id]}
                            className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 px-3 py-2 rounded-xl transition-all disabled:opacity-40 whitespace-nowrap cursor-pointer active:scale-[0.98]"
                          >
                            <FaBed className="text-xs" />
                            {isAllocating ? "Assigning..." : "Allocate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "admitted" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto pb-28 transition-colors duration-150 scrollbar-thin">
            <table className="w-full text-sm text-left border-collapse min-w-225">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6">Patient Details</th>
                  <th className="py-4 px-6">Case Type</th>
                  <th className="py-4 px-6 text-center">Ward & Bed</th>
                  <th className="py-4 px-6 text-center w-52">
                    Current Location
                  </th>
                  <th className="py-4 px-6 text-center">Admission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admittedPatients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-slate-400 font-medium"
                    >
                      No patients are physically in the ward right now.
                    </td>
                  </tr>
                ) : (
                  admittedPatients.map((item) => {
                    const patientName =
                      item.appointmentId?.patientName || "Patient Record";
                    const currentStatus = item.locationStatus || "In Ward";

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/50 transition-colors align-middle"
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          <h4 className="font-bold text-slate-700">
                            {patientName}
                          </h4>
                          <span className="text-xs text-slate-400">
                            Doctor: {item.doctorId?.name || "Assigned Doctor"}
                          </span>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap">
                          {item.admissionType === "Surgery" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 animate-pulse w-fit">
                              <FaCut className="text-[10px]" /> Surgery Case
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-600 border border-teal-100 w-fit">
                              <FaPills className="text-[10px]" /> Medical Care
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <div className="font-bold text-slate-700">
                            {item.bedId?.category || "General Ward"}
                          </div>
                          <span className="inline-flex bg-teal-50 text-teal-700 font-extrabold text-xs px-2 py-0.5 rounded-md border border-teal-100 mt-0.5">
                            Bed #{item.bedId?.bedNumber || "N/A"}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <div className="relative flex items-center justify-center max-w-44 mx-auto z-30">
                            <button
                              type="button"
                              onClick={() => {
                                const isOpened =
                                  openLocationDropdownId === item._id;
                                closeAllDropdowns();
                                if (!isOpened)
                                  setOpenLocationDropdownId(item._id);
                              }}
                              className={`w-full flex items-center justify-between text-xs font-bold pl-8 pr-3 py-2 rounded-xl border focus:outline-none transition-colors cursor-pointer ${
                                currentStatus === "In OT"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 focus:border-amber-400"
                                  : currentStatus === "Recovery"
                                    ? "bg-purple-50 text-purple-700 border-purple-200 focus:border-purple-400"
                                    : "bg-slate-50 text-slate-700 border-slate-200 focus:border-slate-400"
                              }`}
                            >
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                {getLocationIcon(currentStatus)}
                              </div>
                              <span className="truncate">{currentStatus}</span>
                              <span className="text-[8px] text-slate-400 shrink-0 ml-1">
                                {openLocationDropdownId === item._id
                                  ? "▲"
                                  : "▼"}
                              </span>
                            </button>

                            {openLocationDropdownId === item._id && (
                              <>
                                <div
                                  className="fixed inset-0 z-20"
                                  onClick={closeAllDropdowns}
                                />
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50 text-left">
                                  {[
                                    { value: "In Ward", label: "In Ward" },
                                    {
                                      value: "In OT",
                                      label: "In OT (Operation)",
                                    },
                                    { value: "Recovery", label: "In Recovery" },
                                  ].map((loc) => (
                                    <button
                                      key={loc.value}
                                      type="button"
                                      onClick={() =>
                                        handleLocationChange(
                                          item._id,
                                          loc.value,
                                        )
                                      }
                                      className={`w-full text-left px-4 py-2.5 text-xs font-bold block transition-colors ${
                                        currentStatus === loc.value
                                          ? "bg-slate-100 text-slate-900"
                                          : "text-slate-600 hover:bg-slate-50"
                                      }`}
                                    >
                                      {loc.label}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center font-medium text-slate-500 whitespace-nowrap">
                          {formatDate(item.updatedAt || item.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmissionsManager;
