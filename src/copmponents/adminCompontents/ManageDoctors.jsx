import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useChangeAvailabilityByAdminMutation,
  useGetAllDoctorsForAdminQuery,
  useUpdateDoctorByAdminMutation,
} from "../../store/services/adminApi";
import { toast } from "react-toastify";

import {
  FaUserMd,
  FaPlus,
  FaExclamationTriangle,
  FaTimes,
  FaRegEdit,
  FaRegClock,
  FaCircle,
  FaCheckCircle,
} from "react-icons/fa";

const ManageDoctors = () => {
  const { data, isLoading, error, refetch } = useGetAllDoctorsForAdminQuery();
  const [changeAvailability] = useChangeAvailabilityByAdminMutation();
  const [updateDoctorByAdmin, { isLoading: isUpdating }] =
    useUpdateDoctorByAdminMutation();

  const doctorList = data?.doctors || data;
  const navigate = useNavigate();
  const [actionError, setActionError] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    speciality: "",
    fees: "",
    commission: "",
    experience: "",
    roundFee: "",
    about: "",
  });

  const handleEditClick = (doc) => {
    setEditingDoc(doc._id);
    setEditForm({
      name: doc.name,
      speciality: doc.speciality,
      fees: doc.fees,
      commission: doc.commission || 20,
      experience: doc.experience,
      roundFee: doc.roundFee || 0,
      about: doc.about || "",
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanPayload = {
        name: editForm.name,
        speciality: editForm.speciality,
        fees: Number(editForm.fees),
        commission: Number(editForm.commission),
        experience: editForm.experience,
        roundFee: Number(editForm.roundFee),
        about: editForm.about,
      };

      await updateDoctorByAdmin({
        docId: editingDoc,
        updatedData: cleanPayload,
      }).unwrap();

      toast.success("Doctor's profile and fees updated successfully! 🩺");
      setEditingDoc(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update doctor details");
    }
  };

  const handleToggleChangeAvailability = async (
    docId,
    isCurrentlyAvailable,
  ) => {
    setActionError(null);
    try {
      await changeAvailability({ docId }).unwrap();
      refetch();
    } catch (err) {
      if (err?.data?.errorType === "ACTIVE_APPOINTMENTS_EXIST") {
        const backendMessage =
          err?.data?.message || "Active appointments exist.";
        const confirmSchedule = window.confirm(
          `${backendMessage}\n\nWould you like to schedule this doctor to be inactivated from a future date?`,
        );
        if (confirmSchedule) {
          const deactivationDate = window.prompt(
            "Enter the deactivation date (Format: YYYY-MM-DD):",
          );
          if (deactivationDate) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(deactivationDate)) {
              alert("Invalid deactivation date format! Please use YYYY-MM-DD.");
              return;
            }
            const reactivationDate = window.prompt(
              "When will the doctor return? (Enter reactivation date, or leave blank/cancel for permanent inactivation):",
            );
            if (reactivationDate && !dateRegex.test(reactivationDate)) {
              alert("Invalid reactivation date format! Please use YYYY-MM-DD.");
              return;
            }

            try {
              await changeAvailability({
                docId,
                deactivationDate,
                reactivationDate: reactivationDate || null,
              }).unwrap();
              alert(
                "Doctor's availability policy has been scheduled successfully.",
              );
              refetch();
            } catch (scheduleErr) {
              setActionError(
                scheduleErr?.data?.message || "Scheduling failed.",
              );
            }
          }
        }
      } else {
        setActionError(err?.data?.message || "Failed to change availability");
      }
    }
  };

  return (
    <div className="space-y-6 p-4 text-left" dir="ltr">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FaUserMd className="text-2xl text-teal-600" />
            <h1 className="text-2xl font-extrabold text-slate-800">
              Manage Doctors
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            View, edit fees, commissions, or manage availability policies on
            ShifaClick.
          </p>
        </div>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-teal-100 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
          onClick={() => navigate("/admin/add-doctor")}
        >
          <FaPlus className="text-xs" /> Add New Doctor
        </button>
      </div>

      {actionError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl font-medium flex justify-between items-center">
          <span className="flex items-center gap-2">
            <FaExclamationTriangle className="text-amber-500 shrink-0" />{" "}
            {actionError}
          </span>
          <button
            onClick={() => setActionError(null)}
            className="text-xs bg-amber-200/50 p-1.5 rounded-md hover:bg-amber-200 text-amber-900 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12 text-slate-500 font-medium flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          Loading doctors directory...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2">
          <FaExclamationTriangle /> Failed to load doctors list. Please check
          your backend connection.
        </div>
      )}

      {!isLoading && !error && doctorList && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
            className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
          >
            <table className="w-full text-left border-collapse min-w-225">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  <th className="p-4 px-6">Doctor Info</th>
                  <th className="p-4 px-8 lg:px-6">Speciality</th>
                  <th className="p-4 px-6">Degree & Exp</th>
                  <th className="p-4">Fees & Com %</th>
                  <th className="p-4 text-right px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                {doctorList.map((doc) => (
                  <tr
                    key={doc._id}
                    className="hover:bg-slate-50/50 transition-colors align-top"
                  >
                    <td className="py-4 px-6 flex items-center gap-3 whitespace-nowrap">
                      <img
                        src={doc.image || "https://via.placeholder.com/150"}
                        alt={doc.name}
                        className="h-10 w-10 rounded-full shrink-0 object-cover border border-slate-100 bg-slate-50"
                      />
                      <div>
                        <span className="font-semibold text-slate-800 block">
                          {doc.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {doc.email}
                        </span>

                        {doc.scheduledActivationDate &&
                          new Date(doc.scheduledActivationDate) >
                            new Date() && (
                            <span className="inline-block mt-0.5 text-[11px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium ml-2">
                              Starts:{" "}
                              {new Date(
                                doc.scheduledActivationDate,
                              ).toLocaleDateString()}
                            </span>
                          )}

                        {doc.deactivationDate && (
                          <span className="block mt-0.5 text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium  w-max">
                            Ends on:{" "}
                            {new Date(
                              doc.deactivationDate,
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-8 lg:px-6 font-medium text-slate-600 whitespace-nowrap">
                      {doc.speciality}
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      <span className="block font-medium text-slate-700">
                        {doc.degree}
                      </span>
                      <span className="text-xs text-slate-400">
                        {doc.experience} Experience
                      </span>
                    </td>
                    <td className="py-4 p-4 text-slate-800 whitespace-nowrap">
                      <span className="block font-bold">Rs. {doc.fees}</span>
                      <span className="text-xs text-slate-400">
                        Com: {doc.commission || 20}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right flex items-center justify-end gap-2.5 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(doc)}
                        className="inline-flex items-center gap-1 p-1.5 px-2 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                        title="Edit Fees & Profile"
                      >
                        <FaRegEdit className="text-sm" /> Edit
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/admin/edit-doctor-schedule/${doc._id}`)
                        }
                        className="inline-flex items-center gap-1 p-1.5 px-2 bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-600 border border-slate-100 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                        title="Edit Doctor Schedule"
                      >
                        <FaRegClock className="text-sm" /> Timings
                      </button>

                      <button
                        onClick={() =>
                          handleToggleChangeAvailability(doc._id, doc.available)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all active:scale-95 select-none ${
                          doc.available
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : doc.scheduledActivationDate &&
                                new Date(doc.scheduledActivationDate) >
                                  new Date()
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <FaCircle
                          className={`text-[7px] ${
                            doc.available
                              ? "text-emerald-500"
                              : doc.scheduledActivationDate &&
                                  new Date(doc.scheduledActivationDate) >
                                    new Date()
                                ? "text-blue-500"
                                : "text-slate-400"
                          }`}
                        />
                        {doc.available
                          ? "Active"
                          : doc.scheduledActivationDate &&
                              new Date(doc.scheduledActivationDate) > new Date()
                            ? "Pending"
                            : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-800">
                Update Doctor Info
              </h3>
              <button
                onClick={() => setEditingDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Modify consultation fees, commissions, and medical profile
              details.
            </p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Speciality
                </label>
                <select
                  value={editForm.speciality}
                  onChange={(e) =>
                    setEditForm({ ...editForm, speciality: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 cursor-pointer"
                >
                  <option value="General Physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">
                    Consultation Fees (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editForm.fees}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fees: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">
                    Daily Round Fee (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editForm.roundFee}
                    onChange={(e) =>
                      setEditForm({ ...editForm, roundFee: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">
                    Admin Commission (%)
                  </label>
                  <input
                    type="number"
                    value={editForm.commission}
                    onChange={(e) =>
                      setEditForm({ ...editForm, commission: e.target.value })
                    }
                    required
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">
                    Experience
                  </label>
                  <select
                    value={editForm.experience}
                    onChange={(e) =>
                      setEditForm({ ...editForm, experience: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 cursor-pointer"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="10 Years">10 Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  About / Bio
                </label>
                <textarea
                  value={editForm.about}
                  onChange={(e) =>
                    setEditForm({ ...editForm, about: e.target.value })
                  }
                  placeholder="Write a brief description about the doctor's background..."
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 resize-none transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-teal-600 text-white font-bold rounded-lg text-xs hover:bg-teal-700 disabled:bg-teal-400 cursor-pointer transition-all active:scale-[0.98]"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
