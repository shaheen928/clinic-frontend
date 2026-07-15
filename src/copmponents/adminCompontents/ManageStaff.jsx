import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetAllStaffQuery,
  useChangeStaffStatusMutation,
  useAdminUpdateStaffMutation,
} from "../../store/services/adminApi";
import { toast } from "react-toastify";
import {
  FaUserPlus,
  FaUsers,
  FaUserMd,
  FaUserCog,
  FaWallet,
  FaCalendarTimes,
  FaPhoneAlt,
  FaEnvelope,
  FaUserCheck,
  FaUserSlash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

const ManageStaff = () => {
  const { data, isLoading, error, refetch } = useGetAllStaffQuery();
  const [changeStatus, { isLoading: isUpdatingStatus }] =
    useChangeStaffStatusMutation();
  const [updateStaff, { isLoading: isUpdatingStaff }] =
    useAdminUpdateStaffMutation();

  const [activeFilter, setActiveFilter] = useState("All");

  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    salary: "",
    phone: "",
    email: "",
    absentDates: [],
  });

  const [selectedDate, setSelectedDate] = useState("");

  const handleStatusToggle = async (staffId) => {
    try {
      await changeStatus({ staffId }).unwrap();
      toast.success("Staff status updated successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleEditClick = (member) => {
    setEditingStaffId(member._id);
    setEditForm({
      name: member.name,
      role: member.role,
      salary: member.salary || "",
      phone: member.phone || "",
      email: member.email || "",
      absentDates: member.absentDates || [],
    });
    setSelectedDate("");
  };

  const handleAddAbsentDate = () => {
    if (!selectedDate) return;

    if (editForm.absentDates.includes(selectedDate)) {
      toast.warning("This date is already added!");
      return;
    }

    setEditForm({
      ...editForm,
      absentDates: [...editForm.absentDates, selectedDate],
    });
    setSelectedDate("");
  };

  const handleRemoveAbsentDate = (dateToRemove) => {
    setEditForm({
      ...editForm,
      absentDates: editForm.absentDates.filter((date) => date !== dateToRemove),
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStaff({
        staffId: editingStaffId,
        updatedData: editForm,
      }).unwrap();
      toast.success(`${editForm.name}'s record updated successfully! 🎉`);
      setEditingStaffId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update staff details");
    }
  };

  const filteredStaff = data?.staff?.filter((member) => {
    if (activeFilter === "All") return true;
    return member.staffType === activeFilter;
  });

  return (
    <div className="p-4 md:p-6 mx-auto text-left" dir="ltr">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Staff Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            View, filter, edit details, and manage active/inactive status of
            hospital staff.
          </p>
        </div>
        <Link
          to="/admin/add-staff"
          className="inline-flex px-5 py-2.5 max-w-44 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-teal-600/10 transition-all items-center gap-2 whitespace-nowrap active:scale-[0.98]"
        >
          <FaUserPlus className="text-base" />
          Add New Staff
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveFilter("All")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeFilter === "All"
              ? "bg-white text-teal-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FaUsers className="text-sm" />
          All Staff ({data?.staff?.length || 0})
        </button>
        <button
          onClick={() => setActiveFilter("Clinical")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeFilter === "Clinical"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FaUserMd className="text-sm" />
          Clinical (
          {data?.staff?.filter((s) => s.staffType === "Clinical").length || 0})
        </button>
        <button
          onClick={() => setActiveFilter("Support")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeFilter === "Support"
              ? "bg-white text-purple-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FaUserCog className="text-sm" />
          Support (
          {data?.staff?.filter((s) => s.staffType === "Support").length || 0})
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 font-medium space-y-3">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading Staff Records...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-rose-500 font-medium bg-rose-50 border border-rose-100 rounded-2xl shadow-sm">
          Error loading staff data. Please ensure backend server is running.
        </div>
      ) : filteredStaff?.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-medium border border-slate-100 rounded-2xl bg-white shadow-sm">
          No staff found for the selected category.
        </div>
      ) : (
        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 transition-colors duration-150">
            <table className="w-full text-sm text-left text-slate-500 min-w-250 table-fixed">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50/70 border-b border-slate-100 whitespace-nowrap">
                <tr>
                  <th className="w-[20%] px-4 py-4 font-bold">Staff Member</th>
                  <th className="w-[10%] px-4 py-4 font-bold">Type</th>
                  <th className="w-[14%] px-4 py-4 font-bold">Designation</th>
                  <th className="w-[13%] px-4 py-4 font-bold">Salary</th>
                  <th className="w-[13%] px-4 py-4 font-bold">
                    Off-Days (Month)
                  </th>
                  <th className="w-[18%] px-4 py-4 font-bold">Contact</th>
                  <th className="w-[12%] px-4 py-4 font-bold">Status</th>
                  <th className="w-[25%] px-4 py-4 font-bold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-slate-50/40 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                          {member.staffType === "Clinical" ? (
                            <FaUserMd className="text-sm text-blue-600" />
                          ) : (
                            <FaUserCog className="text-sm text-purple-600" />
                          )}
                        </div>
                        <span
                          className="font-semibold text-slate-800 text-sm truncate"
                          title={member.name}
                        >
                          {member.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase ${
                          member.staffType === "Clinical"
                            ? "bg-blue-50 text-blue-600 border border-blue-100/50"
                            : "bg-purple-50 text-purple-600 border border-purple-100/50"
                        }`}
                      >
                        {member.staffType}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden">
                      <div
                        className="text-slate-700 font-medium text-sm truncate"
                        title={member.role}
                      >
                        {member.role}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-bold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FaWallet className="text-slate-400 text-xs" />
                        <span>PKR {member.salary?.toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-700 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border ${
                          member.absentDates?.length > 0
                            ? "bg-amber-50 border-amber-100 text-amber-700"
                            : "bg-slate-50 border-slate-100 text-slate-400 font-normal"
                        }`}
                      >
                        <FaCalendarAlt className="text-[10px]" />
                        {member.absentDates
                          ? member.absentDates.length
                          : 0}{" "}
                        Days
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden">
                      <div className="flex flex-col min-w-0 space-y-0.5">
                        <div className="text-slate-700 font-semibold text-xs truncate flex items-center gap-1">
                          <FaPhoneAlt className="text-slate-400 text-[10px]" />
                          {member.phone}
                        </div>
                        <div
                          className="text-slate-400 text-xs truncate flex items-center gap-1"
                          title={member.email}
                        >
                          <FaEnvelope className="text-slate-300 text-[10px]" />
                          {member.email}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          member.status === "Active"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : "bg-rose-50 border-rose-100 text-rose-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${member.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}
                        ></span>
                        {member.status === "Active" ? "Working" : "Left Job"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(member)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600 hover:border-blue-200 transition-all cursor-pointer shrink-0"
                          title="Edit Info & Attendance"
                        >
                          <FaEdit className="text-[11px]" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleStatusToggle(member._id)}
                          disabled={isUpdatingStatus}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                            member.status === "Active"
                              ? "bg-rose-50 border-rose-100 hover:bg-rose-100 text-rose-600"
                              : "bg-emerald-50 border-emerald-100 hover:bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {member.status === "Active" ? (
                            <FaUserSlash className="text-[11px]" />
                          ) : (
                            <FaUserCheck className="text-[11px]" />
                          )}
                          {member.status === "Active"
                            ? "Mark as Left"
                            : "Re-Hire Staff"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingStaffId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-800">
                Update Staff Info & Leaves
              </h3>
              <button
                type="button"
                onClick={() => setEditingStaffId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Modify payroll structure, active absents, and contact
              specifications.
            </p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Staff Member Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Monthly Salary (PKR)
                </label>
                <input
                  type="number"
                  value={editForm.salary}
                  onChange={(e) =>
                    setEditForm({ ...editForm, salary: e.target.value })
                  }
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                />
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <label className="block text-amber-800 font-bold text-xs mb-1">
                  Mark Off-Days / Leaves
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-amber-500 text-slate-700 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddAbsentDate}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-amber-700 transition-all active:scale-[0.97]"
                  >
                    <FaPlus className="text-[10px]" />
                    Add Day
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 max-h-24 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  {editForm.absentDates?.map((date) => (
                    <span
                      key={date}
                      className="inline-flex items-center gap-1 bg-white border border-amber-200 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm"
                    >
                      <FaCalendarAlt className="text-[10px] text-amber-600" />
                      {date}
                      <button
                        type="button"
                        onClick={() => handleRemoveAbsentDate(date)}
                        className="text-rose-500 hover:text-rose-700 ml-1 font-extrabold cursor-pointer transition-colors text-sm"
                        title="Remove Date"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {editForm.absentDates?.length === 0 && (
                    <p className="text-xs text-slate-400 italic flex items-center gap-1">
                      <FaCalendarTimes className="text-[11px]" />
                      No off-days marked for this month.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-teal-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStaffId(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStaff}
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg text-xs hover:bg-teal-700 disabled:bg-teal-400 cursor-pointer transition-all active:scale-[0.98]"
                >
                  {isUpdatingStaff ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
