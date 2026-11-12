import React, { useState } from 'react';
import { StudentProfile, WalletTransaction } from '../types';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  transactions: WalletTransaction[];
  onTopUp: (amount: number, method: 'BKASH' | 'NAGAD' | 'STUDENT_WALLET' | 'BANK_CARD' | 'HALL_OFFICE_CASH') => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  student,
  transactions,
  onTopUp
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(300);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'BKASH' | 'NAGAD' | 'BANK_CARD' | 'HALL_OFFICE_CASH'>('BKASH');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDeposit = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) return;

    onTopUp(finalAmount, selectedMethod);
    sounds.playPurchaseChime();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-red-100 space-y-5 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Dining Wallet</h3>
              <p className="text-xs text-slate-500">MBSTU Hall Subsidy &amp; Meal Token Account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card - Crimson Red Gradient */}
        <div className="bg-gradient-to-r from-red-800 to-red-950 text-white rounded-xl p-5 shadow-xs flex items-center justify-between border border-red-900">
          <div>
            <div className="text-xs text-red-200">Available Dining Balance</div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-white mt-1">
              ৳{student.walletBalance.toFixed(2)}
            </div>
            <div className="text-[11px] text-red-200 mt-0.5">
              {student.name} · {student.academicEmail || student.studentId}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-red-200 font-semibold flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified MBSTU Resident</span>
            </div>
            <div className="text-[11px] text-slate-200 mt-1">{student.hallName}</div>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <div className="text-base font-bold text-slate-900">Recharge Successful!</div>
            <div className="text-xs text-slate-500">Funds have been deposited into your dining wallet.</div>
          </div>
        ) : (
          <>
            {/* Quick Recharge Amounts */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Top-Up Amount:
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[100, 300, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-3 rounded-lg border font-mono font-bold text-center cursor-pointer transition-colors ${
                      selectedAmount === amt && !customAmount
                        ? 'border-red-700 bg-red-50 text-red-900 ring-1 ring-red-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>

              <div className="mt-2.5">
                <input
                  type="number"
                  placeholder="Or enter custom amount in ৳ (e.g. 450)..."
                  value={customAmount}
                  onChange={e => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Payment Channel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Recharge Method:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('BKASH')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    selectedMethod === 'BKASH'
                      ? 'border-pink-600 bg-pink-50 text-pink-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>bKash</div>
                  <div className="text-[10px] text-slate-400">Personal/Merchant</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('NAGAD')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    selectedMethod === 'NAGAD'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>Nagad</div>
                  <div className="text-[10px] text-slate-400">Post Office MFS</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('BANK_CARD')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    selectedMethod === 'BANK_CARD'
                      ? 'border-red-700 bg-red-50 text-red-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>Campus Card</div>
                  <div className="text-[10px] text-slate-400">Smart MBSTU ID</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('HALL_OFFICE_CASH')}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                    selectedMethod === 'HALL_OFFICE_CASH'
                      ? 'border-red-700 bg-red-50 text-red-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>Hall Office</div>
                  <div className="text-[10px] text-slate-400">Cash Deposit Slip</div>
                </button>
              </div>
            </div>

            {/* Deposit Action */}
            <button
              onClick={handleDeposit}
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>
                Deposit ৳{customAmount ? customAmount : selectedAmount} via {selectedMethod}
              </span>
            </button>
          </>
        )}

        {/* Transaction History Section */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
            <span>Recent Dining Transactions</span>
            <span className="text-[11px] text-slate-400">{transactions.length} records</span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                    tx.amount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{tx.description}</div>
                    <div className="text-[10px] text-slate-400">{tx.date}</div>
                  </div>
                </div>
                <div className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {tx.amount > 0 ? `+৳${tx.amount.toFixed(2)}` : `-৳${Math.abs(tx.amount).toFixed(2)}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
