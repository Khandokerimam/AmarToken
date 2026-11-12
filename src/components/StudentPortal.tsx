import React, { useState } from 'react';
import { ResidentialHall, MealSchedule, StudentProfile, DietaryType, MealSlot } from '../types';
import { Utensils, Clock, AlertCircle, Sparkles, ShieldAlert, Check, Building2, Flame, UserCheck, Ban } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface StudentPortalProps {
  halls: ResidentialHall[];
  selectedHall: ResidentialHall;
  onSelectHall: (hall: ResidentialHall) => void;
  student: StudentProfile;
  onPurchaseToken: (
    mealSlot: MealSlot,
    mealSchedule: MealSchedule,
    dietary: DietaryType,
    paymentMethod: string
  ) => boolean;
  onOpenWalletModal: () => void;
  onOpenRegisterModal: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  halls,
  selectedHall,
  onSelectHall,
  student,
  onPurchaseToken,
  onOpenWalletModal,
  onOpenRegisterModal
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState<MealSchedule | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<DietaryType>(student.dietaryPreference);
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'BKASH' | 'CARD'>('WALLET');
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);
  const [purchaseErrorMessage, setPurchaseErrorMessage] = useState<string | null>(null);

  const handleOpenPurchase = (schedule: MealSchedule) => {
    setSelectedSchedule(schedule);
    setPurchaseErrorMessage(null);
  };

  const handleConfirmPurchase = () => {
    if (!selectedSchedule) return;

    // Check if student belongs to this hall
    if (student.hallId !== selectedHall.id) {
      setPurchaseErrorMessage(
        `Residential Restriction: You are registered in ${student.hallName}. Subsidized tokens for ${selectedHall.name} can only be purchased by its residents.`
      );
      sounds.playErrorBuzz();
      return;
    }

    if (paymentMethod === 'WALLET' && student.walletBalance < selectedSchedule.price) {
      setPurchaseErrorMessage(
        `Insufficient Wallet Balance! Need ৳${selectedSchedule.price}, but your balance is ৳${student.walletBalance.toFixed(2)}. Please recharge your wallet or choose bKash.`
      );
      sounds.playErrorBuzz();
      return;
    }

    const success = onPurchaseToken(
      selectedSchedule.mealSlot,
      selectedSchedule,
      selectedDietary,
      paymentMethod
    );

    if (success) {
      sounds.playPurchaseChime();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      setPurchaseSuccessMessage(`Successfully purchased ${selectedSchedule.title}!`);
      setTimeout(() => {
        setSelectedSchedule(null);
        setPurchaseSuccessMessage(null);
      }, 1400);
    }
  };

  const handleBuyDayPass = () => {
    // 2 meals only: Lunch (65) + Dinner (60) = 125 -> student subsidized bundle = 115
    const eligibleSchedules = selectedHall.diningSchedule.filter(
      s => s.mealSlot === 'LUNCH' || s.mealSlot === 'DINNER'
    );

    const totalBundlePrice = 115;
    if (student.walletBalance < totalBundlePrice) {
      onOpenWalletModal();
      return;
    }

    eligibleSchedules.forEach(schedule => {
      onPurchaseToken(schedule.mealSlot, schedule, selectedDietary, 'WALLET');
    });

    sounds.playPurchaseChime();
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    } catch {}
  };

  return (
    <div className="space-y-8">
      {/* Student Identity Banner */}
      <section className="bg-white rounded-2xl border border-red-100 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>AmarToken · MBSTU Hall Dining System</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Campus Hall Meal Tokens
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Book digital daily Lunch &amp; Dinner tokens for your registered hall. Secure QR codes are verified at the dining gate.
            </p>
          </div>

          {/* Student Profile Pill */}
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-3.5 sm:px-4 sm:py-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-red-700" />
                <span>{student.name}</span>
              </div>
              <div className="text-[11px] font-mono text-red-800 mt-0.5">
                {student.academicEmail || 'Academic ID: ' + student.studentId}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {student.hallName} · {student.roomNumber}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={onOpenWalletModal}
                className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center shadow-2xs"
              >
                Recharge
              </button>
              <button
                onClick={onOpenRegisterModal}
                className="text-[10px] text-red-700 hover:text-red-900 font-medium underline text-center cursor-pointer"
              >
                Switch / Register
              </button>
            </div>
          </div>
        </div>

        {/* Hall Selector (7 MBSTU Halls) */}
        <div className="mt-6 pt-5 border-t border-red-100">
          <label className="block text-xs font-bold text-slate-700 mb-2.5">
            Select Residential Hall ({halls.length} MBSTU Halls):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {halls.map(hall => {
              const isSelected = selectedHall.id === hall.id;
              const isUserHall = student.hallId === hall.id;
              return (
                <button
                  key={hall.id}
                  onClick={() => onSelectHall(hall)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-red-700 bg-red-50 text-red-950 ring-1 ring-red-700 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-red-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {hall.code}
                    </span>
                    {isUserHall && (
                      <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold">
                        Your Hall
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold truncate text-slate-900">{hall.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    Capacity: {hall.capacity} students
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strict No-Refund Policy Notice & 2-Meal Pass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Pass (Lunch + Dinner) */}
        <div className="md:col-span-2 bg-gradient-to-r from-red-800 to-red-950 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-red-900">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-red-200 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Full-Day Dining Bundle (2 Meals: Lunch + Dinner)</span>
            </div>
            <h3 className="text-lg font-bold">Get Today's Lunch &amp; Dinner Tokens</h3>
            <p className="text-xs text-red-100/90 max-w-md">
              One-click combo pass for both daily dining slots with student subsidy.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs line-through text-red-300">৳125</span>
              <span className="text-2xl font-bold font-mono text-amber-300">৳115</span>
            </div>
            <button
              onClick={handleBuyDayPass}
              className="mt-2 px-4 py-2 bg-white hover:bg-slate-100 text-red-800 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Get Both Tokens (৳115)
            </button>
          </div>
        </div>

        {/* Strict No Cancellation / No Refund Policy */}
        <div className="bg-white border-2 border-red-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wide">
              <Ban className="w-4 h-4 text-red-600" />
              <span>No-Refund &amp; Dining Policy</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              • <strong>Strict No Refund Policy:</strong> Token purchases are final. No cancellations or refunds will be allowed.<br />
              • <strong>Lunch Cutoff:</strong> 10:30 AM<br />
              • <strong>Dinner Cutoff:</strong> 5:00 PM<br />
              • Subsidized exclusively for registered residents.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-red-100 text-[11px] text-slate-500 font-medium">
            Provost: {selectedHall.managerName}
          </div>
        </div>
      </div>

      {/* Two Meals Store: Lunch & Dinner */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-red-700" />
            <span>Today's Meal Tokens (Lunch &amp; Dinner)</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {selectedHall.diningSchedule.map(schedule => {
            const isLunch = schedule.mealSlot === 'LUNCH';
            return (
              <div
                key={schedule.id}
                className="bg-white rounded-2xl border border-red-100 hover:border-red-300 p-5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Meal Slot and Price */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-red-700 uppercase">
                        {schedule.mealSlot} MEAL
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                        {schedule.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-red-800">
                        ৳{schedule.price}
                      </div>
                      <div className="text-[10px] text-slate-500">per token</div>
                    </div>
                  </div>

                  {/* Timings and Cutoff */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-4">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {schedule.timeWindow}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-red-700 font-bold">
                      Order Cutoff: {schedule.cutoffTime}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      {schedule.menu.calories} kcal
                    </span>
                  </div>

                  {/* Clean Token Highlight without heavy menus */}
                  <div className="bg-red-50/50 rounded-xl p-3.5 border border-red-100 mb-4 text-xs text-slate-700 leading-relaxed">
                    <div className="font-semibold text-slate-900 mb-1">
                      {isLunch ? 'Daily Afternoon Lunch' : 'Daily Evening Dinner'}
                    </div>
                    <p className="text-slate-600">
                      {schedule.menu.description}
                    </p>
                    <div className="mt-2 text-[11px] text-red-800 font-semibold flex items-center gap-1">
                      <Ban className="w-3 h-3 text-red-600" />
                      <span>Tokens are non-refundable once issued</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    {selectedHall.code} Resident Token
                  </div>
                  <button
                    onClick={() => handleOpenPurchase(schedule)}
                    className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Buy {schedule.mealSlot} Token (৳{schedule.price})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Purchase Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-red-200 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                  Confirm {selectedSchedule.mealSlot} Meal Token
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedSchedule.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Strict Non-Refund Alert */}
            <div className="bg-red-50 border border-red-200 text-red-900 text-xs p-3 rounded-xl flex items-start gap-2">
              <Ban className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> Hall dining tokens cannot be cancelled or refunded after purchase.
              </div>
            </div>

            {/* Error Message */}
            {purchaseErrorMessage && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{purchaseErrorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {purchaseSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{purchaseSuccessMessage}</span>
              </div>
            )}

            {/* Details Summary */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Hall:</span>
                <strong className="text-slate-900">{selectedHall.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Student:</span>
                <strong className="text-slate-900">{student.name} ({student.studentId})</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Serving Window:</span>
                <strong className="text-slate-900">{selectedSchedule.timeWindow}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Order Cutoff:</span>
                <strong className="text-red-700">{selectedSchedule.cutoffTime}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Token Price:</span>
                <span className="text-red-700 font-mono">৳{selectedSchedule.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Dietary Preference Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Dietary Preference:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['HALAL_NON_VEG', 'REGULAR', 'VEGETARIAN', 'DIABETIC_SPECIAL'] as DietaryType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedDietary(type)}
                    className={`py-2 px-3 rounded-lg border text-left cursor-pointer transition-colors ${
                      selectedDietary === type
                        ? 'border-red-700 bg-red-50 text-red-950 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Payment Channel:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'WALLET'
                      ? 'border-red-700 bg-red-50 text-red-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold">Hall Wallet</div>
                  <div className="text-[10px] text-slate-500 font-mono">৳{student.walletBalance.toFixed(0)}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BKASH')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'BKASH'
                      ? 'border-pink-600 bg-pink-50 text-pink-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-pink-700">bKash</div>
                  <div className="text-[10px] text-slate-500">MFS Direct</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    paymentMethod === 'CARD'
                      ? 'border-red-700 bg-red-50 text-red-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold">Smart ID</div>
                  <div className="text-[10px] text-slate-500">Campus Card</div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSchedule(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Pay ৳{selectedSchedule.price} &amp; Issue Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
