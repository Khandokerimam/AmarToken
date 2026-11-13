import React, { useState } from 'react';
import {
  ResidentialHall,
  StudentProfile,
  MealToken,
  MealOrder,
  PaymentSubmission,
  WalletTransaction,
  MealSlot,
  MealSchedule,
  DietaryType
} from '../types';
import { TokenCard } from './TokenCard';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  QrCode,
  CreditCard,
  User,
  LogOut,
  Wallet,
  Building,
  Clock,
  Ban,
  CheckCircle2,
  AlertCircle,
  Printer,
  Menu,
  X,
  Plus,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export type StudentTab = 'dashboard' | 'buy' | 'orders' | 'tokens' | 'payments' | 'profile';

interface StudentDashboardProps {
  student: StudentProfile;
  halls: ResidentialHall[];
  tokens: MealToken[];
  orders: MealOrder[];
  payments: PaymentSubmission[];
  transactions: WalletTransaction[];
  onPurchaseToken: (
    hall: ResidentialHall,
    mealSlot: MealSlot,
    mealSchedule: MealSchedule,
    dietary: DietaryType,
    paymentMethod: 'WALLET' | 'BKASH' | 'NAGAD' | 'CARD'
  ) => boolean;
  onOpenWalletModal: () => void;
  onSubmitPaymentSlip: (
    amount: number,
    method: 'BKASH' | 'NAGAD' | 'BANK_CARD' | 'HALL_OFFICE_CASH',
    referenceId: string
  ) => void;
  onUpdateProfile: (phone: string, dietaryPreference: DietaryType) => void;
  onLogout: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  halls,
  tokens,
  orders,
  payments,
  transactions,
  onPurchaseToken,
  onOpenWalletModal,
  onSubmitPaymentSlip,
  onUpdateProfile,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Store state
  const [selectedHallId, setSelectedHallId] = useState<string>(student.hallId);
  const [selectedDietary, setSelectedDietary] = useState<DietaryType>(student.dietaryPreference);
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'BKASH' | 'NAGAD' | 'CARD'>('WALLET');
  const [purchaseNotice, setPurchaseNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'ISSUED' | 'REDEEMED'>('ALL');

  // Tokens filter
  const [tokenFilter, setTokenFilter] = useState<'ALL' | 'ACTIVE' | 'REDEEMED'>('ALL');
  const [copiedSerial, setCopiedSerial] = useState<string | null>(null);

  // Payment slip quick form
  const [slipAmount, setSlipAmount] = useState('300');
  const [slipMethod, setSlipMethod] = useState<'BKASH' | 'NAGAD' | 'BANK_CARD' | 'HALL_OFFICE_CASH'>('BKASH');
  const [slipRef, setSlipRef] = useState('');
  const [slipFeedback, setSlipFeedback] = useState<string | null>(null);

  // Profile edit
  const [editPhone, setEditPhone] = useState(student.phone);
  const [editDietary, setEditDietary] = useState<DietaryType>(student.dietaryPreference);
  const [profileSaved, setProfileSaved] = useState(false);

  const selectedHall = halls.find(h => h.id === selectedHallId) || halls[0];
  const studentHall = halls.find(h => h.id === student.hallId) || halls[0];
  const isResidentOfSelectedHall = selectedHall.id === student.hallId;

  const studentTokens = tokens.filter(t => t.studentId === student.studentId);
  const activeTokens = studentTokens.filter(t => t.status === 'ACTIVE');
  const studentOrders = orders.filter(o => o.studentId === student.studentId);
  const studentPayments = payments.filter(p => p.studentId === student.studentId);
  const studentTransactions = transactions.filter(t => t.studentId === student.studentId);

  const lunchSchedule = selectedHall.diningSchedule.find(s => s.mealSlot === 'LUNCH');
  const dinnerSchedule = selectedHall.diningSchedule.find(s => s.mealSlot === 'DINNER');
  const comboPrice = (lunchSchedule?.price || 65) + (dinnerSchedule?.price || 60);

  const triggerBuy = (schedule: MealSchedule) => {
    setPurchaseNotice(null);
    if (!isResidentOfSelectedHall) {
      sounds.playErrorBuzz();
      setPurchaseNotice({
        type: 'error',
        text: `Hall restriction: You are registered to ${student.hallName}. Switch back to your home hall to purchase tokens.`
      });
      return;
    }
    if (!schedule.isAvailable) {
      sounds.playErrorBuzz();
      setPurchaseNotice({
        type: 'error',
        text: `${schedule.mealSlot} token sales are currently paused by the Hall Administrator.`
      });
      return;
    }
    if (schedule.isCutoffPassed) {
      sounds.playErrorBuzz();
      setPurchaseNotice({
        type: 'error',
        text: `Booking cutoff (${schedule.cutoffTime}) has passed for ${schedule.mealSlot}.`
      });
      return;
    }
    if (paymentMethod === 'WALLET' && student.walletBalance < schedule.price) {
      sounds.playErrorBuzz();
      setPurchaseNotice({
        type: 'error',
        text: `Insufficient Dining Wallet balance (৳${student.walletBalance.toFixed(0)} available). Recharge wallet or select bKash/Nagad.`
      });
      return;
    }

    const ok = onPurchaseToken(selectedHall, schedule.mealSlot, schedule, selectedDietary, paymentMethod);
    if (ok) {
      sounds.playPurchaseChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#991b1b', '#dc2626', '#ffffff']
      });
      setPurchaseNotice({
        type: 'success',
        text: `${schedule.mealSlot} QR Token issued for ${selectedHall.name}! Note: No cancellations or refunds allowed.`
      });
    }
  };

  const triggerBuyCombo = () => {
    setPurchaseNotice(null);
    if (!lunchSchedule || !dinnerSchedule) return;
    if (!isResidentOfSelectedHall) {
      sounds.playErrorBuzz();
      setPurchaseNotice({
        type: 'error',
        text: `Hall restriction: You can only purchase combo tokens for ${student.hallName}.`
      });
      return;
    }
    if (!lunchSchedule.isAvailable || !dinnerSchedule.isAvailable || lunchSchedule.isCutoffPassed || dinnerSchedule.isCutoffPassed) {
      sounds.playErrorBuzz();
      setPurchaseNotice({
        type: 'error',
        text: 'Both Lunch and Dinner slots must be open and within cutoff to buy the 2-Meal Combo.'
      });
      return;
    }
    if (paymentMethod === 'WALLET' && student.walletBalance < comboPrice) {
      sounds.playErrorBuzz();
      setPurchaseNotice({
        type: 'error',
        text: `Insufficient wallet balance for 2-Meal Combo (৳${comboPrice} required).`
      });
      return;
    }

    onPurchaseToken(selectedHall, 'LUNCH', lunchSchedule, selectedDietary, paymentMethod);
    onPurchaseToken(selectedHall, 'DINNER', dinnerSchedule, selectedDietary, paymentMethod);
    sounds.playPurchaseChime();
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#991b1b', '#dc2626', '#ffffff']
    });
    setPurchaseNotice({
      type: 'success',
      text: `Issued 2 QR Tokens (Lunch & Dinner) for ৳${comboPrice}. Non-refundable.`
    });
  };

  const handleSlipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(slipAmount);
    if (isNaN(amt) || amt <= 0 || !slipRef.trim()) return;
    onSubmitPaymentSlip(amt, slipMethod, slipRef.trim());
    sounds.playPurchaseChime();
    setSlipRef('');
    setSlipFeedback('Payment verification request sent to Hall Admin.');
    setTimeout(() => setSlipFeedback(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editPhone.trim(), editDietary);
    sounds.playSuccessChime();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const filteredOrders = studentOrders.filter(o => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.tokenNumber.toLowerCase().includes(q) ||
      o.mealSlot.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const filteredTokens = studentTokens.filter(t => tokenFilter === 'ALL' || t.status === tokenFilter);

  const navItems: { id: StudentTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buy', label: 'Buy Meal Token', icon: ShoppingBag },
    { id: 'orders', label: 'My Orders', icon: ClipboardList },
    { id: 'tokens', label: 'My QR Tokens', icon: QrCode },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Sidebar Navigation (Desktop) & Drawer (Mobile) */}
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
                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Student Dashboard</div>
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

          {/* Student Summary Block */}
          <div className="p-4 border-b border-red-50 bg-red-50/40">
            <div className="text-xs font-bold text-slate-900 truncate">{student.name}</div>
            <div className="text-[11px] font-mono text-red-700 mt-0.5">{student.studentId}</div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5">{student.hallName}</div>
          </div>

          {/* Nav Links */}
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
                  {item.id === 'tokens' && activeTokens.length > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold tabular-nums ${
                        active ? 'text-red-100' : 'text-red-700'
                      }`}
                    >
                      {activeTokens.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-red-100 space-y-2">
          <button
            type="button"
            onClick={onOpenWalletModal}
            className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              <span>Wallet</span>
            </span>
            <span className="font-mono tabular-nums">৳{student.walletBalance.toFixed(0)}</span>
          </button>

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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Context Header */}
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
                {student.academicEmail} · {student.roomNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenWalletModal}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">৳{student.walletBalance.toFixed(0)}</span>
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs font-semibold text-slate-500">Dining Wallet Balance</div>
                  <div className="text-2xl font-extrabold font-mono text-red-800 mt-1 tabular-nums">
                    ৳{student.walletBalance.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={onOpenWalletModal}
                    className="text-[11px] font-bold text-red-700 hover:underline mt-2 cursor-pointer"
                  >
                    + Top-up or submit slip
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs font-semibold text-slate-500">Active QR Tokens</div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                    {activeTokens.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tokens')}
                    className="text-[11px] font-bold text-red-700 hover:underline mt-2 cursor-pointer"
                  >
                    Open QR Passbook →
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs font-semibold text-slate-500">Total Meal Orders</div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                    {studentOrders.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-[11px] font-bold text-red-700 hover:underline mt-2 cursor-pointer"
                  >
                    View Order History →
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <div className="text-xs font-semibold text-slate-500">Assigned Hall</div>
                  <div className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                    {student.hallName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{student.roomNumber}</div>
                </div>
              </div>

              {/* Today's Hall Schedule & Quick Buy */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Today&apos;s Dining Schedule · {studentHall.code}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Lunch and Dinner tokens are issued exclusively for registered hall residents.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('buy')}
                      className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer"
                    >
                      Buy Token
                    </button>
                  </div>

                  <div className="space-y-3">
                    {studentHall.diningSchedule.map(sch => (
                      <div
                        key={sch.id}
                        className="p-4 rounded-xl border border-red-100 bg-red-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-red-800">
                            {sch.mealSlot} · {sch.title}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Serving: {sch.timeWindow} · Booking Cutoff: {sch.cutoffTime}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-extrabold font-mono text-slate-900 tabular-nums">
                            ৳{sch.price}
                          </span>
                          <span className="text-[11px] font-bold text-red-700">
                            {!sch.isAvailable ? 'Paused' : sch.isCutoffPassed ? 'Closed' : 'Open'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-900 flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-700 shrink-0" />
                    <span>No cancellation or refund is permitted after a meal token is purchased.</span>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Latest Active QR Token</h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tokens')}
                      className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                    >
                      All Tokens ({studentTokens.length})
                    </button>
                  </div>

                  {activeTokens.length === 0 ? (
                    <div className="py-10 text-center space-y-2 border border-dashed border-red-200 rounded-xl">
                      <QrCode className="w-8 h-8 text-red-300 mx-auto" />
                      <div className="text-xs font-semibold text-slate-700">No active QR tokens</div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('buy')}
                        className="px-4 py-1.5 bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Buy Lunch or Dinner Token
                      </button>
                    </div>
                  ) : (
                    <TokenCard token={activeTokens[0]} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. BUY MEAL TOKEN (Lunch & Dinner ONLY, NO Menus) */}
          {activeTab === 'buy' && (
            <div className="space-y-6">
              {/* Hall Selector Bar */}
              <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Building className="w-4 h-4 text-red-700" />
                      <span>Select Residential Hall</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your registered hall is {student.hallName}. Only Lunch and Dinner tokens are issued.
                    </p>
                  </div>
                  {!isResidentOfSelectedHall && (
                    <button
                      type="button"
                      onClick={() => setSelectedHallId(student.hallId)}
                      className="px-3 py-1.5 bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer self-start"
                    >
                      Switch to My Hall ({studentHall.code})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {halls.map(h => {
                    const isSelected = h.id === selectedHallId;
                    const isHome = h.id === student.hallId;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHallId(h.id)}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-red-700 bg-red-50/70'
                            : 'border-slate-200 hover:border-red-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                          <span className="text-red-700">{h.code}</span>
                          {isHome && <span className="text-emerald-700">MY HALL</span>}
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                          {h.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strict No-Refund Policy Banner */}
              <div className="bg-red-800 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      Non-Refundable Meal Token Policy
                    </div>
                    <div className="text-xs text-red-100 mt-0.5">
                      Cancellations and refunds are strictly prohibited after purchasing a Lunch or Dinner token.
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold shrink-0">
                  Wallet: ৳{student.walletBalance.toFixed(0)}
                </div>
              </div>

              {purchaseNotice && (
                <div
                  className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    purchaseNotice.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {purchaseNotice.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    )}
                    <span>{purchaseNotice.text}</span>
                  </div>
                  {purchaseNotice.type === 'success' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('tokens')}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold shrink-0 cursor-pointer"
                    >
                      View QR Token
                    </button>
                  )}
                </div>
              )}

              {/* Purchase Preferences */}
              <div className="bg-white rounded-2xl border border-red-100 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Dietary Option</label>
                  <select
                    value={selectedDietary}
                    onChange={e => setSelectedDietary(e.target.value as DietaryType)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="HALAL_NON_VEG">Halal Non-Veg</option>
                    <option value="REGULAR">Regular Balanced</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="DIABETIC_SPECIAL">Diabetic Special</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['WALLET', 'BKASH', 'NAGAD', 'CARD'] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2.5 rounded-xl border font-bold cursor-pointer transition-colors ${
                          paymentMethod === method
                            ? 'border-red-700 bg-red-50 text-red-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meal Store Cards: ONLY Lunch and Dinner, NO Dish Menus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedHall.diningSchedule.map(schedule => {
                  const disabled = !isResidentOfSelectedHall || !schedule.isAvailable || schedule.isCutoffPassed;
                  return (
                    <div
                      key={schedule.id}
                      className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-red-700">
                              {schedule.mealSlot} TOKEN · {selectedHall.code}
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-950 mt-0.5">
                              {schedule.title}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-extrabold font-mono text-red-800 tabular-nums">
                              ৳{schedule.price}
                            </div>
                            <div className="text-[10px] text-slate-400">Non-refundable</div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {schedule.menu.description}
                        </p>

                        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-red-700 shrink-0" />
                            <span>Serving: {schedule.timeWindow}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-red-700 shrink-0" />
                            <span>Cutoff: {schedule.cutoffTime}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => triggerBuy(schedule)}
                        className={`w-full py-3 rounded-xl text-xs font-bold transition-colors ${
                          disabled
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-red-700 hover:bg-red-800 text-white cursor-pointer'
                        }`}
                      >
                        {!isResidentOfSelectedHall
                          ? `Restricted to ${studentHall.code} Residents`
                          : !schedule.isAvailable
                          ? 'Currently Paused by Admin'
                          : schedule.isCutoffPassed
                          ? `Cutoff Passed (${schedule.cutoffTime})`
                          : `Buy ${schedule.mealSlot} Token · ৳${schedule.price}`}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* 2-Meal Daily Combo Pass */}
              <div className="bg-white rounded-2xl border border-red-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-red-700">
                    Daily Combo Option · Lunch + Dinner
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    Purchase Both Today&apos;s Lunch &amp; Dinner Tokens Together
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generates two separate QR tokens immediately. Strictly non-refundable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={triggerBuyCombo}
                  className="px-5 py-3 bg-red-900 hover:bg-red-950 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 font-mono"
                >
                  Buy 2-Meal Pass · ৳{comboPrice}
                </button>
              </div>
            </div>
          )}

          {/* 3. MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">My Meal Token Orders</h2>
                  <p className="text-xs text-slate-500">
                    Complete record of Lunch &amp; Dinner token purchases (non-refundable).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Search order # or token #..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  {(['ALL', 'ISSUED', 'REDEEMED'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-2 rounded-xl border font-bold cursor-pointer ${
                        orderStatusFilter === st
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
                      <th className="py-3 px-3">Order #</th>
                      <th className="py-3 px-3">Token Serial</th>
                      <th className="py-3 px-3">Meal Slot</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Method</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          No orders match your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(ord => (
                        <tr key={ord.id} className="hover:bg-red-50/30">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                          <td className="py-3 px-3 font-mono text-red-700">{ord.tokenNumber}</td>
                          <td className="py-3 px-3 font-semibold text-slate-800">{ord.mealSlot}</td>
                          <td className="py-3 px-3 font-mono text-slate-600 tabular-nums">{ord.mealDate}</td>
                          <td className="py-3 px-3 text-slate-600">{ord.paymentMethod}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                            ৳{ord.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold">
                            <span className={ord.orderStatus === 'ISSUED' ? 'text-red-700' : 'text-emerald-700'}>
                              {ord.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. MY QR TOKENS */}
          {activeTab === 'tokens' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-red-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">My QR Meal Tokens</h2>
                  <p className="text-xs text-slate-500">
                    Present an active QR code at your dining hall gate counter.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {(['ALL', 'ACTIVE', 'REDEEMED'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTokenFilter(st)}
                      className={`px-3 py-1.5 rounded-xl border font-bold cursor-pointer ${
                        tokenFilter === st
                          ? 'bg-red-700 text-white border-red-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl border border-red-200 text-red-800 hover:bg-red-50 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {copiedSerial && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
                  Copied token serial <span className="font-mono">{copiedSerial}</span> for gate counter verification.
                </div>
              )}

              {filteredTokens.length === 0 ? (
                <div className="bg-white rounded-2xl border border-red-100 p-12 text-center space-y-3">
                  <QrCode className="w-10 h-10 text-red-300 mx-auto" />
                  <div className="text-sm font-bold text-slate-800">No tokens found</div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('buy')}
                    className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Buy Meal Token
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filteredTokens.map(tok => (
                    <TokenCard
                      key={tok.id}
                      token={tok}
                      onSimulateGateScan={serial => {
                        navigator.clipboard?.writeText(serial);
                        setCopiedSerial(serial);
                        setTimeout(() => setCopiedSerial(null), 2500);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. PAYMENT HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Submit Payment Verification Slip */}
              <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Submit Payment Slip for Admin Verification
                    </h2>
                    <p className="text-xs text-slate-500">
                      Paid via bKash, Nagad, or Hall Cash Office? Submit your reference ID for Admin approval.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenWalletModal}
                    className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer self-start"
                  >
                    + Instant Wallet Top-Up
                  </button>
                </div>

                {slipFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                    {slipFeedback}
                  </div>
                )}

                <form onSubmit={handleSlipSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <input
                    type="number"
                    min="50"
                    required
                    placeholder="Amount (৳)"
                    value={slipAmount}
                    onChange={e => setSlipAmount(e.target.value)}
                    className="px-3 py-2.5 font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  <select
                    value={slipMethod}
                    onChange={e => setSlipMethod(e.target.value as any)}
                    className="px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="BKASH">bKash</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="BANK_CARD">Campus Card</option>
                    <option value="HALL_OFFICE_CASH">Hall Office Cash</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="TxID / Slip Ref (e.g. BKSH-9921)"
                    value={slipRef}
                    onChange={e => setSlipRef(e.target.value)}
                    className="px-3 py-2.5 font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Slip</span>
                  </button>
                </form>
              </div>

              {/* Submitted Payment Slips */}
              <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Submitted Verification Slips</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-red-100 text-slate-500 font-semibold">
                        <th className="py-2.5 px-3">Reference ID</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3">Submitted At</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-right">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentPayments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            No payment verification slips submitted.
                          </td>
                        </tr>
                      ) : (
                        studentPayments.map(pay => (
                          <tr key={pay.id}>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">{pay.referenceId}</td>
                            <td className="py-3 px-3 text-slate-600">{pay.method}</td>
                            <td className="py-3 px-3 text-slate-500 font-mono">{pay.submittedAt}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                              ৳{pay.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold">
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
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Wallet Ledger */}
              <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Wallet &amp; Token Purchase Ledger</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-red-100 text-slate-500 font-semibold">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400">
                            No wallet transactions recorded.
                          </td>
                        </tr>
                      ) : (
                        studentTransactions.map(tx => (
                          <tr key={tx.id}>
                            <td className="py-3 px-3 font-mono text-slate-500">{tx.date}</td>
                            <td className="py-3 px-3 font-medium text-slate-900">{tx.description}</td>
                            <td className="py-3 px-3 text-slate-600">{tx.paymentMethod}</td>
                            <td
                              className={`py-3 px-3 text-right font-mono font-bold tabular-nums ${
                                tx.amount > 0 ? 'text-emerald-700' : 'text-slate-900'
                              }`}
                            >
                              {tx.amount > 0 ? `+৳${tx.amount.toFixed(2)}` : `-৳${Math.abs(tx.amount).toFixed(2)}`}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-red-100 p-6 sm:p-8 max-w-3xl space-y-6">
              <div className="flex items-center gap-4 pb-5 border-b border-red-100">
                <div className="w-14 h-14 rounded-2xl bg-red-700 text-white flex items-center justify-center text-xl font-extrabold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950">{student.name}</h2>
                  <div className="text-xs font-mono text-red-700 mt-0.5">
                    {student.academicEmail} · {student.studentId}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400">Assigned Hall</div>
                  <div className="font-bold text-slate-900 mt-0.5">{student.hallName}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400">Room Number</div>
                  <div className="font-bold text-slate-900 mt-0.5">{student.roomNumber}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400">Department</div>
                  <div className="font-bold text-slate-900 mt-0.5">{student.department}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400">Batch &amp; Account Status</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {student.batch} · {student.status}
                  </div>
                </div>
              </div>

              {profileSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                  Profile preferences updated successfully.
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 border-t border-slate-100 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Default Dietary Preference</label>
                    <select
                      value={editDietary}
                      onChange={e => setEditDietary(e.target.value as DietaryType)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                    >
                      <option value="HALAL_NON_VEG">Halal Non-Veg</option>
                      <option value="REGULAR">Regular Balanced</option>
                      <option value="VEGETARIAN">Vegetarian</option>
                      <option value="DIABETIC_SPECIAL">Diabetic Special</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Profile Preferences
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
