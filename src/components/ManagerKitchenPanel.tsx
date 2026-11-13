import React, { useState, useEffect } from 'react';
import { ResidentialHall, MealToken, KitchenExpenseItem, UserRole } from '../types';
import { DEFAULT_KITCHEN_EXPENSES } from '../data/hallsData';
import {
  ChefHat,
  Users,
  Download,
  Plus,
  Trash2,
  RotateCcw,
  Building2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ManagerKitchenPanelProps {
  hall: ResidentialHall;
  tokens: MealToken[];
  userRole?: UserRole;
  onOpenHallEditor?: () => void;
}

export const ManagerKitchenPanel: React.FC<ManagerKitchenPanelProps> = ({
  hall,
  tokens,
  userRole = 'ADMIN',
  onOpenHallEditor
}) => {
  const [customHeadcount, setCustomHeadcount] = useState<number>(380);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Storage key per residential hall
  const STORAGE_KEY = `amartoken_kitchen_items_${hall.id}`;

  const [items, setItems] = useState<KitchenExpenseItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_KITCHEN_EXPENSES;
  });

  // Re-sync items when hall changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`amartoken_kitchen_items_${hall.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          return;
        }
      }
    } catch {}
    setItems(DEFAULT_KITCHEN_EXPENSES);
  }, [hall.id]);

  // Persist items on update
  const saveItems = (updated: KitchenExpenseItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem(`amartoken_kitchen_items_${hall.id}`, JSON.stringify(updated));
    } catch {}
  };

  // Live count from tokens for this hall
  const activeHallTokens = tokens.filter(t => t.hallId === hall.id && t.status === 'ACTIVE');
  const lunchCount = activeHallTokens.filter(t => t.mealSlot === 'LUNCH').length;
  const dinnerCount = activeHallTokens.filter(t => t.mealSlot === 'DINNER').length;

  const currentCount = customHeadcount;
  const isAdmin = userRole === 'ADMIN';

  // Calculate individual row total and cost
  const getRowDetails = (item: KitchenExpenseItem) => {
    const totalQuantity = item.isManualTotal && item.totalQuantity !== undefined
      ? item.totalQuantity
      : Number((item.perStudentQuantity * currentCount).toFixed(2));
    const rowCost = Math.round(totalQuantity * item.unitPrice);
    return { totalQuantity, rowCost };
  };

  // Total Estimated Meal Cost
  const totalMealCost = items.reduce((acc, item) => {
    const { rowCost } = getRowDetails(item);
    return acc + rowCost;
  }, 0);

  // Actual Cost Per Plate
  const actualCostPerPlate = currentCount > 0 ? (totalMealCost / currentCount).toFixed(2) : '0.00';

  // Token Revenue at hall rate (default ৳30)
  const tokenMealPrice = hall.lunchPrice || 30;
  const totalTokenRevenue = currentCount * tokenMealPrice;
  const budgetBalance = totalTokenRevenue - totalMealCost;
  const isSurplus = budgetBalance >= 0;

  // Handlers for Admin row modifications
  const handleItemFieldChange = (id: string, field: keyof KitchenExpenseItem, value: any) => {
    if (!isAdmin) return;
    const updated = items.map(item => {
      if (item.id !== id) return item;

      if (field === 'perStudentQuantity') {
        const num = Math.max(0, parseFloat(value) || 0);
        return {
          ...item,
          perStudentQuantity: num,
          isManualTotal: false,
          totalQuantity: Number((num * currentCount).toFixed(2))
        };
      }

      if (field === 'totalQuantity') {
        const num = Math.max(0, parseFloat(value) || 0);
        const perStudent = currentCount > 0 ? Number((num / currentCount).toFixed(3)) : 0;
        return {
          ...item,
          totalQuantity: num,
          isManualTotal: true,
          perStudentQuantity: perStudent
        };
      }

      if (field === 'unitPrice') {
        return {
          ...item,
          unitPrice: Math.max(0, parseFloat(value) || 0)
        };
      }

      return {
        ...item,
        [field]: value
      };
    });

    saveItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    if (!isAdmin) return;
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
    sounds.playTabSwitch();
  };

  const handleAddNewItem = () => {
    if (!isAdmin) return;
    const newItem: KitchenExpenseItem = {
      id: `exp-${Date.now()}`,
      name: 'New Kitchen Ingredient',
      category: 'Produce',
      perStudentQuantity: 0.05,
      unit: 'kg',
      unitPrice: 50
    };
    const updated = [...items, newItem];
    saveItems(updated);
    sounds.playPurchaseChime();
    setSaveSuccessMsg('New ingredient added to kitchen template.');
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleResetToDefault = () => {
    if (!isAdmin) return;
    if (window.confirm('Reset all groceries and costs to the default MBSTU standard kitchen template?')) {
      saveItems(DEFAULT_KITCHEN_EXPENSES);
      sounds.playTokenSuccess();
      setSaveSuccessMsg('Kitchen template reset to MBSTU standard.');
      setTimeout(() => setSaveSuccessMsg(null), 2500);
    }
  };

  // CSV Export
  const downloadRequisitionCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Ingredient,Category,Per Student,Unit,Total Quantity,Unit Price (BDT),Total Cost (BDT)',
        ...items.map(r => {
          const { totalQuantity, rowCost } = getRowDetails(r);
          return `"${r.name}","${r.category}",${r.perStudentQuantity},"${r.unit}",${totalQuantity},${r.unitPrice},${rowCost}`;
        }),
        `"", "","","","Total Meal Budget:","",${totalMealCost}`,
        `"", "","","","Token Revenue (${currentCount} x ৳${tokenMealPrice}):","",${totalTokenRevenue}`,
        `"", "","","","Balance (Surplus/Deficit):","",${budgetBalance}`
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${hall.code}_Kitchen_Budget_${currentCount}_Portions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CATEGORIES = [
    'Grains',
    'Protein',
    'Pulses',
    'Oils',
    'Aromatics',
    'Spices',
    'Produce',
    'Fuel/Misc'
  ];

  const UNITS = ['kg', 'g', 'Liters', 'ml', 'pcs', 'packet'];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Role Pill & Action Controls */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8b1d24] uppercase tracking-wider">
            <ChefHat className="w-4 h-4" />
            <span>Kitchen Management &amp; Meal Cost Calculator</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
              isAdmin
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-blue-100 text-blue-900 border-blue-300'
            }`}>
              {isAdmin ? 'Admin: Full Edit Mode' : 'Staff: Scaler Mode'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {hall.name} ({hall.code}) Dining Requisition
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Live dynamic cost calculator, headcount scaling, and ingredient budgeting for daily MBSTU hall dining.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isAdmin && onOpenHallEditor && (
            <button
              onClick={onOpenHallEditor}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="Edit Hall Credentials, Provost Details & Meal Rates"
            >
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>Edit Hall Credentials</span>
            </button>
          )}

          <button
            onClick={downloadRequisitionCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#8b1d24] hover:bg-[#70161c] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Requisition CSV</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-3.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* 4-Card Live Financial & Budget Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Estimated Meal Cost */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-slate-600">Total Meal Cost</span>
            <span className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center text-[#8b1d24] font-bold text-xs">
              ৳
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            ৳{totalMealCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Sum of all requisition items
          </div>
        </div>

        {/* Card 2: Target Headcount */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-slate-600">Target Headcount</span>
            <Users className="w-4 h-4 text-[#8b1d24]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {currentCount} <span className="text-xs font-normal text-slate-400">portions</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
            <span>Lunch: <strong>{Math.max(lunchCount, 120)}</strong></span>
            <span>·</span>
            <span>Dinner: <strong>{Math.max(dinnerCount, 95)}</strong></span>
          </div>
        </div>

        {/* Card 3: Actual Cost Per Plate */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-slate-600">Actual Cost / Plate</span>
            <span className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 font-bold text-xs">
              ৳
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            ৳{actualCostPerPlate} <span className="text-xs font-normal text-slate-400">/ meal</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Student Price: <strong>৳{tokenMealPrice}</strong> (Subsidized)
          </div>
        </div>

        {/* Card 4: Hall Token Revenue vs Budget Balance */}
        <div className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition-colors ${
          isSurplus
            ? 'bg-emerald-50/60 border-emerald-200'
            : 'bg-rose-50/60 border-rose-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-slate-700">
              {isSurplus ? 'Budget Surplus' : 'University Subsidy'}
            </span>
            {isSurplus ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-[#8b1d24]" />
            )}
          </div>
          <div className={`text-2xl font-extrabold font-mono ${
            isSurplus ? 'text-emerald-700' : 'text-[#8b1d24]'
          }`}>
            {isSurplus ? `+৳${budgetBalance.toLocaleString()}` : `-৳${Math.abs(budgetBalance).toLocaleString()}`}
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            Revenue: <strong>৳{totalTokenRevenue.toLocaleString()}</strong> ({currentCount} × ৳{tokenMealPrice})
          </div>
        </div>
      </div>

      {/* Headcount Scaler Bar & Requisition Table */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-xs space-y-5">
        
        {/* Scaler Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Custom Headcount Scaler:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="3000"
                step="10"
                value={customHeadcount}
                onChange={e => setCustomHeadcount(Math.max(1, Number(e.target.value)))}
                className="w-24 px-3 py-1.5 text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#8b1d24] focus:ring-1 focus:ring-[#8b1d24]"
              />
              <span className="text-xs text-slate-500 font-medium">portions</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Presets:</span>
            {[150, 300, 500, 800].map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => setCustomHeadcount(cnt)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                  customHeadcount === cnt
                    ? 'bg-[#8b1d24] text-white border-[#8b1d24]'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Requisition Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-rose-100 text-slate-500 font-medium bg-slate-50/50">
                <th className="py-2.5 px-3">Item / Ingredient</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Per-Student Standard</th>
                <th className="py-2.5 px-3 text-right">Unit</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-800">
                  Total Quantity ({currentCount} meals)
                </th>
                <th className="py-2.5 px-3 text-right">Unit Price (৳)</th>
                <th className="py-2.5 px-3 text-right font-bold text-[#8b1d24]">Row Total (৳)</th>
                {isAdmin && <th className="py-2.5 px-3 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => {
                const { totalQuantity, rowCost } = getRowDetails(item);

                return (
                  <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                    
                    {/* Item Name */}
                    <td className="py-2.5 px-3">
                      {isAdmin ? (
                        <input
                          type="text"
                          value={item.name}
                          onChange={e => handleItemFieldChange(item.id, 'name', e.target.value)}
                          className="w-full min-w-[160px] px-2 py-1 text-xs font-semibold text-slate-900 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#8b1d24] rounded-lg focus:outline-none transition-colors"
                        />
                      ) : (
                        <span className="font-semibold text-slate-900">{item.name}</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-3">
                      {isAdmin ? (
                        <select
                          value={item.category}
                          onChange={e => handleItemFieldChange(item.id, 'category', e.target.value)}
                          className="px-2 py-1 text-[11px] text-slate-600 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#8b1d24] rounded-lg focus:outline-none cursor-pointer"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-500">{item.category}</span>
                      )}
                    </td>

                    {/* Per-Student Standard Quantity */}
                    <td className="py-2.5 px-3 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            step="0.005"
                            min="0"
                            value={item.perStudentQuantity}
                            onChange={e => handleItemFieldChange(item.id, 'perStudentQuantity', e.target.value)}
                            className="w-16 px-1.5 py-1 text-xs font-mono text-right text-slate-700 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#8b1d24] rounded-lg focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400">{item.unit}</span>
                        </div>
                      ) : (
                        <span className="font-mono text-slate-600">
                          {item.perStudentQuantity} {item.unit}
                        </span>
                      )}
                    </td>

                    {/* Unit Selector */}
                    <td className="py-2.5 px-3 text-right">
                      {isAdmin ? (
                        <select
                          value={item.unit}
                          onChange={e => handleItemFieldChange(item.id, 'unit', e.target.value)}
                          className="px-1.5 py-1 text-[11px] font-mono text-slate-600 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#8b1d24] rounded-lg focus:outline-none cursor-pointer"
                        >
                          {UNITS.map(u => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-mono text-slate-500">{item.unit}</span>
                      )}
                    </td>

                    {/* Total Quantity Needed (Editable with Bidirectional Sync) */}
                    <td className="py-2.5 px-3 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={totalQuantity}
                            onChange={e => handleItemFieldChange(item.id, 'totalQuantity', e.target.value)}
                            className="w-20 px-1.5 py-1 text-xs font-mono font-bold text-right text-[#8b1d24] bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#8b1d24] rounded-lg focus:outline-none"
                            title="Edit total directly (will auto-adjust per-student ratio)"
                          />
                          <span className="text-[10px] text-slate-400">{item.unit}</span>
                        </div>
                      ) : (
                        <span className="font-mono font-bold text-[#8b1d24] text-sm tabular-nums">
                          {totalQuantity} {item.unit}
                        </span>
                      )}
                    </td>

                    {/* Unit Price (৳) */}
                    <td className="py-2.5 px-3 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-0.5">
                          <span className="text-[10px] text-slate-400">৳</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.unitPrice}
                            onChange={e => handleItemFieldChange(item.id, 'unitPrice', e.target.value)}
                            className="w-16 px-1.5 py-1 text-xs font-mono text-right text-slate-800 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#8b1d24] rounded-lg focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-slate-700">৳{item.unitPrice}</span>
                      )}
                    </td>

                    {/* Row Total Cost */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ৳{rowCost.toLocaleString()}
                    </td>

                    {/* Delete Action for Admin */}
                    {isAdmin && (
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete this requisition item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900">
                <td colSpan={isAdmin ? 6 : 5} className="py-3 px-3 text-right text-xs uppercase tracking-wider">
                  Grand Total Meal Requisition Budget:
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm text-[#8b1d24]">
                  ৳{totalMealCost.toLocaleString()}
                </td>
                {isAdmin && <td />}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Admin Action Bar (Add Item & Reset to Default) */}
        {isAdmin && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAddNewItem}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-[#8b1d24] border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-[#8b1d24]" />
              <span>+ Add Ingredient / Expense Item</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset all prices and items to MBSTU standard template"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset to Default Standard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
