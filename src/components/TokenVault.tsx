import React, { useState } from 'react';
import { MealToken, TokenStatus } from '../types';
import { TokenCard } from './TokenCard';
import { QrCode, Search, Printer, Utensils, Ban } from 'lucide-react';

interface TokenVaultProps {
  tokens: MealToken[];
  onSimulateGateScan: (tokenNumber: string) => void;
  onNavigateToStore: () => void;
}

export const TokenVault: React.FC<TokenVaultProps> = ({
  tokens,
  onSimulateGateScan,
  onNavigateToStore
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | TokenStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(t => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch =
      t.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mealSlot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.menuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mealDate.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const activeCount = tokens.filter(t => t.status === 'ACTIVE').length;
  const redeemedCount = tokens.filter(t => t.status === 'REDEEMED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-red-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
            <QrCode className="w-4 h-4" />
            <span>Digital Token Passbook</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            My Digital Meal Tokens
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Present your token QR code to the dining gate scanner. Note: All meal tokens are final and non-refundable.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print All Tokens</span>
          </button>
          <button
            onClick={onNavigateToStore}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Utensils className="w-4 h-4" />
            <span>Buy Meal Tokens</span>
          </button>
        </div>
      </div>

      {/* Strict Policy Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Ban className="w-4 h-4 text-red-700 shrink-0" />
          <span><strong>Hall Policy Reminder:</strong> No cancellations will allow refunds once meal tokens are booked.</span>
        </div>
        <span className="text-[11px] font-mono text-red-800 shrink-0">MBSTU Dining OS</span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-red-100 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-red-50/50 p-1 rounded-lg text-xs overflow-x-auto">
          {(['ALL', 'ACTIVE', 'REDEEMED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-red-800'
              }`}
            >
              {status === 'ALL'
                ? `All (${tokens.length})`
                : status === 'ACTIVE'
                ? `Active Tokens (${activeCount})`
                : `Redeemed (${redeemedCount})`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search token #, meal slot..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Tokens Grid */}
      {filteredTokens.length === 0 ? (
        <div className="bg-white rounded-2xl border border-red-100 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="text-base font-bold text-slate-800">No Meal Tokens Found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterStatus !== 'ALL'
              ? `You don't have any tokens matching "${filterStatus}".`
              : "You haven't purchased any meal tokens yet for today."}
          </p>
          <button
            onClick={onNavigateToStore}
            className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Visit Meal Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTokens.map(token => (
            <TokenCard
              key={token.id}
              token={token}
              onSimulateGateScan={onSimulateGateScan}
            />
          ))}
        </div>
      )}
    </div>
  );
};
