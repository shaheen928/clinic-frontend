import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAdminGetAllBedsQuery,
  useAdminUpdateBedMutation,
} from "../../store/services/adminApi";
import { toast } from "react-toastify";
import {
  FaBed,
  FaPlus,
  FaFolderOpen,
  FaRegCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPen,
} from "react-icons/fa";

const ManageBeds = () => {
  const { data, isLoading, error } = useAdminGetAllBedsQuery();
  const [updateBed, { isLoading: isUpdating }] = useAdminUpdateBedMutation();

  const [activeFilter, setActiveFilter] = useState("All");

  const [editingBed, setEditingBed] = useState(null);
  const [editForm, setEditForm] = useState({
    bedNumber: "",
    category: "",
    pricePerDay: "",
  });

  const [isOpenEditCategorySelect, setIsOpenEditCategorySelect] =
    useState(false);

  const categoriesList = [
    "General Ward",
    "Semi-Private",
    "Private Room",
    "ICU",
    "CCU",
  ];

  const filteredBeds = data?.beds?.filter((bed) => {
    if (activeFilter === "All") return true;
    return bed.category === activeFilter;
  });

  const handleEditClick = (bed) => {
    setEditingBed(bed._id);
    setEditForm({
      bedNumber: bed.bedNumber,
      category: bed.category,
      pricePerDay: bed.pricePerDay,
    });
    setIsOpenEditCategorySelect(false);
  };

  const handleCategorySelect = (selectedCategory) => {
    setEditForm({ ...editForm, category: selectedCategory });
    setIsOpenEditCategorySelect(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBed({
        bedId: editingBed,
        updatedData: editForm,
      }).unwrap();
      toast.success("Bed updated successfully! 👍");
      setEditingBed(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update bed");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto text-left" dir="ltr">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
            <FaBed className="text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Bed Management
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Monitor and update hospital bed availability, categories, and
              pricing.
            </p>
          </div>
        </div>
        <div className="w-fit">
          <Link
            to="/admin/add-bed"
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-teal-600/10 transition-all whitespace-nowrap"
          >
            <FaPlus className="text-xs" /> Add New Bed
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl w-fit">
        {[
          "All",
          "General Ward",
          "Semi-Private",
          "Private Room",
          "ICU",
          "CCU",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === cat
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {cat === "All" ? (
              <>
                <FaFolderOpen className="text-[11px]" />
                All ({data?.beds?.length || 0})
              </>
            ) : (
              cat
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500 font-medium">
          Loading Beds...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-rose-500 font-medium">
          Error loading data.
        </div>
      ) : (
        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 transition-colors duration-150">
            <table className="w-full text-sm text-left text-slate-500 min-w-220">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50/70 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Bed Number</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price Per Day</th>
                  <th className="px-6 py-4 font-bold">Current Patient</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBeds.map((bed) => (
                  <tr
                    key={bed._id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                      {bed.bedNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-600">
                        {bed.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      PKR {bed.pricePerDay?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {bed.status === "Occupied" ? (
                        <span className="text-slate-800 font-medium">
                          {bed.currentPatient?.patientName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          bed.status === "Available"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {bed.status === "Available" ? (
                          <FaCheckCircle className="text-[10px]" />
                        ) : (
                          <FaExclamationTriangle className="text-[10px]" />
                        )}
                        {bed.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleEditClick(bed)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-600 hover:text-teal-600 text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <FaPen className="text-[10px]" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingBed && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-50 duration-150">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Update Bed Information
            </h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Bed Number
                </label>
                <input
                  type="text"
                  value={editForm.bedNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bedNumber: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Category
                </label>

                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setIsOpenEditCategorySelect(!isOpenEditCategorySelect)
                    }
                    className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-white transition-all focus:border-teal-500 cursor-pointer"
                  >
                    <span className="truncate">
                      {editForm.category || "Select Category"}
                    </span>
                    <span
                      className={`text-[8px] text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                        isOpenEditCategorySelect ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpenEditCategorySelect && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpenEditCategorySelect(false)}
                      />
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-150 rounded-lg shadow-xl z-20 overflow-hidden divide-y divide-slate-50">
                        {categoriesList.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleCategorySelect(c)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold block transition-colors ${
                              editForm.category === c
                                ? "bg-teal-50 text-teal-700"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Price Per Day (PKR)
                </label>
                <input
                  type="number"
                  value={editForm.pricePerDay}
                  onChange={(e) =>
                    setEditForm({ ...editForm, pricePerDay: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBed(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg text-xs hover:bg-teal-700 transition-all cursor-pointer shadow-md shadow-teal-600/10 disabled:bg-slate-400"
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

export default ManageBeds;
