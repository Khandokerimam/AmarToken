import React, { useState } from 'react';
import { ResidentialHall, MealToken } from '../types';
import { ChefHat, Users, Download } from 'lucide-react';

interface ManagerKitchenPanelProps {
  hall: ResidentialHall;
  tokens: MealToken[];
}

export const ManagerKitchenPanel: React.FC<ManagerKitchenPanelProps> = ({
  hall,
  tokens
}) => {
  const [selectedSlot, setSelectedSlot] = useState<'LUNCH' | 'DINNER'>('LUNCH');
  const [customHeadcount, setCustomHeadcount] = useState<number>(380);
  const [useLiveCount, setUseLiveCount] = useState<boolean>(true);

  // Calculate live count from tokens for this hall
  const activeHallTokens = tokens.filter(t => t.hallId === hall.id && t.status === 'ACTIVE');
  const lunchCount = activeHallTokens.filter(t => t.mealSlot === 'LUNCH').length;
  const dinnerCount = activeHallTokens.filter(t => t.mealSlot === 'DINNER').length;

  const currentCount = useLiveCount
    ? selectedSlot === 'LUNCH'
      ? Math.max(lunchCount, 120)
      : Math.max(dinnerCount, 95)
    : customHeadcount;

  // Portion formulas per student for Lunch and Dinner
  const getRequisitions = (slot: 'LUNCH' | 'DINNER', count: number) => {
    if (slot === 'LUNCH') {
      return [
        { name: 'Polao / Fine Miniket Rice', category: 'Grains', perStudent: '160g', total: (count * 0.16).toFixed(1), unit: 'kg' },
        { name: 'Deshi Farm Chicken (Cleaned)', category: 'Poultry', perStudent: '220g', total: (count * 0.22).toFixed(1), unit: 'kg' },
        { name: 'Red Musur Lentils (Dal)', category: 'Pulses', perStudent: '35g', total: (count * 0.035).toFixed(1), unit: 'kg' },
        { name: 'Soybean & Mustard Cooking Oil', category: 'Oils', perStudent: '40ml', total: (count * 0.04).toFixed(1), unit: 'Liters' },
        { name: 'Deshi Onions (Peyaj)', category: 'Aromatics', perStudent: '55g', total: (count * 0.055).toFixed(1), unit: 'kg' },
        { name: 'Ginger & Garlic Paste (Ada-Roshun)', category: 'Aromatics', perStudent: '25g', total: (count * 0.025).toFixed(1), unit: 'kg' },
        { name: 'Potatoes & Seasonal Vegetables', category: 'Produce', perStudent: '80g', total: (count * 0.08).toFixed(1), unit: 'kg' },
        { name: 'Cucumbers, Green Chili & Lemons', category: 'Salad', perStudent: '30g', total: (count * 0.03).toFixed(1), unit: 'kg' }
      ];
    } else {
      return [
        { name: 'Standard Atash Rice', category: 'Grains', perStudent: '170g', total: (count * 0.17).toFixed(1), unit: 'kg' },
        { name: 'Fresh River Fish (Rui/Katla) / Beef', category: 'Protein', perStudent: '190g', total: (count * 0.19).toFixed(1), unit: 'kg' },
        { name: 'Musur Dal', category: 'Pulses', perStudent: '35g', total: (count * 0.035).toFixed(1), unit: 'kg' },
        { name: 'Eggplant / Begun (for Bharta)', category: 'Produce', perStudent: '75g', total: (count * 0.075).toFixed(1), unit: 'kg' },
        { name: 'Pure Mustard & Soybean Oil', category: 'Oils', perStudent: '35ml', total: (count * 0.035).toFixed(1), unit: 'Liters' },
        { name: 'Spices, Turmeric & Red Chili Powder', category: 'Spices', perStudent: '15g', total: (count * 0.015).toFixed(1), unit: 'kg' }
      ];
    }
  };

  const requisitions = getRequisitions(selectedSlot, currentCount);

  const downloadRequisitionCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Ingredient,Category,Per Student,Total Needed,Unit',
        ...requisitions.map(r => `"${r.name}","${r.category}","${r.perStudent}",${r.total},"${r.unit}"`)
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${hall.code}_Kitchen_Requisition_${selectedSlot}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
            <ChefHat className="w-4 h-4" />
            <span>Kitchen &amp; Dining Hall Management · MBSTU</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            {hall.name} Kitchen Requisition Planner
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Automatic raw groceries computation from student tokens for daily Lunch &amp; Dinner.
          </p>
        </div>

        <button
          onClick={downloadRequisitionCSV}
          className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Requisition CSV</span>
        </button>
      </div>

      {/* Headcount Stat Cards: Only Lunch & Dinner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-red-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Lunch Headcount (Final)</span>
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {Math.max(lunchCount, 120)} <span className="text-xs font-normal text-slate-400">tokens</span>
          </div>
          <div className="text-[11px] text-red-700 font-medium mt-1">
            Cutoff: 10:30 AM (Non-refundable)
          </div>
        </div>

        <div className="bg-white rounded-xl border border-red-100 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Dinner Headcount</span>
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {Math.max(dinnerCount, 95)} <span className="text-xs font-normal text-slate-400">tokens</span>
          </div>
          <div className="text-[11px] text-red-700 font-medium mt-1">
            Cutoff: 5:00 PM (Non-refundable)
          </div>
        </div>
      </div>

      {/* Requisition Table & Calculator Control */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-50">
          {/* Meal Slot Selector: Lunch and Dinner only */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Meal Slot:</span>
            <div className="flex items-center bg-red-50/60 p-1 rounded-xl border border-red-100">
              {(['LUNCH', 'DINNER'] as const).map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedSlot === slot
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-red-800'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Mode: Live Token Count vs Custom Scale */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setUseLiveCount(true)}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer ${
                  useLiveCount
                    ? 'border-red-700 bg-red-50 text-red-800 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Live Token Bookings ({currentCount})
              </button>
              <button
                onClick={() => setUseLiveCount(false)}
                className={`px-3 py-1.5 rounded-lg border cursor-pointer ${
                  !useLiveCount
                    ? 'border-red-700 bg-red-50 text-red-800 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Custom Scaler
              </button>
            </div>

            {!useLiveCount && (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="50"
                  max="1500"
                  step="25"
                  value={customHeadcount}
                  onChange={e => setCustomHeadcount(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                />
                <span className="text-xs text-slate-500">students</span>
              </div>
            )}
          </div>
        </div>

        {/* Requisition Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-red-100 text-slate-500 font-medium">
                <th className="py-2.5 px-3">Raw Ingredient</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Per-Student Standard</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-800">
                  Total Requisition ({currentCount} meals)
                </th>
                <th className="py-2.5 px-3 text-left">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requisitions.map((req, idx) => (
                <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{req.name}</td>
                  <td className="py-3 px-3 text-slate-500">{req.category}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">{req.perStudent}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-red-700 text-sm tabular-nums">
                    {req.total}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{req.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
