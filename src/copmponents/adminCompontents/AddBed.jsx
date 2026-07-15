import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAddBedMutation } from "../../store/services/adminApi";
import { toast } from "react-toastify";
import { FaBed, FaArrowLeft, FaPlusCircle } from "react-icons/fa";

const AddBed = () => {
  const navigate = useNavigate();
  const [addBed, { isLoading }] = useAdminAddBedMutation();

  const [formData, setFormData] = useState({
    bedNumber: "",
    category: "General Ward",
    pricePerDay: "",
  });

  const [isOpenCategorySelect, setIsOpenCategorySelect] = useState(false);

  const categoriesList = [
    { value: "General Ward", label: "General Ward" },
    { value: "Semi-Private", label: "Semi-Private" },
    { value: "Private Room", label: "Private Room" },
    { value: "ICU", label: "ICU (Intensive Care Unit)" },
    { value: "CCU", label: "CCU (Coronary Care Unit)" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (val) => {
    setFormData({ ...formData, category: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBed({
        bedNumber: formData.bedNumber.trim(),
        category: formData.category,
        pricePerDay: Number(formData.pricePerDay),
      }).unwrap();

      toast.success("New bed added successfully! 🎉");
      navigate("/admin/beds");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add bed. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto text-left" dir="ltr">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
            <FaBed className="text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Add New Bed
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Register a new hospital bed with its category and fixed daily
              charges.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/beds")}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer active:scale-[0.97]"
        >
          <FaArrowLeft className="text-[10px]" /> Back
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 font-bold text-sm mb-2">
              Bed Number / Name
            </label>
            <input
              type="text"
              name="bedNumber"
              value={formData.bedNumber}
              onChange={handleChange}
              placeholder="e.g., Bed-101, Ward-A/Bed-5"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all bg-slate-50/50"
            />
          </div>

          <div className="relative">
            <label className="block text-slate-700 font-bold text-sm mb-2">
              Bed Category
            </label>

            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setIsOpenCategorySelect(!isOpenCategorySelect)}
                className="w-full flex items-center justify-between bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-white transition-all focus:border-teal-500 cursor-pointer"
              >
                <span className="truncate">
                  {categoriesList.find((cat) => cat.value === formData.category)
                    ?.label || "Select Category"}
                </span>
                <span
                  className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isOpenCategorySelect ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpenCategorySelect && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpenCategorySelect(false)}
                  />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-150 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-50">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          handleCategoryChange(cat.value);
                          setIsOpenCategorySelect(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold block transition-colors ${
                          formData.category === cat.value
                            ? "bg-teal-50 text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold text-sm mb-2">
              Price Per Day (PKR)
            </label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              placeholder="e.g., 1500"
              min="0"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all bg-slate-50/50"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-600/10 transition-all cursor-pointer active:scale-[0.99]"
            >
              <FaPlusCircle className="text-sm" />
              {isLoading ? "Saving Bed..." : "Save Bed Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBed;
