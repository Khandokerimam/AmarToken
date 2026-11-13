import React, { useState } from 'react';
import { ResidentialHall, MealToken, StaffAccount } from '../types';
import {
  QrCode,
  ShieldCheck,
  History,
  LogOut,
  CheckCircle2,
  XCircle,
  Search,
  Building,
  AlertTriangle,
  Scan,
  Menu,
  X
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export type StaffTab = 'scanner' | 'verification' | 'history';

interface StaffDashboardProps {
  staff: StaffAccount;
  halls: ResidentialHall[];
  tokens: MealToken[];
  onRedeemToken: (
    tokenNumber: string,
    gateHallId: string,
    staffLabel: string
  ) => { success: boolean; reason: string; message: string; token?: MealToken };
  onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  staff,
  halls,
  tokens,
  onRedeemToken,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<StaffTab>('scanner');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGateHallId, setActiveGateHallId] = useState<string>(staff.assignedHallId);

  // Scanner state
  const [inputToken, setInputToken] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    reason: string;
    message: string;
    token?: MealToken;
  } | null>(null);
  const [isScanningAnim, setIsScanningAnim] = useState(false);

  // Token verification lookup state
  const [verifyQuery, setVerifyQuery] = useState('');

  // History filter state
  const [historySearch, setHistorySearch] = useState('');
  const [historyHallFilter, setHistoryHallFilter] = useState<string>('ALL');

  const activeGateHall = halls.find(h => h.id === activeGateHallId) || halls[0];
  const staffLabel = `${staff.name} (${staff.counterGate})`;

  const triggerScan = (tokenNum: string) => {
    const cleaned = tokenNum.trim().toUpperCase();
    if (!cleaned) return;
    setIsScanningAnim(true);
    setScanResult(null);

    setTimeout(() => {
      const res = onRedeemToken(cleaned, activeGateHall.id, staffLabel);
      setScanResult(res);
      setIsScanningAnim(false);
      if (res.success) {
        sounds.playSuccessChime();
      } else {
        sounds.playErrorBuzz();
      }
    }, 300);
  };

  const handleScanForm = (e: React.FormEvent) => {
    e.preventDefault();
    triggerScan(inputToken);
  };

  // Tokens for simulation helpers
  const activeHallToken = tokens.find(t => t.hallId === activeGateHall.id && t.status === 'ACTIVE');
  const redeemedHallToken = tokens.find(t => t.hallId === activeGateHall.id && t.status === 'REDEEMED');
  const crossHallToken = tokens.find(t => t.hallId !== activeGateHall.id && t.status === 'ACTIVE');

  // Verification lookup matches
  const verificationMatches = tokens.filter(t => {
    const q = verifyQuery.trim().toLowerCase();
    if (!q) return t.hallId === activeGateHall.id;
    return (
      t.tokenNumber.toLowerCase().includes(q) ||
      t.studentId.toLowerCase().includes(q) ||
      t.studentName.toLowerCase().includes(q) ||
      t.academicEmail.toLowerCase().includes(q)
    );
  });

  // Used token history
  const usedTokens = tokens.filter(t => {
    if (t.status !== 'REDEEMED') return false;
    const matchesHall = historyHallFilter === 'ALL' || t.hallId === historyHallFilter;
    const q = historySearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      t.tokenNumber.toLowerCase().includes(q) ||
      t.studentId.toLowerCase().includes(q) ||
      t.studentName.toLowerCase().includes(q);
    return matchesHall && matchesQuery;
  });

  const navItems: { id: StaffTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'scanner', label: 'QR Scanner', icon: QrCode },
    { id: 'verification', label: 'Token Verification', icon: ShieldCheck },
    { id: 'history', label: 'Used Token History', icon: History }
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
                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Staff Gate Terminal</div>
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
            <div className="text-xs font-bold text-slate-900">{staff.name}</div>
            <div className="text-[11px] font-mono text-red-700 mt-0.5">{staff.staffId}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{staff.counterGate}</div>
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

      {/* Main Content */}
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
                Active Dining Gate: {activeGateHall.name} ({activeGateHall.code})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Building className="w-4 h-4 text-red-700 hidden sm:block" />
            <select
              value={activeGateHallId}
              onChange={e => {
                setActiveGateHallId(e.target.value);
                setScanResult(null);
              }}
              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/50 text-red-900 font-bold text-xs focus:outline-none"
            >
              {halls.map(h => (
                <option key={h.id} value={h.id}>
                  Gate: {h.name} ({h.code})
                </option>
              ))}
            </select>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* 1. QR SCANNER */}
          {activeTab === 'scanner' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-white rounded-2xl border border-red-100 p-6 space-y-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Optical Gate QR Scanner · {activeGateHall.code}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan or type a student token serial to validate hall access and prevent double-spending.
                  </p>
                </div>

                {/* Optical Reticle */}
                <div className="relative bg-slate-950 rounded-2xl p-6 overflow-hidden border border-red-900/40 flex flex-col items-center justify-center min-h-[210px]">
                  <div className="relative w-40 h-40 border-2 border-red-500/80 rounded-xl flex items-center justify-center">
                    <QrCode className={`w-16 h-16 text-red-400 ${isScanningAnim ? 'animate-pulse' : ''}`} />
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
                  </div>
                  <div className="text-[11px] font-mono text-red-200 mt-3 tracking-wider uppercase">
                    {isScanningAnim ? 'Verifying Cryptographic Hash...' : `Ready · ${activeGateHall.code} Gate`}
                  </div>
                </div>

                <form onSubmit={handleScanForm} className="flex gap-2">
                  <div className="relative flex-1">
                    <Scan className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter Token # (e.g. SAFH-20261112-L-084)"
                      value={inputToken}
                      onChange={e => setInputToken(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
                  >
                    Scan Token
                  </button>
                </form>

                {/* Quick Simulation Controls */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-700">Quick Gate Test Cases:</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={!activeHallToken}
                      onClick={() => {
                        if (activeHallToken) {
                          setInputToken(activeHallToken.tokenNumber);
                          triggerScan(activeHallToken.tokenNumber);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold cursor-pointer disabled:opacity-40"
                    >
                      Test Valid Token {activeHallToken ? `(${activeHallToken.tokenNumber})` : '(None)'}
                    </button>

                    <button
                      type="button"
                      disabled={!redeemedHallToken}
                      onClick={() => {
                        if (redeemedHallToken) {
                          setInputToken(redeemedHallToken.tokenNumber);
                          triggerScan(redeemedHallToken.tokenNumber);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 font-semibold cursor-pointer disabled:opacity-40"
                    >
                      Test Double-Spend Block
                    </button>

                    <button
                      type="button"
                      disabled={!crossHallToken}
                      onClick={() => {
                        if (crossHallToken) {
                          setInputToken(crossHallToken.tokenNumber);
                          triggerScan(crossHallToken.tokenNumber);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-800 font-semibold cursor-pointer disabled:opacity-40"
                    >
                      Test Wrong Hall Mismatch
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification Result Panel */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-red-100 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Gate Verification Result</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time cryptographic &amp; hall residency confirmation.
                  </p>

                  {!scanResult ? (
                    <div className="mt-10 py-14 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                      Awaiting QR token scan at {activeGateHall.name}...
                    </div>
                  ) : (
                    <div
                      className={`mt-6 p-6 rounded-2xl border space-y-4 ${
                        scanResult.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-red-50 border-red-200 text-red-950'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {scanResult.success ? (
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-7 h-7 text-red-700 shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-mono font-bold uppercase tracking-wider">
                            {scanResult.reason}
                          </div>
                          <div className="text-base font-extrabold mt-0.5">{scanResult.message}</div>
                        </div>
                      </div>

                      {scanResult.token && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-slate-400">Student</div>
                            <div className="font-bold text-slate-900">{scanResult.token.studentName}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Student ID / Room</div>
                            <div className="font-mono font-bold text-slate-900">
                              {scanResult.token.studentId} · {scanResult.token.roomNumber}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">Meal Slot &amp; Date</div>
                            <div className="font-bold text-slate-900">
                              {scanResult.token.mealSlot} · {scanResult.token.mealDate}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">Assigned Hall</div>
                            <div className="font-bold text-slate-900">{scanResult.token.hallName}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>Active Tokens Pending at {activeGateHall.code}:</span>
                  <span className="font-mono font-bold text-red-700 tabular-nums">
                    {tokens.filter(t => t.hallId === activeGateHall.id && t.status === 'ACTIVE').length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. TOKEN VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Manual Token Lookup &amp; Verification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verify token hash, student hall residency, or manually redeem an active token at {activeGateHall.name}.
                  </p>
                </div>
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search token #, student ID, or email..."
                    value={verifyQuery}
                    onChange={e => setVerifyQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-red-100 text-slate-500 font-semibold">
                      <th className="py-3 px-3">Token Serial</th>
                      <th className="py-3 px-3">Student</th>
                      <th className="py-3 px-3">Hall</th>
                      <th className="py-3 px-3">Slot &amp; Date</th>
                      <th className="py-3 px-3">SHA-256 Hash</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Gate Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {verificationMatches.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          No matching meal tokens found.
                        </td>
                      </tr>
                    ) : (
                      verificationMatches.map(tok => {
                        const hallMatches = tok.hallId === activeGateHall.id;
                        return (
                          <tr key={tok.id} className="hover:bg-red-50/30">
                            <td className="py-3 px-3 font-mono font-bold text-red-700">{tok.tokenNumber}</td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900">{tok.studentName}</div>
                              <div className="text-[11px] text-slate-500">
                                {tok.studentId} · {tok.roomNumber}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={hallMatches ? 'font-semibold text-slate-900' : 'font-semibold text-amber-700'}>
                                {tok.hallName}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono">
                              {tok.mealSlot} · {tok.mealDate}
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                              {tok.verificationHash.slice(0, 14)}...
                            </td>
                            <td className="py-3 px-3 font-mono font-bold">
                              <span className={tok.status === 'ACTIVE' ? 'text-red-700' : 'text-emerald-700'}>
                                {tok.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {tok.status === 'ACTIVE' ? (
                                hallMatches ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const res = onRedeemToken(tok.tokenNumber, activeGateHall.id, staffLabel);
                                      if (res.success) sounds.playSuccessChime();
                                      else sounds.playErrorBuzz();
                                    }}
                                    className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold cursor-pointer"
                                  >
                                    Verify &amp; Redeem
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Wrong Gate</span>
                                  </span>
                                )
                              ) : (
                                <span className="text-[11px] text-slate-400">Already Used</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. USED TOKEN HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Used Token History</h2>
                  <p className="text-xs text-slate-500">
                    Audit log of all meal tokens redeemed across hall dining gates.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Filter by student or token..."
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  <select
                    value={historyHallFilter}
                    onChange={e => setHistoryHallFilter(e.target.value)}
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
                      <th className="py-3 px-3">Token Serial</th>
                      <th className="py-3 px-3">Student</th>
                      <th className="py-3 px-3">Hall</th>
                      <th className="py-3 px-3">Meal</th>
                      <th className="py-3 px-3">Redeemed At</th>
                      <th className="py-3 px-3">Verified By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usedTokens.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400">
                          No redeemed tokens recorded yet.
                        </td>
                      </tr>
                    ) : (
                      usedTokens.map(tok => (
                        <tr key={tok.id} className="hover:bg-red-50/30">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{tok.tokenNumber}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{tok.studentName}</div>
                            <div className="text-[11px] text-slate-500">
                              {tok.studentId} · {tok.roomNumber}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-700">{tok.hallName}</td>
                          <td className="py-3 px-3 font-semibold text-red-800">{tok.mealSlot}</td>
                          <td className="py-3 px-3 font-mono text-slate-600">
                            {tok.redeemedAt ? new Date(tok.redeemedAt).toLocaleString() : tok.mealDate}
                          </td>
                          <td className="py-3 px-3 text-slate-600">{tok.redemptionStaff || 'Gate Staff'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
