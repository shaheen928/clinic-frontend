import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddStaffMutation } from "../../store/services/adminApi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const AddStaff = () => {
  const navigate = useNavigate();
  const [addStaff, { isLoading: isAdding }] = useAddStaffMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    staffType: "Clinical",
    salary: "",
    password: "",
    joiningDate: new Date().toISOString().split("T")[0],
    deductInactiveDays: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "staffType" && value === "Support") {
      setFormData({ ...formData, staffType: value, password: "" });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.staffType === "Clinical" && !formData.password) {
      toast.error("Please enter a password for clinical staff.");
      return;
    }

    try {
      await addStaff(formData).unwrap();
      toast.success("Staff member added successfully! 🎉");
      navigate("/admin/staff");
    } catch (err) {
      console.error("Failed to add staff:", err);
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-1 sm:p-6 max-w-3xl mx-auto text-left" dir="ltr">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Add New Staff Member
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Enter details to onboard clinical or support staff.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/staff")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-colors whitespace-nowrap cursor-pointer"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ayesha Khan"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none transition-all shadow-sm bg-slate-50/30 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. ayesha@shifaclick.com"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none transition-all shadow-sm bg-slate-50/30 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 03001234567"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none transition-all shadow-sm bg-slate-50/30 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Monthly Salary (PKR)
              </label>
              <input
                type="number"
                name="salary"
                required
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 65000"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm shadow-sm focus:outline-none bg-slate-50/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Staff Type
              </label>
              <select
                name="staffType"
                value={formData.staffType}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none bg-white transition-all shadow-sm"
              >
                <option value="Clinical">Clinical Staff (OPD/OT/Beds)</option>
                <option value="Support">
                  Support Staff (General/Sweeper/Guard)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Job Role / Designation
              </label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Head Nurse, Sweeper, Security Guard"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none transition-all shadow-sm bg-slate-50/30 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Official Joining Date
              </label>
              {/* <input
                type="date"
                name="joiningDate"
                required
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none bg-white shadow-sm"
              /> */}
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
                  required={true}
                  dateFormat="dd/MM/yyyy"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none bg-white shadow-sm cursor-pointer"
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    {
                      name: "preventOverflow",
                      options: {
                        boundary: "viewport",
                      },
                    },
                  ]}
                  placeholderText="Select Joining Date *"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="deductInactiveDays"
                name="deductInactiveDays"
                checked={formData.deductInactiveDays}
                onChange={handleChange}
                className="w-4 h-4 text-teal-600 border-slate-300 rounded-md focus:ring-teal-500 cursor-pointer"
              />
              <label
                htmlFor="deductInactiveDays"
                className="text-sm font-semibold text-slate-700 cursor-pointer select-none"
              >
                Enable Salary Deduction for Leaves/Absents
              </label>
            </div>
          </div>

          {formData.staffType === "Clinical" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-teal-50/30 rounded-2xl border border-teal-100/50 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">
                  Portal Login Password
                </label>
                <input
                  type="password"
                  name="password"
                  required={formData.staffType === "Clinical"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Set login password for staff"
                  className="w-full border border-teal-200 rounded-xl p-3 text-sm focus:outline-none transition-all shadow-sm bg-white focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex items-center text-xs text-slate-500 font-medium pt-6">
                ℹ️ This password must be used by the clinical staff to log into
                their dashboard.
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/admin/staff")}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-teal-600/10 transition-all disabled:bg-slate-300 cursor-pointer"
            >
              {isAdding ? "Saving Staff..." : "Save Staff Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
