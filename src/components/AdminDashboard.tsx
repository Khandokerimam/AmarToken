import React, { useState, useEffect } from 'react';
import {
  ResidentialHall,
  StudentProfile,
  AdminAccount,
  MealToken,
  MealOrder,
  PaymentSubmission,
  MealSlot
} from '../types';
import {
  BarChart3,
  Utensils,
  CalendarClock,
  Users,
  ClipboardList,
  CheckSquare,
  FileSpreadsheet,
  LogOut,
  CheckCircle2,
  XCircle,
  Download,
  ChefHat,
  Search,
  Plus,
  Menu,
  X,
  Save
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export type AdminTab =
  | 'statistics'
  | 'meals'
  | 'schedules'
  | 'students'
  | 'orders'
  | 'payments'
  | 'reports';

interface AdminDashboardProps {
  admin: AdminAccount;
  halls: ResidentialHall[];
  students: StudentProfile[];
  tokens: MealToken[];
  orders: MealOrder[];
  payments: PaymentSubmission[];
  onUpdateMeal: (
    hallId: string,
    mealSlot: MealSlot,
    updates: {
      title: string;
      description: string;
      price: number;
      calories: number;
      isAvailable: boolean;
    }
  ) => void;
  onUpdateSchedule: (
    hallId: string,
    mealSlot: MealSlot,
    updates: {
      timeWindow: string;
      cutoffTime: string;
      isCutoffPassed: boolean;
    }
  ) => void;
  onToggleStudentStatus: (studentRecordId: string) => void;
  onCreditStudentWallet: (studentRecordId: string, amount: number) => void;
  onVerifyPayment: (paymentId: string, decision: 'VERIFIED' | 'REJECTED', adminName: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  halls,
  students,
  tokens,
  orders,
  payments,
  onUpdateMeal,
  onUpdateSchedule,
  onToggleStudentStatus,
  onCreditStudentWallet,
  onVerifyPayment,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('statistics');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Manage Meals state
  const [mealHallId, setMealHallId] = useState(halls[5]?.id || halls[0]?.id || 'safh');
  const selectedMealHall = halls.find(h => h.id === mealHallId) || halls[0];
  const lunchObj = selectedMealHall.diningSchedule.find(s => s.mealSlot === 'LUNCH')!;
  const dinnerObj = selectedMealHall.diningSchedule.find(s => s.mealSlot === 'DINNER')!;

  const [lunchForm, setLunchForm] = useState({
    title: lunchObj.title,
    description: lunchObj.menu.description,
    price: String(lunchObj.price),
    calories: String(lunchObj.menu.calories),
    isAvailable: lunchObj.isAvailable
  });
  const [dinnerForm, setDinnerForm] = useState({
    title: dinnerObj.title,
    description: dinnerObj.menu.description,
    price: String(dinnerObj.price),
    calories: String(dinnerObj.menu.calories),
    isAvailable: dinnerObj.isAvailable
  });
  const [mealSavedNotice, setMealSavedNotice] = useState<string | null>(null);

  // Manage Schedules state
  const [schHallId, setSchHallId] = useState(halls[5]?.id || halls[0]?.id || 'safh');
  const selectedSchHall = halls.find(h => h.id === schHallId) || halls[0];
  const schLunchObj = selectedSchHall.diningSchedule.find(s => s.mealSlot === 'LUNCH')!;
  const schDinnerObj = selectedSchHall.diningSchedule.find(s => s.mealSlot === 'DINNER')!;

  const [schLunchForm, setSchLunchForm] = useState({
    timeWindow: schLunchObj.timeWindow,
    cutoffTime: schLunchObj.cutoffTime,
    isCutoffPassed: schLunchObj.isCutoffPassed
  });
  const [schDinnerForm, setSchDinnerForm] = useState({
    timeWindow: schDinnerObj.timeWindow,
    cutoffTime: schDinnerObj.cutoffTime,
    isCutoffPassed: schDinnerObj.isCutoffPassed
  });
  const [schSavedNotice, setSchSavedNotice] = useState<string | null>(null);

  // Sync forms when hall changes
  useEffect(() => {
    const h = halls.find(x => x.id === mealHallId) || halls[0];
    const l = h.diningSchedule.find(s => s.mealSlot === 'LUNCH')!;
    const d = h.diningSchedule.find(s => s.mealSlot === 'DINNER')!;
    setLunchForm({
      title: l.title,
      description: l.menu.description,
      price: String(l.price),
      calories: String(l.menu.calories),
      isAvailable: l.isAvailable
    });
    setDinnerForm({
      title: d.title,
      description: d.menu.description,
      price: String(d.price),
      calories: String(d.menu.calories),
      isAvailable: d.isAvailable
    });
  }, [mealHallId, halls]);

  useEffect(() => {
    const h = halls.find(x => x.id === schHallId) || halls[0];
    const l = h.diningSchedule.find(s => s.mealSlot === 'LUNCH')!;
    const d = h.diningSchedule.find(s => s.mealSlot === 'DINNER')!;
    setSchLunchForm({
      timeWindow: l.timeWindow,
      cutoffTime: l.cutoffTime,
      isCutoffPassed: l.isCutoffPassed
    });
    setSchDinnerForm({
      timeWindow: d.timeWindow,
      cutoffTime: d.cutoffTime,
      isCutoffPassed: d.isCutoffPassed
    });
  }, [schHallId, halls]);

  // Manage Students state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentHallFilter, setStudentHallFilter] = useState('ALL');

  // Manage Orders state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderHallFilter, setOrderHallFilter] = useState('ALL');
  const [orderSlotFilter, setOrderSlotFilter] = useState<'ALL' | 'LUNCH' | 'DINNER'>('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'ISSUED' | 'REDEEMED'>('ALL');

  // Verify Payments state
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');

  // Reports & Kitchen Requisition state
  const [reportHallId, setReportHallId] = useState(halls[5]?.id || halls[0]?.id || 'safh');
  const [reportSlot, setReportSlot] = useState<'LUNCH' | 'DINNER'>('LUNCH');
  const [useLiveCount, setUseLiveCount] = useState(true);
  const [customHeadcount, setCustomHeadcount] = useState(250);

  // Aggregate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const activeTokensCount = tokens.filter(t => t.status === 'ACTIVE').length;
  const redeemedTokensCount = tokens.filter(t => t.status === 'REDEEMED').length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'PENDING').length;

  const filteredStudents = students.filter(s => {
    const matchesHall = studentHallFilter === 'ALL' || s.hallId === studentHallFilter;
    const q = studentSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.academicEmail.toLowerCase().includes(q);
    return matchesHall && matchesQuery;
  });

  const filteredOrders = orders.filter(o => {
    const matchesHall = orderHallFilter === 'ALL' || o.hallId === orderHallFilter;
    const matchesSlot = orderSlotFilter === 'ALL' || o.mealSlot === orderSlotFilter;
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.tokenNumber.toLowerCase().includes(q) ||
      o.studentName.toLowerCase().includes(q) ||
      o.studentId.toLowerCase().includes(q);
    return matchesHall && matchesSlot && matchesStatus && matchesQuery;
  });

  const filteredPayments = payments.filter(
    p => paymentFilter === 'ALL' || p.status === paymentFilter
  );

  // Kitchen Requisition calculation
  const reportHall = halls.find(h => h.id === reportHallId) || halls[0];
  const hallActiveTokens = tokens.filter(t => t.hallId === reportHall.id && t.status === 'ACTIVE');
  const hallLunchCount = hallActiveTokens.filter(t => t.mealSlot === 'LUNCH').length;
  const hallDinnerCount = hallActiveTokens.filter(t => t.mealSlot === 'DINNER').length;
  const requisitionHeadcount = useLiveCount
    ? reportSlot === 'LUNCH'
      ? Math.max(hallLunchCount, 120)
      : Math.max(hallDinnerCount, 95)
    : customHeadcount;

  const getRequisitions = (slot: 'LUNCH' | 'DINNER', count: number) => {
    if (slot === 'LUNCH') {
      return [
        { name: 'Polao / Fine Miniket Rice', category: 'Grains', perStudent: '160g', total: (count * 0.16).toFixed(1), unit: 'kg' },
        { name: 'Deshi Farm Chicken (Cleaned)', category: 'Poultry', perStudent: '220g', total: (count * 0.22).toFixed(1), unit: 'kg' },
        { name: 'Red Musur Lentils (Dal)', category: 'Pulses', perStudent: '35g', total: (count * 0.035).toFixed(1), unit: 'kg' },
        { name: 'Soybean & Mustard Cooking Oil', category: 'Oils', perStudent: '40ml', total: (count * 0.04).toFixed(1), unit: 'Liters' },
        { name: 'Deshi Onions (Peyaj)', category: 'Aromatics', perStudent: '55g', total: (count * 0.055).toFixed(1), unit: 'kg' },
        { name: 'Potatoes & Seasonal Vegetables', category: 'Produce', perStudent: '80g', total: (count * 0.08).toFixed(1), unit: 'kg' }
      ];
    }
    return [
      { name: 'Standard Atash Rice', category: 'Grains', perStudent: '170g', total: (count * 0.17).toFixed(1), unit: 'kg' },
      { name: 'Fresh River Fish (Rui/Katla) / Beef', category: 'Protein', perStudent: '190g', total: (count * 0.19).toFixed(1), unit: 'kg' },
      { name: 'Musur Dal', category: 'Pulses', perStudent: '35g', total: (count * 0.035).toFixed(1), unit: 'kg' },
      { name: 'Eggplant / Begun (for Bharta)', category: 'Produce', perStudent: '75g', total: (count * 0.075).toFixed(1), unit: 'kg' },
      { name: 'Pure Mustard & Soybean Oil', category: 'Oils', perStudent: '35ml', total: (count * 0.035).toFixed(1), unit: 'Liters' }
    ];
  };

  const requisitions = getRequisitions(reportSlot, requisitionHeadcount);

  const exportOrdersCSV = () => {
    const csv =
      'data:text/csv;charset=utf-8,' +
      [
        'OrderNumber,TokenNumber,StudentID,StudentName,Hall,MealSlot,MealDate,Amount,PaymentMethod,Status',
        ...orders.map(
          o =>
            `"${o.orderNumber}","${o.tokenNumber}","${o.studentId}","${o.studentName}","${o.hallName}","${o.mealSlot}","${o.mealDate}",${o.amount},"${o.paymentMethod}","${o.orderStatus}"`
        )
      ].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'AmarToken_Orders_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRequisitionCSV = () => {
    const csv =
      'data:text/csv;charset=utf-8,' +
      [
        'Ingredient,Category,PerStudent,TotalNeeded,Unit',
        ...requisitions.map(r => `"${r.name}","${r.category}","${r.perStudent}",${r.total},"${r.unit}"`)
      ].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `${reportHall.code}_Kitchen_Requisition_${reportSlot}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveMeal = (slot: MealSlot) => {
    const form = slot === 'LUNCH' ? lunchForm : dinnerForm;
    const price = parseFloat(form.price);
    const calories = parseInt(form.calories, 10);
    if (isNaN(price) || price <= 0) return;

    onUpdateMeal(mealHallId, slot, {
      title: form.title.trim() || `Hall ${slot} Token`,
      description: form.description.trim(),
      price,
      calories: isNaN(calories) ? 700 : calories,
      isAvailable: form.isAvailable
    });
    sounds.playSuccessChime();
    setMealSavedNotice(`Updated ${slot} settings for ${selectedMealHall.name}.`);
    setTimeout(() => setMealSavedNotice(null), 2500);
  };

  const handleSaveSchedule = (slot: MealSlot) => {
    const form = slot === 'LUNCH' ? schLunchForm : schDinnerForm;
    onUpdateSchedule(schHallId, slot, {
      timeWindow: form.timeWindow.trim(),
      cutoffTime: form.cutoffTime.trim(),
      isCutoffPassed: form.isCutoffPassed
    });
    sounds.playSuccessChime();
    setSchSavedNotice(`Updated ${slot} schedule for ${selectedSchHall.name}.`);
    setTimeout(() => setSchSavedNotice(null), 2500);
  };

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'statistics', label: 'Dashboard Statistics', icon: BarChart3 },
    { id: 'meals', label: 'Manage Meals', icon: Utensils },
    { id: 'schedules', label: 'Manage Meal Schedules', icon: CalendarClock },
    { id: 'students', label: 'Manage Students', icon: Users },
    { id: 'orders', label: 'Manage Orders', icon: ClipboardList },
    { id: 'payments', label: 'Verify Payments', icon: CheckSquare },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-red-100 flex flex-col justify-between transform transition-transform lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="h-16 px-5 border-b border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/university_projects_550e2ddf.png"
                alt="MBSTU Logo"
                className="w-8 h-8 object-contain"
              />
              <div>
                <div className="text-sm font-extrabold text-red-800 leading-none">AmarToken</div>
                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Admin Console</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-slate-500 hover:text-red-700"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-red-50 bg-red-50/40">
            <div className="text-xs font-bold text-slate-900 truncate">{admin.name}</div>
            <div className="text-[11px] text-red-700 font-medium mt-0.5 truncate">{admin.designation}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">{admin.email}</div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-red-700 text-white'
                      : 'text-slate-700 hover:bg-red-50 hover:text-red-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.id === 'payments' && pendingPaymentsCount > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold tabular-nums ${
                        active ? 'text-red-100' : 'text-red-700'
                      }`}
                    >
                      {pendingPaymentsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-red-100">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-red-100 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-red-100 text-red-700 hover:bg-red-50"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Central MBSTU Hall Dining Administration · 7 Residential Halls
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            Pending Slips:{' '}
            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className="font-bold text-red-700 hover:underline cursor-pointer tabular-nums"
            >
              {pendingPaymentsCount}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* 1. DASHBOARD STATISTICS */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs text-slate-500 font-semibold">Total Token Revenue</div>
                  <div className="text-2xl font-extrabold font-mono text-red-800 mt-1 tabular-nums">
                    ৳{totalRevenue.toFixed(0)}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs text-slate-500 font-semibold">Total Orders</div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                    {orders.length}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs text-slate-500 font-semibold">Active / Redeemed</div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                    {activeTokensCount} / {redeemedTokensCount}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs text-slate-500 font-semibold">Registered Students</div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                    {students.length}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs text-slate-500 font-semibold">Pending Payments</div>
                  <div className="text-2xl font-extrabold font-mono text-red-700 mt-1 tabular-nums">
                    {pendingPaymentsCount}
                  </div>
                </div>
              </div>

              {/* Hall-by-Hall Statistics Table */}
              <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Hall-by-Hall Dining Performance
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live Lunch &amp; Dinner rates, registered student counts, and token sales across all 7 MBSTU halls.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-red-100 text-slate-500 font-semibold">
                        <th className="py-3 px-3">Hall</th>
                        <th className="py-3 px-3 text-right">Residents</th>
                        <th className="py-3 px-3 text-right">Registered Users</th>
                        <th className="py-3 px-3 text-right">Lunch / Dinner</th>
                        <th className="py-3 px-3 text-right">Tokens Issued</th>
                        <th className="py-3 px-3 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {halls.map(h => {
                        const l = h.diningSchedule.find(s => s.mealSlot === 'LUNCH');
                        const d = h.diningSchedule.find(s => s.mealSlot === 'DINNER');
                        const hallOrders = orders.filter(o => o.hallId === h.id);
                        const hallRev = hallOrders.reduce((s, o) => s + o.amount, 0);
                        const regCount = students.filter(st => st.hallId === h.id).length;
                        return (
                          <tr key={h.id} className="hover:bg-red-50/30">
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900">{h.name}</div>
                              <div className="text-[11px] font-mono text-red-700">{h.code}</div>
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                              {h.currentResidents}/{h.capacity}
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums font-bold">
                              {regCount}
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums">
                              ৳{l?.price ?? 65} / ৳{d?.price ?? 60}
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums font-bold">
                              {hallOrders.length}
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-red-800">
                              ৳{hallRev.toFixed(0)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. MANAGE MEALS */}
          {activeTab === 'meals' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Manage Hall Meals (Lunch &amp; Dinner Only)</h2>
                  <p className="text-xs text-slate-500">
                    Configure token pricing, meal descriptions, calories, and active sale availability per hall.
                  </p>
                </div>
                <select
                  value={mealHallId}
                  onChange={e => setMealHallId(e.target.value)}
                  className="px-3.5 py-2.5 border border-red-200 rounded-xl text-xs font-bold text-red-900 bg-red-50/40"
                >
                  {halls.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code})
                    </option>
                  ))}
                </select>
              </div>

              {mealSavedNotice && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                  {mealSavedNotice}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lunch Form */}
                <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-red-50">
                    <span className="text-sm font-extrabold text-red-800">LUNCH MEAL SETTINGS</span>
                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lunchForm.isAvailable}
                        onChange={e => setLunchForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                        className="accent-red-700"
                      />
                      <span>Available for Sale</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Token Title</label>
                    <input
                      type="text"
                      value={lunchForm.title}
                      onChange={e => setLunchForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Summary Description</label>
                    <textarea
                      rows={2}
                      value={lunchForm.description}
                      onChange={e => setLunchForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price (৳ BDT)</label>
                      <input
                        type="number"
                        min="1"
                        value={lunchForm.price}
                        onChange={e => setLunchForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Est. Calories</label>
                      <input
                        type="number"
                        value={lunchForm.calories}
                        onChange={e => setLunchForm(prev => ({ ...prev, calories: e.target.value }))}
                        className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveMeal('LUNCH')}
                    className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Lunch Configuration</span>
                  </button>
                </div>

                {/* Dinner Form */}
                <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-red-50">
                    <span className="text-sm font-extrabold text-red-800">DINNER MEAL SETTINGS</span>
                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dinnerForm.isAvailable}
                        onChange={e => setDinnerForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                        className="accent-red-700"
                      />
                      <span>Available for Sale</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Token Title</label>
                    <input
                      type="text"
                      value={dinnerForm.title}
                      onChange={e => setDinnerForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Summary Description</label>
                    <textarea
                      rows={2}
                      value={dinnerForm.description}
                      onChange={e => setDinnerForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price (৳ BDT)</label>
                      <input
                        type="number"
                        min="1"
                        value={dinnerForm.price}
                        onChange={e => setDinnerForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Est. Calories</label>
                      <input
                        type="number"
                        value={dinnerForm.calories}
                        onChange={e => setDinnerForm(prev => ({ ...prev, calories: e.target.value }))}
                        className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveMeal('DINNER')}
                    className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Dinner Configuration</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. MANAGE MEAL SCHEDULES */}
          {activeTab === 'schedules' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Manage Meal Schedules &amp; Cutoffs</h2>
                  <p className="text-xs text-slate-500">
                    Set serving hours, booking cutoffs, and manually open or close Lunch/Dinner booking windows.
                  </p>
                </div>
                <select
                  value={schHallId}
                  onChange={e => setSchHallId(e.target.value)}
                  className="px-3.5 py-2.5 border border-red-200 rounded-xl text-xs font-bold text-red-900 bg-red-50/40"
                >
                  {halls.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code})
                    </option>
                  ))}
                </select>
              </div>

              {schSavedNotice && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                  {schSavedNotice}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Lunch Schedule */}
                <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-red-50">
                    <span className="text-sm font-extrabold text-red-800">LUNCH SCHEDULE</span>
                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schLunchForm.isCutoffPassed}
                        onChange={e => setSchLunchForm(prev => ({ ...prev, isCutoffPassed: e.target.checked }))}
                        className="accent-red-700"
                      />
                      <span>Mark Cutoff Passed (Closed)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Serving Time Window</label>
                    <input
                      type="text"
                      value={schLunchForm.timeWindow}
                      onChange={e => setSchLunchForm(prev => ({ ...prev, timeWindow: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Booking Cutoff Time</label>
                    <input
                      type="text"
                      value={schLunchForm.cutoffTime}
                      onChange={e => setSchLunchForm(prev => ({ ...prev, cutoffTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveSchedule('LUNCH')}
                    className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Update Lunch Schedule
                  </button>
                </div>

                {/* Dinner Schedule */}
                <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-red-50">
                    <span className="text-sm font-extrabold text-red-800">DINNER SCHEDULE</span>
                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schDinnerForm.isCutoffPassed}
                        onChange={e => setSchDinnerForm(prev => ({ ...prev, isCutoffPassed: e.target.checked }))}
                        className="accent-red-700"
                      />
                      <span>Mark Cutoff Passed (Closed)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Serving Time Window</label>
                    <input
                      type="text"
                      value={schDinnerForm.timeWindow}
                      onChange={e => setSchDinnerForm(prev => ({ ...prev, timeWindow: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Booking Cutoff Time</label>
                    <input
                      type="text"
                      value={schDinnerForm.cutoffTime}
                      onChange={e => setSchDinnerForm(prev => ({ ...prev, cutoffTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveSchedule('DINNER')}
                    className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Update Dinner Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. MANAGE STUDENTS */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Manage Registered Students</h2>
                  <p className="text-xs text-slate-500">
                    Verify academic emails, suspend/reactivate accounts, or credit hall wallet balances.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, ID, or email..."
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <select
                    value={studentHallFilter}
                    onChange={e => setStudentHallFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="ALL">All Halls</option>
                    {halls.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-red-100 text-slate-500 font-semibold">
                      <th className="py-3 px-3">Student</th>
                      <th className="py-3 px-3">Academic Email</th>
                      <th className="py-3 px-3">Hall &amp; Room</th>
                      <th className="py-3 px-3 text-right">Wallet</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map(st => (
                      <tr key={st.id} className="hover:bg-red-50/30">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{st.name}</div>
                          <div className="text-[11px] font-mono text-red-700">{st.studentId}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">{st.academicEmail}</td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-900">{st.hallName}</div>
                          <div className="text-[11px] text-slate-500">{st.roomNumber}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                          ৳{st.walletBalance.toFixed(0)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">
                          <span className={st.status === 'ACTIVE' ? 'text-emerald-700' : 'text-red-700'}>
                            {st.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              onCreditStudentWallet(st.id, 100);
                              sounds.playSuccessChime();
                            }}
                            className="px-2.5 py-1 rounded-lg border border-red-200 text-red-800 hover:bg-red-50 font-bold cursor-pointer inline-flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>৳100</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleStudentStatus(st.id)}
                            className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${
                              st.status === 'ACTIVE'
                                ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            {st.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. MANAGE ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Manage All Meal Orders</h2>
                  <p className="text-xs text-slate-500">
                    Central order ledger across all 7 residential halls. All issued orders are non-refundable.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Order #, token #, student..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-xl"
                  />
                  <select
                    value={orderHallFilter}
                    onChange={e => setOrderHallFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="ALL">All Halls</option>
                    {halls.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.code}
                      </option>
                    ))}
                  </select>
                  <select
                    value={orderSlotFilter}
                    onChange={e => setOrderSlotFilter(e.target.value as any)}
                    className="px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="ALL">Lunch &amp; Dinner</option>
                    <option value="LUNCH">Lunch Only</option>
                    <option value="DINNER">Dinner Only</option>
                  </select>
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ISSUED">Issued</option>
                    <option value="REDEEMED">Redeemed</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-red-100 text-slate-500 font-semibold">
                      <th className="py-3 px-3">Order #</th>
                      <th className="py-3 px-3">Student</th>
                      <th className="py-3 px-3">Hall</th>
                      <th className="py-3 px-3">Slot &amp; Date</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map(ord => (
                      <tr key={ord.id} className="hover:bg-red-50/30">
                        <td className="py-3 px-3">
                          <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                          <div className="text-[11px] font-mono text-red-700">{ord.tokenNumber}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{ord.studentName}</div>
                          <div className="text-[11px] text-slate-500">{ord.studentId}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{ord.hallName}</td>
                        <td className="py-3 px-3 font-mono">
                          {ord.mealSlot} · {ord.mealDate}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{ord.paymentMethod}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                          ৳{ord.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold">
                          <span className={ord.orderStatus === 'ISSUED' ? 'text-red-700' : 'text-emerald-700'}>
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. VERIFY PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Verify Student Payments</h2>
                  <p className="text-xs text-slate-500">
                    Approve pending bKash, Nagad, or Hall Office deposit slips to credit student dining wallets.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPaymentFilter(st)}
                      className={`px-3 py-1.5 rounded-xl border font-bold cursor-pointer ${
                        paymentFilter === st
                          ? 'bg-red-700 text-white border-red-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-red-100 text-slate-500 font-semibold">
                      <th className="py-3 px-3">Reference / TxID</th>
                      <th className="py-3 px-3">Student</th>
                      <th className="py-3 px-3">Hall</th>
                      <th className="py-3 px-3">Channel</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map(pay => (
                      <tr key={pay.id} className="hover:bg-red-50/30">
                        <td className="py-3 px-3">
                          <div className="font-mono font-bold text-slate-900">{pay.referenceId}</div>
                          <div className="text-[11px] text-slate-400">{pay.submittedAt}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{pay.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-500">{pay.studentId}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{pay.hallName}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{pay.method}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                          ৳{pay.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">
                          <span
                            className={
                              pay.status === 'VERIFIED'
                                ? 'text-emerald-700'
                                : pay.status === 'REJECTED'
                                ? 'text-red-700'
                                : 'text-amber-700'
                            }
                          >
                            {pay.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {pay.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  onVerifyPayment(pay.id, 'VERIFIED', admin.name);
                                  sounds.playSuccessChime();
                                }}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onVerifyPayment(pay.id, 'REJECTED', admin.name);
                                  sounds.playErrorBuzz();
                                }}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              {pay.verifiedBy ? `By ${pay.verifiedBy}` : 'Processed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Financial Summary Banner */}
              <div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                    <ChefHat className="w-4 h-4" />
                    <span>Hall Financial &amp; Kitchen Requisition Reports</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                    Export Orders &amp; Kitchen Grocery Planning
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compute raw ingredient quantities for Lunch and Dinner based on live hall token bookings.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={exportOrdersCSV}
                    className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Orders CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportRequisitionCSV}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Requisition CSV</span>
                  </button>
                </div>
              </div>

              {/* Kitchen Requisition Planner */}
              <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-red-50">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <select
                      value={reportHallId}
                      onChange={e => setReportHallId(e.target.value)}
                      className="px-3 py-2 border border-red-200 rounded-xl font-bold text-red-900 bg-red-50/40"
                    >
                      {halls.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.code})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center bg-red-50/60 p-1 rounded-xl border border-red-100">
                      {(['LUNCH', 'DINNER'] as const).map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setReportSlot(slot)}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                            reportSlot === slot ? 'bg-red-700 text-white' : 'text-slate-600'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setUseLiveCount(true)}
                      className={`px-3 py-1.5 rounded-lg border cursor-pointer ${
                        useLiveCount
                          ? 'border-red-700 bg-red-50 text-red-800 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Live Projection ({requisitionHeadcount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseLiveCount(false)}
                      className={`px-3 py-1.5 rounded-lg border cursor-pointer ${
                        !useLiveCount
                          ? 'border-red-700 bg-red-50 text-red-800 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Custom Headcount
                    </button>
                    {!useLiveCount && (
                      <input
                        type="number"
                        min="25"
                        max="1500"
                        value={customHeadcount}
                        onChange={e => setCustomHeadcount(Number(e.target.value))}
                        className="w-20 px-2.5 py-1.5 font-mono border border-slate-300 rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-red-100 text-slate-500 font-semibold">
                        <th className="py-2.5 px-3">Raw Ingredient</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Per-Student Standard</th>
                        <th className="py-2.5 px-3 text-right">
                          Total Needed ({requisitionHeadcount} meals)
                        </th>
                        <th className="py-2.5 px-3">Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requisitions.map((r, idx) => (
                        <tr key={idx} className="hover:bg-red-50/30">
                          <td className="py-3 px-3 font-semibold text-slate-900">{r.name}</td>
                          <td className="py-3 px-3 text-slate-500">{r.category}</td>
                          <td className="py-3 px-3 text-right font-mono text-slate-600">{r.perStudent}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-red-700 tabular-nums">
                            {r.total}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500">{r.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
