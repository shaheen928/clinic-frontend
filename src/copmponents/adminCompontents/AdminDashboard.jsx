import React from "react";
import { useGetAdminDashboardQuery } from "../../store/services/adminApi";
import DashboardChart from "./DashboardChart";

const AdminDashboard = () => {
  const { data, isLoading, error } = useGetAdminDashboardQuery();
  const dashData = data?.dashData;
  const graphData = data?.dashData?.graphData || [];

  const totalInflow = dashData?.totalHospitalInflow || 0;
  const onlineInflow = dashData?.onlineRevenue || 0;
  const cashOutflow = dashData?.totalCashOutflow || 0;

  const counterCashInflow = totalInflow - onlineInflow;

  const combinedTotalSafeFunds = totalInflow - cashOutflow;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 text-left" dir="ltr">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          ShifaClick Financial Control Center 🏦
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Real-time system overview, daily expenses, and ledger audits.
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-slate-500 font-medium">
          Syncing live accounts...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">
          Error linking to financial database.
        </div>
      )}

      {!isLoading && !error && dashData && (
        <div className="space-y-8 transition-all duration-300">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Total Safe & Bank Funds
                </p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  Rs. {combinedTotalSafeFunds}
                </h3>
              </div>
              <p className="text-[11px] text-blue-600 font-medium mt-2">
                💰 Combined Cash + Stripe funds minus outgoing cash.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Total Liabilities
                </p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  Rs. {dashData.totalGlobalPayable || 0}
                </h3>
              </div>
              <p className="text-[11px] text-amber-600 font-medium mt-2">
                ⚠️ Doctor Outstandings + Pending Salaries only.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Admin Gross Revenue
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  Rs. {dashData.adminGrossRevenue || 0}
                </h3>
              </div>
              <p className="text-[11px] text-teal-600 font-medium mt-2">
                📈 Total admin flow before operational cuts.
              </p>
            </div>

            <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-md text-white flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                  True Net Profit
                </p>
                <h3 className="text-2xl font-black mt-1">
                  Rs. {dashData.adminNetProfit || 0}
                </h3>
              </div>
              <p className="text-xs text-emerald-200/80 mt-2">
                ✨ Admin revenue minus expenses and pending salaries.
              </p>
            </div>
          </div>

          {/* سورس بریک ڈاؤن */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              Admin Revenue Breakdown (Source-Wise)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100/60">
                <span className="block text-xs font-semibold text-teal-600 uppercase tracking-wider">
                  OPD Commission
                </span>
                <span className="text-xl font-bold text-slate-800 block mt-1">
                  Rs. {dashData.adminOPDCommission || 0}
                </span>
              </div>

              <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100/60">
                <span className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Bed Income (100%)
                </span>
                <span className="text-xl font-bold text-slate-800 block mt-1">
                  Rs. {dashData.adminBedRevenue || 0}
                </span>
              </div>

              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100/60">
                <span className="block text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  Surgery Commission
                </span>
                <span className="text-xl font-bold text-slate-800 block mt-1">
                  Rs. {dashData.adminSurgeryCommission || 0}
                </span>
              </div>

              <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100/60">
                <span className="block text-xs font-semibold text-sky-600 uppercase tracking-wider">
                  Round Commission
                </span>
                <span className="text-xl font-bold text-slate-800 block mt-1">
                  Rs. {dashData.adminRoundCommission || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase block">
                Total Inflow
              </span>
              <h4 className="text-lg font-bold text-slate-800 mt-1">
                Rs. {totalInflow}
              </h4>
              <span className="text-[10px] text-slate-400 block mt-1">
                🎯 Cash + Online
              </span>
            </div>

            <div className=" p-4 rounded-2xl border border-blue-100 shadow-xs bg-blue-50/5">
              <span className="text-xs font-semibold text-blue-600 uppercase block">
                Counter Cash
              </span>
              <h4 className="text-lg font-bold text-blue-700 mt-1">
                Rs. {counterCashInflow}
              </h4>
              <span className="text-[10px] text-blue-500 block mt-1">
                💵 Physical Cash
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase block">
                Online Stripe
              </span>
              <h4 className="text-lg font-bold text-slate-800 mt-1">
                Rs. {onlineInflow}
              </h4>
              <span className="text-[10px] text-purple-500 block mt-1">
                💳 Bank Deposit
              </span>
            </div>

            <div className=" p-4 rounded-2xl border border-rose-200 shadow-xs bg-rose-50/10">
              <span className="text-xs font-semibold text-rose-500 uppercase block">
                Total Outflow
              </span>
              <h4 className="text-lg font-bold text-rose-600 mt-1">
                Rs. {cashOutflow}
              </h4>
              <span className="text-[10px] text-rose-400 block mt-1">
                💸 Hand Disbursed
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/5">
              <span className="text-xs font-semibold text-amber-600 uppercase block">
                Petty Expenses
              </span>
              <h4 className="text-lg font-bold text-amber-700 mt-1">
                Rs. {dashData.totalDailyExpenses || 0}
              </h4>
              <span className="text-[10px] text-amber-500 block mt-1">
                📝 Daily Hospital Cost
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-xs font-semibold text-indigo-600 uppercase block">
                Active IPD Bills
              </span>
              <h4 className="text-lg font-bold text-indigo-700 mt-1">
                Rs. {dashData.activeRunningBills || 0}
              </h4>
              <span className="text-[10px] text-slate-400 block mt-1">
                ⏳ Un-billed Flow
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
                👥 Staff Payroll Ledger
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-medium uppercase">
                    Total Committed
                  </span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">
                    Rs. {dashData.totalStaffSalariesExpense || 0}
                  </span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <span className="block text-[10px] text-emerald-600 font-medium uppercase">
                    Disbursed/Paid
                  </span>
                  <span className="text-xs font-bold text-emerald-700 block mt-1">
                    Rs. {dashData.paidStaffSalaries || 0}
                  </span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl">
                  <span className="block text-[10px] text-amber-600 font-medium uppercase">
                    Unpaid/Pending
                  </span>
                  <span className="text-xs font-bold text-amber-700 block mt-1">
                    Rs. {dashData.pendingStaffSalaries || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
                🩺 Doctors Global Wallet Accounts
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="block text-[10px] text-slate-400 font-medium uppercase">
                    Total Share
                  </span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">
                    Rs. {dashData.doctorTotalShare || 0}
                  </span>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <span className="block text-[10px] text-blue-600 font-medium uppercase">
                    Admin Disbursed
                  </span>
                  <span className="text-xs font-bold text-blue-700 block mt-1">
                    Rs. {dashData.totalDoctorPaid || 0}
                  </span>
                </div>
                <div className="bg-rose-50 p-3 rounded-xl">
                  <span className="block text-[10px] text-rose-600 font-medium uppercase">
                    Outstanding Owed
                  </span>
                  <span className="text-xs font-bold text-rose-700 block mt-1">
                    Rs. {dashData.totalDoctorRemaining || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs font-medium text-slate-400">
                Consultant Physicians
              </span>
              <span className="text-lg font-bold text-slate-800 block mt-1">
                {dashData.doctors || 0}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs font-medium text-slate-400">
                Total Unique Patients
              </span>
              <span className="text-lg font-bold text-slate-800 block mt-1">
                {dashData.patients || 0}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs font-medium text-slate-400">
                Total Bookings
              </span>
              <span className="text-lg font-bold text-slate-800 block mt-1">
                {dashData.appointments || 0}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-xs font-medium text-rose-500">
                Cancelled Bookings
              </span>
              <span className="text-lg font-bold text-rose-700 block mt-1">
                {dashData.cancelledAppointments || 0}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
            <DashboardChart data={graphData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
