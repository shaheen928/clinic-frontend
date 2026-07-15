import { useState } from "react";
import {
  useAdminGetAllExpensesQuery,
  useAdminPayDoctorMutation,
  useGetAllDoctorsForAdminQuery,
  useAdminAddExpenseMutation,
  useGetAllStaffQuery,
  useAdminPayStaffSalaryMutation,
} from "../../store/services/adminApi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FinancialDashboard = () => {
  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  const [selectedStaffMonth, setSelectedStaffMonth] =
    useState(currentMonthName);
  const [selectedExpenseMonth, setSelectedExpenseMonth] =
    useState(currentMonthName);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [amountToPay, setAmountToPay] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [notes, setNotes] = useState("");

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffSalaryAmount, setStaffSalaryAmount] = useState("");
  const [staffNotes, setStaffNotes] = useState("");

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Utilities");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [activeDoctorStatement, setActiveDoctorStatement] = useState(null);
  const [activeStaffStatement, setActiveStaffStatement] = useState(null);

  const {
    data: expensesData,
    isLoading: isExpensesLoading,
    error: expensesError,
    refetch: refetchExpenses,
  } = useAdminGetAllExpensesQuery({ month: selectedExpenseMonth });

  const {
    data: doctorsData,
    isLoading: isDoctorsLoading,
    error: doctorsError,
    refetch: refetchDoctors,
  } = useGetAllDoctorsForAdminQuery();

  const {
    data: staffData,
    isLoading: isStaffLoading,
    error: staffError,
    refetch: refetchStaff,
  } = useGetAllStaffQuery({ month: selectedStaffMonth });

  const [adminPayDoctor, { isLoading: isPaying }] = useAdminPayDoctorMutation();
  const [adminAddExpense, { isLoading: isAddingExpense }] =
    useAdminAddExpenseMutation();
  const [adminPayStaffSalary, { isLoading: isPayingStaff }] =
    useAdminPayStaffSalaryMutation();

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!amountToPay || Number(amountToPay) <= 0)
      return toast.error("Please enter a valid amount.");
    try {
      await adminPayDoctor({
        doctorId: selectedDoctor._id,
        amountPaid: Number(amountToPay),
        paymentMode,
        notes,
      }).unwrap();
      toast.success(`Payment recorded successfully!`);
      setIsModalOpen(false);
      setAmountToPay("");
      setNotes("");
      refetchDoctors();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to record payment.");
    }
  };

  const handleStaffSalarySubmit = async (e) => {
    e.preventDefault();
    if (!staffSalaryAmount || Number(staffSalaryAmount) <= 0)
      return toast.error("Please enter a valid amount.");
    try {
      await adminPayStaffSalary({
        staffId: selectedStaff._id,
        amount: Number(staffSalaryAmount),
        notes: staffNotes,
        calculatedSalaryThisMonth: Number(
          selectedStaff?.finalCalculatedSalary || 0,
        ),
        month: selectedStaffMonth,
      }).unwrap();
      toast.success(`Payment recorded successfully!`);
      setIsStaffModalOpen(false);
      setStaffSalaryAmount("");
      setStaffNotes("");
      refetchStaff();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to record staff payment.");
    }
  };

  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount || Number(expenseAmount) <= 0)
      return toast.error("Please fill in all details.");
    try {
      await adminAddExpense({
        title: expenseTitle,
        amount: Number(expenseAmount),
        category: expenseCategory,
        expenseDate,
      }).unwrap();
      toast.success("Expense added successfully!");
      setExpenseTitle("");
      setExpenseAmount("");
      refetchExpenses();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add expense.");
    }
  };

  let runningExpenseTotal = 0;

  const isAnyComponentLoading =
    isDoctorsLoading || isStaffLoading || isExpensesLoading;
  const hasAnyComponentError = doctorsError || staffError || expensesError;

  const getMonthOptions = () => {
    const options = [];
    const date = new Date();
    for (let i = 0; i < 6; i++) {
      const current = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const value = current.toLocaleString("default", { month: "long" });
      const label = current.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      options.push({ value, label });
    }
    return options;
  };

  return (
    <div className="p-4 md:p-6 mx-auto text-left" dir="ltr">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Financial Overview
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Manage ledger records, payroll distributions, and tracked clinic
            outflows.
          </p>
        </div>
      </div>

      {isAnyComponentLoading ? (
        <div className="text-center py-20 text-slate-400 font-medium text-sm">
          Loading Ledgers...
        </div>
      ) : hasAnyComponentError ? (
        <div className="text-center py-20 text-rose-500 font-medium text-sm">
          Error loading financial data. Please refresh the page.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/40">
              <h3 className="text-sm font-bold text-slate-700">
                Doctor Ledger Directory{" "}
                <span className="text-[10px] text-slate-400 font-normal">
                  (All-Time Live Records)
                </span>
              </h3>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-500 min-w-160">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/80 border-b border-slate-100 font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Doctor Name</th>
                    <th className="px-6 py-3.5 text-right whitespace-nowrap">
                      Total Earned
                    </th>
                    <th className="px-6 py-3.5 text-right whitespace-nowrap">
                      Total Paid
                    </th>
                    <th className="px-6 py-3.5 text-right bg-slate-50/50 whitespace-nowrap">
                      Outstanding Balance
                    </th>
                    <th className="px-6 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {doctorsData?.doctors?.map((doc) => {
                    const netPayable =
                      (doc.totalEarned || 0) - (doc.totalPaid || 0);
                    return (
                      <tr
                        key={doc._id}
                        className="hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800 text-sm whitespace-nowrap">
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {doc.speciality}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-medium text-right text-slate-700 whitespace-nowrap">
                          PKR {doc.totalEarned?.toLocaleString() || 0}
                        </td>
                        <td className="px-6 py-4 font-medium text-right text-slate-600 whitespace-nowrap">
                          PKR {doc.totalPaid?.toLocaleString() || 0}
                        </td>
                        <td className="px-6 py-4 font-semibold text-right bg-slate-50/20 text-slate-800">
                          PKR {Math.abs(netPayable).toLocaleString()}
                          <span className="text-[9px] block text-slate-400 font-normal mt-0.5">
                            {netPayable < 0 ? "Advance Payout" : "Payable"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedDoctor({
                                  _id: doc._id,
                                  name: doc.name,
                                });
                                setIsModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-[11px] rounded-lg shadow-sm transition-all"
                            >
                              Pay Doctor
                            </button>
                            <button
                              onClick={() => setActiveDoctorStatement(doc)}
                              className="px-2.5 py-1.5 bg-white text-slate-600 border border-slate-200 font-medium text-[11px] rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                            >
                              View Statement
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-700">
                Staff Payroll Matrix
              </h3>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-slate-200 rounded-md shadow-sm">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Month:
                </label>
                <select
                  value={selectedStaffMonth}
                  onChange={(e) => setSelectedStaffMonth(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  {getMonthOptions().map((opt, index) => (
                    <option key={index} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-500 min-w-160">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/80 border-b border-slate-100 font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 whitespace-nowrap">
                      Employee Name
                    </th>
                    <th className="px-6 py-3.5 text-right whitespace-nowrap">
                      Calculated Salary
                    </th>
                    <th className="px-6 py-3.5 text-right text-amber-600 whitespace-nowrap">
                      Advance Deducted
                    </th>
                    <th className="px-6 py-3.5 text-right whitespace-nowrap">
                      Total Disbursed
                    </th>
                    <th className="px-6 py-3.5 text-right bg-slate-50/50 whitespace-nowrap">
                      Net Due Balance
                    </th>
                    <th className="px-6 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {staffData?.staff?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8 text-slate-400 font-medium"
                      >
                        No staff records found for {selectedStaffMonth}.
                      </td>
                    </tr>
                  ) : (
                    staffData?.staff?.map((employee) => {
                      const calculatedSalary =
                        (employee.finalCalculatedSalary || 0) +
                        (employee.advanceDeducted || 0);
                      const advanceDeducted = employee.advanceDeducted || 0;
                      const paidAmount = employee.totalPaidMonth || 0;
                      const netDue = employee.balance || 0;

                      return (
                        <tr
                          key={employee._id}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800 text-sm whitespace-nowrap">
                              {employee.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                                {employee.role || "Staff"}
                              </span>
                              {employee.advanceBalance > 0 && (
                                <span className="text-[9px] bg-rose-50 text-rose-600 px-1 rounded font-medium">
                                  Adv: PKR {employee.advanceBalance}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-right text-slate-700">
                            PKR {calculatedSalary.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 font-medium text-right text-amber-600 bg-amber-50/10">
                            - PKR {advanceDeducted.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 font-medium text-right text-slate-600">
                            PKR {paidAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 font-semibold text-right bg-slate-50/20 text-slate-800">
                            PKR {netDue.toLocaleString()}
                            <span className="text-[9px] block text-slate-400 font-normal mt-0.5">
                              {netDue <= 0 && advanceDeducted > 0
                                ? "Adjusted via Advance"
                                : "Net Payable"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedStaff(employee);
                                  setStaffSalaryAmount(
                                    netDue > 0 ? netDue : "",
                                  );
                                  setIsStaffModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 font-medium text-[11px] rounded-lg shadow-sm transition-all bg-slate-900 hover:bg-slate-800 text-white"
                              >
                                Payout
                              </button>
                              <button
                                onClick={() =>
                                  setActiveStaffStatement(employee)
                                }
                                className="px-2.5 py-1.5 bg-white text-slate-600 border border-slate-200 font-medium text-[11px] rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                              >
                                View Statement
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-2">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 lg:col-span-1">
              <h3 className="text-sm font-bold text-slate-700 mb-1">
                Record Expense
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Log office outlays into the statement book.
              </p>
              <form
                onSubmit={handleAddExpenseSubmit}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 tracking-wider">
                    Expense Title
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="Electricity, Supplies etc."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-medium bg-slate-50/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 tracking-wider">
                    Amount (PKR)
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-semibold bg-slate-50/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 tracking-wider">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/40 focus:outline-none focus:border-slate-400"
                  >
                    <option value="Utilities">Utilities & Bills</option>
                    <option value="Maintenance">Clinic Maintenance</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 tracking-wider">
                    Date
                  </label>
                  <div className="w-full relative react-datepicker-custom-wrapper">
                    <DatePicker
                      selected={expenseDate ? new Date(expenseDate) : null}
                      onChange={(date) => {
                        if (date) {
                          const offset = date.getTimezoneOffset();
                          const adjustedDate = new Date(
                            date.getTime() - offset * 60 * 1000,
                          );

                          setExpenseDate(
                            adjustedDate.toISOString().split("T")[0],
                          );
                        } else {
                          setExpenseDate("");
                        }
                      }}
                      required={true}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/40 focus:outline-none focus:border-slate-400 cursor-pointer shadow-3xs"
                      popperPlacement="bottom-start"
                      popperModifiers={[
                        {
                          name: "preventOverflow",
                          options: {
                            boundary: "viewport",
                          },
                        },
                      ]}
                      placeholderText="Select Expense Date *"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isAddingExpense}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                  {isAddingExpense ? "Saving..." : "Add Expense"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700">
                  Hospital Expense Running Statement
                </h3>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-slate-200 rounded-md shadow-sm">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Month:
                  </label>
                  <select
                    value={selectedExpenseMonth}
                    onChange={(e) => setSelectedExpenseMonth(e.target.value)}
                    className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    {getMonthOptions().map((opt, index) => (
                      <option key={index} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-500">
                  <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/80 border-b border-slate-100 font-semibold tracking-wider">
                    <tr>
                      <th className="px-5 py-3 whitespace-nowrap">
                        Expense Details
                      </th>
                      <th className="px-5 py-3 whitespace-nowrap">
                        Category / Date
                      </th>
                      <th className="px-5 py-3 text-right">Debit</th>
                      <th className="px-5 py-3 text-right bg-slate-50/50 whitespace-nowrap">
                        Running Outflow
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {expensesData?.data?.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-8 text-slate-400 font-medium"
                        >
                          No expenses recorded for {selectedExpenseMonth}.
                        </td>
                      </tr>
                    ) : (
                      [...expensesData.data]
                        .sort(
                          (a, b) =>
                            new Date(a.expenseDate) - new Date(b.expenseDate),
                        )
                        .map((exp) => {
                          runningExpenseTotal += exp.amount;
                          return (
                            <tr
                              key={exp._id}
                              className="hover:bg-slate-50/20 transition-colors"
                            >
                              <td className="px-5 py-3.5 font-medium text-slate-800">
                                {exp.title}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                  {exp.category}
                                </span>
                                <span className="block text-[10px] text-slate-400 mt-1">
                                  {new Date(
                                    exp.expenseDate,
                                  ).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 font-medium text-slate-700 text-right whitespace-nowrap">
                                PKR {exp.amount?.toLocaleString()}
                              </td>
                              <td className="px-5 py-3.5 font-semibold text-slate-800 text-right bg-slate-50/20">
                                PKR {runningExpenseTotal.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })
                        .reverse()
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDoctorStatement && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-4 md:my-8 flex flex-col max-h-[90vh]">
            <div className="overflow-y-auto flex-1 text-left" dir="ltr">
              <div className="bg-slate-900 px-6 py-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  {activeDoctorStatement.image && (
                    <img
                      src={activeDoctorStatement.image}
                      alt={activeDoctorStatement.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 shadow-md"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight">
                      {activeDoctorStatement.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      {activeDoctorStatement.degree} —{" "}
                      {activeDoctorStatement.speciality}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {activeDoctorStatement.email}
                    </p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Member Ledger
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Statement Period: All-Time Live Summary
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50 border-b border-slate-100 text-xs">
                <div className="p-5">
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Accumulated Credits (Total Earnings)
                  </p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">
                    PKR{" "}
                    {activeDoctorStatement.totalEarned?.toLocaleString() || 0}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    OPD Share + Ward Rounds
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Debited / Paid To Date
                  </p>
                  <p className="text-lg font-bold text-slate-700 mt-1">
                    PKR {activeDoctorStatement.totalPaid?.toLocaleString() || 0}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Total Disbursements Made
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Net Outstanding Balance
                  </p>
                  <p
                    className={`text-lg font-black mt-1 ${
                      activeDoctorStatement.totalEarned -
                        activeDoctorStatement.totalPaid <
                      0
                        ? "text-rose-600"
                        : "text-slate-900"
                    }`}
                  >
                    PKR{" "}
                    {Math.abs(
                      activeDoctorStatement.totalEarned -
                        activeDoctorStatement.totalPaid,
                    ).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {activeDoctorStatement.totalEarned -
                      activeDoctorStatement.totalPaid <
                    0
                      ? "Advance Paid to Doctor"
                      : "Payable by Clinic"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                    Transaction Ledger / Passbook Record
                  </h4>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded border border-slate-200 shadow-3xs transition-all"
                  >
                    Print Statement
                  </button>
                </div>

                <div className="w-full overflow-x-auto border border-slate-100 rounded-lg">
                  <table className="w-full text-xs text-left text-slate-500">
                    <thead className="text-[10px] text-slate-500 uppercase bg-slate-100/80 border-b border-slate-100 font-bold tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Value Date</th>
                        <th className="px-4 py-3">
                          Description / Note Reference
                        </th>
                        <th className="px-4 py-3 text-right">
                          Debit (Withdrawal)
                        </th>
                        <th className="px-4 py-3 text-right">
                          Credit (Deposit)
                        </th>
                        <th className="px-4 py-3 text-right">
                          Running Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {activeDoctorStatement.payouts &&
                      activeDoctorStatement.payouts.length > 0 ? (
                        [...activeDoctorStatement.payouts]
                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                          .map((txn, index) => (
                            <tr
                              key={index}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-medium">
                                {new Date(txn.date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-semibold text-slate-800">
                                  {txn.notes || "N/A"}
                                </p>
                                <span className="text-[9px] text-slate-400">
                                  Ref: TXN-DOC-{index + 1001}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-rose-600 whitespace-nowrap">
                                {!txn.isCredit
                                  ? `PKR ${txn.amountPaid?.toLocaleString()}`
                                  : "-"}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-emerald-600 whitespace-nowrap">
                                {txn.isCredit
                                  ? `PKR ${txn.amountPaid?.toLocaleString()}`
                                  : "-"}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-slate-800 bg-slate-50/30 whitespace-nowrap">
                                PKR {txn.runningBalance?.toLocaleString() || 0}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-10 text-slate-400 font-medium"
                          >
                            No transactions recorded in this ledger.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-100 z-10">
              <button
                onClick={() => setActiveDoctorStatement(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {activeStaffStatement && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-4 md:my-8 flex flex-col max-h-[90vh]">
            <div className="overflow-y-auto flex-1 text-left" dir="ltr">
              <div className="bg-slate-900 px-6 py-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-extrabold text-base border-2 border-slate-700 shadow-md">
                    {activeStaffStatement.name
                      ? activeStaffStatement.name.charAt(0)
                      : "S"}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight">
                      {activeStaffStatement.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium capitalize">
                      Designation:{" "}
                      {activeStaffStatement.role || "Staff Employee"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Contact: {activeStaffStatement.phone || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Staff Ledger Account
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Month Period: {selectedStaffMonth}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50 border-b border-slate-100 text-xs">
                <div className="p-5">
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Calculated Base Salary ({selectedStaffMonth})
                  </p>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    PKR{" "}
                    {(
                      (activeStaffStatement.finalCalculatedSalary || 0) +
                      (activeStaffStatement.advanceDeducted || 0)
                    ).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Excludes Advance Deductions
                  </span>
                </div>
                <div className="p-5 bg-amber-50/10">
                  <p className="text-amber-600 font-semibold uppercase tracking-wider text-[10px]">
                    Advance Paid & Adjusted
                  </p>
                  <p className="text-lg font-bold text-amber-600 mt-1">
                    PKR{" "}
                    {activeStaffStatement.advanceDeducted?.toLocaleString() ||
                      0}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Remaining Adv. Balance: PKR{" "}
                    {activeStaffStatement.advanceBalance?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Total Disbursed / Due Balance
                  </p>
                  <p className="text-lg font-black text-emerald-600 mt-1">
                    PKR{" "}
                    {activeStaffStatement.totalPaidMonth?.toLocaleString() || 0}{" "}
                    / PKR {activeStaffStatement.balance?.toLocaleString() || 0}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Paid vs Net Balance Payable
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                    Disbursement & Payout Record Book
                  </h4>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded border border-slate-200 shadow-3xs transition-all"
                  >
                    Print Statement
                  </button>
                </div>

                <div className="w-full overflow-x-auto border border-slate-100 rounded-lg">
                  <table className="w-full text-xs text-left text-slate-500">
                    <thead className="text-[10px] text-slate-500 uppercase bg-slate-100/80 border-b border-slate-100 font-bold tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Disbursal Month</th>
                        <th className="px-4 py-3">Remarks / References</th>
                        <th className="px-4 py-3 text-right">
                          Calculated Salary
                        </th>
                        <th className="px-4 py-3 text-right">
                          Advance Adjustment
                        </th>
                        <th className="px-4 py-3 text-right">
                          Disbursed Amount
                        </th>
                        <th className="px-4 py-3 text-right">Remaining Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-semibold uppercase">
                          {selectedStaffMonth}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">
                            {activeStaffStatement.notes ||
                              "Salary Generated for Month"}
                          </p>
                          <span className="text-[9px] text-slate-400">
                            Ref: STF-PAY-{activeStaffStatement._id?.slice(-4)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700 whitespace-nowrap">
                          PKR{" "}
                          {(
                            (activeStaffStatement.finalCalculatedSalary || 0) +
                            (activeStaffStatement.advanceDeducted || 0)
                          ).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-amber-600 whitespace-nowrap">
                          - PKR{" "}
                          {activeStaffStatement.advanceDeducted?.toLocaleString() ||
                            0}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                          PKR{" "}
                          {activeStaffStatement.totalPaidMonth?.toLocaleString() ||
                            0}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900 bg-slate-50/30 whitespace-nowrap">
                          PKR{" "}
                          {activeStaffStatement.balance?.toLocaleString() || 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-100 z-10">
              <button
                onClick={() => setActiveStaffStatement(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden p-5 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Pay Doctor: {selectedDoctor.name}
            </h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  Amount to Pay (PKR)
                </label>
                <input
                  type="number"
                  required
                  value={amountToPay}
                  onChange={(e) => setAmountToPay(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  Notes / Remarks
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg h-20 resize-none"
                  placeholder="Optional details..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold"
                >
                  {isPaying ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStaffModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden p-5 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Disburse Salary: {selectedStaff.name}
            </h3>
            <form
              onSubmit={handleStaffSalarySubmit}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  Disbursal Amount (PKR)
                </label>
                <input
                  type="number"
                  required
                  value={staffSalaryAmount}
                  onChange={(e) => setStaffSalaryAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-semibold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  Memo / Note
                </label>
                <textarea
                  value={staffNotes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg h-20 resize-none"
                  placeholder="Salary disbursement details..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPayingStaff}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold"
                >
                  {isPayingStaff ? "Processing..." : "Disburse Salary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;
