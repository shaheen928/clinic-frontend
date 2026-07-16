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
    <div className="p-4 md:p-6 mx-auto text-left w-full max-w-full overflow-x-hidden" dir="ltr">
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
        <div className="space-y-6 w-full">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden w-full">
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

          {/* 1. Staff Payroll Matrix Card - یہاں ریسپانسو ہیڈر کلاسز شامل کر دی ہیں */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden w-full">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-sm font-bold text-slate-700">
                Staff Payroll Matrix
              </h3>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-slate-200 rounded-md shadow-sm self-start sm:self-auto">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-2 w-full">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 lg:col-span-1 w-full box-border">
              <h3 className="text-sm font-bold text-slate-700 mb-1">
                Record Expense
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Log office outlays into the statement book.
              </p>
              <form
                onSubmit={handleAddExpenseSubmit}
                className="space-y-3.5 text-xs w-full"
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

            {/* 2. Hospital Expense Running Statement - یہاں بھی ہیڈر ریسپانسو کلاسز اپڈیٹ کر دی ہیں */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2 w-full">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h3 className="text-sm font-bold text-slate-700">
                  Hospital Expense Running Statement
                </h3>
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 border border-slate-200 rounded-md shadow-sm self-start sm:self-auto">
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

      {/* ڈاکٹر اسٹیٹمنٹ والا ماڈل جوں کا توں محفوظ ہے */}
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
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveDoctorStatement(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;
