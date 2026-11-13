import React, { useState } from 'react';
import { MealToken, ResidentialHall } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Search, UserCheck } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface StaffScannerProps {
  hall: ResidentialHall;
  tokens: MealToken[];
  onRedeemToken: (tokenNumber: string, staffName: string) => {
    success: boolean;
    reason: string;
    message: string;
    token?: MealToken;
  };
}

export const StaffScanner: React.FC<StaffScannerProps> = ({
  hall,
  tokens,
  onRedeemToken
}) => {
  const [inputTokenNumber, setInputTokenNumber] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'IDLE' | 'SUCCESS' | 'FRAUD' | 'NOT_FOUND' | 'WRONG_HALL';
    message: string;
    token?: MealToken;
    timestamp?: string;
  }>({
    status: 'IDLE',
    message: 'Scanner Ready. Present QR Code or enter token number.'
  });

  const [scanLog, setScanLog] = useState<
    Array<{
      id: string;
      time: string;
      tokenNumber: string;
      studentName: string;
      status: 'APPROVED' | 'REJECTED';
      reason: string;
    }>
  >([]);

  const handleScanToken = (tokenNum: string) => {
    const cleanNum = tokenNum.trim().toUpperCase();
    if (!cleanNum) return;

    const result = onRedeemToken(cleanNum, `Gate Attendant (${hall.code})`);
    const timestamp = new Date().toLocaleTimeString();

    if (result.success && result.token) {
      sounds.playSuccessScan();
      setScanResult({
        status: 'SUCCESS',
        message: result.message,
        token: result.token,
        timestamp
      });

      setScanLog(prev => [
        {
          id: Math.random().toString(),
          time: timestamp,
          tokenNumber: cleanNum,
          studentName: result.token!.studentName,
          status: 'APPROVED',
          reason: result.token!.mealSlot
        },
        ...prev.slice(0, 19)
      ]);
    } else {
      sounds.playErrorBuzz();
      let statusType: 'FRAUD' | 'NOT_FOUND' | 'WRONG_HALL' = 'NOT_FOUND';
      if (result.reason === 'ALREADY_REDEEMED') statusType = 'FRAUD';
      if (result.reason === 'WRONG_HALL') statusType = 'WRONG_HALL';

      setScanResult({
        status: statusType,
        message: result.message,
        token: result.token,
        timestamp
      });

      setScanLog(prev => [
        {
          id: Math.random().toString(),
          time: timestamp,
          tokenNumber: cleanNum,
          studentName: result.token ? result.token.studentName : 'Unknown',
          status: 'REJECTED',
          reason: result.message
        },
        ...prev.slice(0, 19)
      ]);
    }

    setInputTokenNumber('');
  };

  const activeTokens = tokens.filter(t => t.status === 'ACTIVE');
  const redeemedTokens = tokens.filter(t => t.status === 'REDEEMED');

  const shiftApprovedCount = scanLog.filter(l => l.status === 'APPROVED').length;
  const shiftRejectedCount = scanLog.filter(l => l.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner - Crimson Red */}
      <div className="bg-gradient-to-r from-red-900 to-red-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-red-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-200 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Gate Verification Terminal · MBSTU</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-1">
            {hall.name} Dining Entrance
          </h2>
          <p className="text-xs text-red-100/90 mt-0.5">
            Atomic token verification for Lunch &amp; Dinner. Non-transferable and non-refundable.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 bg-red-950/70 px-4 py-2.5 rounded-xl border border-red-700/60">
          <div className="text-center">
            <div className="text-[10px] text-red-200 uppercase font-semibold">Admitted</div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {shiftApprovedCount}
            </div>
          </div>
          <div className="h-8 w-px bg-red-700/60" />
          <div className="text-center">
            <div className="text-[10px] text-red-200 uppercase font-semibold">Blocked / Fraud</div>
            <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
              {shiftRejectedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Viewfinder & Input (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Simulated Scanner Viewfinder */}
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px] overflow-hidden text-center">
            {/* Corner Bracket Overlays */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-red-500 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-red-500 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-red-500 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-red-500 rounded-br-lg" />

            {/* Red Laser Scanning Beam */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-red-500 shadow-[0_0_15px_#dc2626] animate-pulse pointer-events-none" />

            {/* Status Feedback Display */}
            {scanResult.status === 'IDLE' && (
              <div className="space-y-2 z-10">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 flex items-center justify-center text-red-400 border border-slate-700">
                  <Search className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-white">Optical Scanner Active</div>
                <div className="text-xs text-slate-400 max-w-xs">
                  Awaiting student Lunch or Dinner token QR code
                </div>
              </div>
            )}

            {scanResult.status === 'SUCCESS' && (
              <div className="space-y-2 z-10 animate-in zoom-in-95 duration-150">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="text-base font-bold text-emerald-400">
                  MEAL APPROVED · ADMIT RESIDENT
                </div>
                <div className="text-xs text-slate-200 font-medium">
                  {scanResult.token?.studentName} ({scanResult.token?.roomNumber})
                </div>
                <div className="text-xs text-emerald-300 font-mono">
                  {scanResult.token?.mealSlot} · {scanResult.token?.menuName}
                </div>
              </div>
            )}

            {scanResult.status === 'FRAUD' && (
              <div className="space-y-2 z-10 animate-in zoom-in-95 duration-150">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="text-base font-bold text-rose-400">
                  FRAUD WARNING · TOKEN ALREADY REDEEMED
                </div>
                <div className="text-xs text-rose-200 max-w-sm">
                  {scanResult.message}
                </div>
              </div>
            )}

            {(scanResult.status === 'NOT_FOUND' || scanResult.status === 'WRONG_HALL') && (
              <div className="space-y-2 z-10 animate-in zoom-in-95 duration-150">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500">
                  <XCircle className="w-8 h-8" />
                </div>
                <div className="text-base font-bold text-amber-400">
                  ACCESS DENIED
                </div>
                <div className="text-xs text-slate-300 max-w-sm">
                  {scanResult.message}
                </div>
              </div>
            )}
          </div>

          {/* Manual Input Bar */}
          <div className="bg-white rounded-xl border border-red-100 p-4 shadow-xs">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleScanToken(inputTokenNumber);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter or paste token # (e.g. SAFH-20261112-L-084)..."
                  value={inputTokenNumber}
                  onChange={e => setInputTokenNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <button
                type="submit"
                disabled={!inputTokenNumber.trim()}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                Scan Token
              </button>
            </form>
          </div>

          {/* Quick Simulation Buttons for Verification Testing */}
          <div className="bg-white rounded-xl border border-red-100 p-4 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>One-Click Testing Scenarios</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeTokens.slice(0, 2).map(t => (
                <button
                  key={t.id}
                  onClick={() => handleScanToken(t.tokenNumber)}
                  className="text-left p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-emerald-900 truncate">
                    ✓ Valid: {t.mealSlot} ({t.studentName})
                  </div>
                  <div className="font-mono text-[11px] text-emerald-700 truncate">
                    {t.tokenNumber}
                  </div>
                </button>
              ))}

              {redeemedTokens.slice(0, 1).map(t => (
                <button
                  key={t.id}
                  onClick={() => handleScanToken(t.tokenNumber)}
                  className="text-left p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-rose-900 truncate">
                    ⚠ Double-Spend: Already Used
                  </div>
                  <div className="font-mono text-[11px] text-rose-700 truncate">
                    {t.tokenNumber}
                  </div>
                </button>
              ))}

              <button
                onClick={() => handleScanToken('AKBH-20261112-L-999')}
                className="text-left p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-amber-900 truncate">
                  ⛔ Cross-Hall: Alema Khatun Bhashani Token
                </div>
                <div className="font-mono text-[11px] text-amber-700 truncate">
                  AKBH-20261112-L-999
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Shift Gate Verification Log (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-red-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-red-50 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-red-700" />
                <span>Shift Gate Verification Log</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {scanLog.length} events
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {scanLog.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No tokens scanned during this gate shift yet.<br />
                  Scan or click a scenario button to simulate!
                </div>
              ) : (
                scanLog.map(entry => (
                  <div
                    key={entry.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                      entry.status === 'APPROVED'
                        ? 'border-emerald-100 bg-emerald-50/40 text-emerald-900'
                        : 'border-rose-100 bg-rose-50/40 text-rose-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <span>{entry.status === 'APPROVED' ? '✓' : '✕'}</span>
                        <span className="font-mono text-[11px]">{entry.tokenNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {entry.studentName} · {entry.reason}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {entry.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-red-50 text-[11px] text-slate-500 text-center">
            MBSTU Dining Protocol: Tokens are single-use and non-refundable.
          </div>
        </div>
      </div>
    </div>
  );
};
