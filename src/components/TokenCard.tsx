import React from 'react';
import { MealToken } from '../types';
import { generateTokenMatrix, generateBarcodeBars } from '../utils/qrGenerator';
import { CheckCircle2, Building, Utensils, Ban } from 'lucide-react';

interface TokenCardProps {
  token: MealToken;
  onSimulateGateScan?: (tokenNumber: string) => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  onSimulateGateScan
}) => {
  const matrix = generateTokenMatrix(token.verificationHash, 21);
  const barcodeBars = generateBarcodeBars(token.tokenNumber);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'REDEEMED':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'EXPIRED':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl border ${token.status === 'ACTIVE' ? 'border-red-200 shadow-sm' : 'border-slate-200 opacity-90'} overflow-hidden transition-all duration-200 hover:shadow-md`}>
      {/* Top Header Strip - Deep Crimson Theme */}
      <div className="bg-[#8b1d24] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-rose-200" />
          <span className="font-bold text-xs tracking-wider uppercase">
            {token.hallName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getStatusColor(token.status)}`}>
            {token.status}
          </span>
        </div>
      </div>

      {/* Main Ticket Body */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* SVG QR Code */}
          <div className="shrink-0 bg-white p-2 rounded-xl border border-rose-100 shadow-xs flex flex-col items-center">
            <svg
              width="110"
              height="110"
              viewBox="0 0 21 21"
              className="shape-rendering-crispEdges"
              aria-label="Meal Token QR Code"
            >
              <rect width="21" height="21" fill="#ffffff" />
              {matrix.map((row, rIdx) =>
                row.map((filled, cIdx) =>
                  filled ? (
                    <rect
                      key={`${rIdx}-${cIdx}`}
                      x={cIdx}
                      y={rIdx}
                      width="1"
                      height="1"
                      fill="#8b1d24"
                    />
                  ) : null
                )
              )}
            </svg>
            <span className="text-[10px] font-mono font-bold text-[#8b1d24] mt-1">
              SCAN AT GATE
            </span>
          </div>

          {/* Token Details Reorganized Vertical Stack */}
          <div className="flex-1 w-full flex flex-col justify-between py-0.5 space-y-2.5 text-left">
            {/* Top row: Meal Slot Badge on left, Price pill on right */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-[#0f172a] uppercase tracking-wide">
                <Utensils className="w-4 h-4 text-[#8b1d24]" />
                <span>{token.mealSlot} TOKEN</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#8b1d24] font-mono font-bold text-xs border border-rose-200">
                ৳{token.price}
              </span>
            </div>

            {/* Second row: Token Serial */}
            <div className="font-mono text-xs font-semibold text-[#8b1d24] tracking-wider">
              {token.tokenNumber}
            </div>

            {/* Third row: Date */}
            <div className="text-xs text-slate-600">
              Date: <span className="font-semibold text-slate-800">{token.mealDate}</span>
            </div>

            {/* Divider line followed by Student Name and Room */}
            <div className="pt-2 border-t border-slate-100 text-xs space-y-0.5">
              <div className="text-slate-700">
                <span className="text-slate-400">Student: </span>
                <span className="font-bold text-slate-900">{token.studentName}</span>
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400">Room: </span>
                <span className="font-medium text-slate-800">{token.roomNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barcode Strip */}
        <div className="mt-4 pt-3 border-t border-dashed border-red-200">
          <div className="flex justify-center items-center h-8 bg-red-50/40 rounded px-2 overflow-hidden">
            <div className="flex items-center h-full">
              {barcodeBars.map((bar, idx) => (
                <div
                  key={idx}
                  style={{ width: `${bar.width * 1.5}px` }}
                  className={`h-full ${bar.isBlack ? 'bg-red-900' : 'bg-transparent'}`}
                />
              ))}
            </div>
          </div>
          <div className="text-center font-mono text-[10px] text-slate-400 tracking-widest mt-0.5">
            HASH: {token.verificationHash.slice(0, 16)}...
          </div>
        </div>

        {/* Non-Refundable Badge & Gate Verification Trigger */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          {token.status === 'ACTIVE' ? (
            <>
              <div className="flex items-center gap-1.5 text-xs text-[#8b1d24] font-medium">
                <Ban className="w-3.5 h-3.5 text-[#8b1d24]" />
                <span className="text-[11px]">Valid for Gate Entry</span>
              </div>
              <div className="flex items-center gap-2">
                {onSimulateGateScan && (
                  <button
                    onClick={() => onSimulateGateScan(token.tokenNumber)}
                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-[#8b1d24] border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Test Gate Scan
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full text-xs text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Redeemed at gate on {token.redeemedAt ? new Date(token.redeemedAt).toLocaleTimeString() : 'Today'}</span>
              </span>
              <span className="text-[11px] text-slate-400">{token.redemptionStaff || 'Staff Verified'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
