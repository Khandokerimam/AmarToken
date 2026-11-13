import React, { useState, useEffect } from 'react';
import { ResidentialHall, UserRole } from '../types';
import {
  X,
  Building2,
  Phone,
  Mail,
  User,
  Users,
  DollarSign,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AdminHallEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  hall: ResidentialHall;
  allHalls: ResidentialHall[];
  onSaveHall: (updatedHall: ResidentialHall) => void;
  userRole?: UserRole;
}

export const AdminHallEditorModal: React.FC<AdminHallEditorModalProps> = ({
  isOpen,
  onClose,
  hall,
  allHalls,
  onSaveHall,
  userRole = 'ADMIN'
}) => {
  const [selectedHallId, setSelectedHallId] = useState<string>(hall.id);
  const currentTargetHall = allHalls.find(h => h.id === selectedHallId) || hall;

  // Form Fields
  const [name, setName] = useState(currentTargetHall.name);
  const [code, setCode] = useState(currentTargetHall.code);
  const [provostName, setProvostName] = useState(currentTargetHall.provostName || currentTargetHall.managerName || '');
  const [provostDesignation, setProvostDesignation] = useState(currentTargetHall.provostDesignation || 'Provost & Department Professor');
  const [phone, setPhone] = useState(currentTargetHall.phone || '');
  const [email, setEmail] = useState(currentTargetHall.email || `provost.${currentTargetHall.id}@mbstu.ac.bd`);
  const [diningManagerName, setDiningManagerName] = useState(currentTargetHall.diningManagerName || 'Dining Supervisor');
  const [diningManagerPhone, setDiningManagerPhone] = useState(currentTargetHall.diningManagerPhone || '+880-1700-000000');
  const [capacity, setCapacity] = useState<number>(currentTargetHall.capacity);
  const [lunchPrice, setLunchPrice] = useState<number>(currentTargetHall.lunchPrice || 30);
  const [dinnerPrice, setDinnerPrice] = useState<number>(currentTargetHall.dinnerPrice || 30);
  const [provostNotice, setProvostNotice] = useState<string>(
    currentTargetHall.provostNotice ||
    'The residential hall dining system at MBSTU is committed to providing high-protein, hygienic, and subsidized meals to every resident student.'
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state whenever selected hall changes or modal opens
  useEffect(() => {
    setName(currentTargetHall.name);
    setCode(currentTargetHall.code);
    setProvostName(currentTargetHall.provostName || currentTargetHall.managerName || '');
    setProvostDesignation(currentTargetHall.provostDesignation || 'Provost & Department Professor');
    setPhone(currentTargetHall.phone || '');
    setEmail(currentTargetHall.email || `provost.${currentTargetHall.id}@mbstu.ac.bd`);
    setDiningManagerName(currentTargetHall.diningManagerName || 'Dining Supervisor');
    setDiningManagerPhone(currentTargetHall.diningManagerPhone || '+880-1700-000000');
    setCapacity(currentTargetHall.capacity);
    setLunchPrice(currentTargetHall.lunchPrice || 30);
    setDinnerPrice(currentTargetHall.dinnerPrice || 30);
    setProvostNotice(
      currentTargetHall.provostNotice ||
      'The residential hall dining system at MBSTU is committed to providing high-protein, hygienic, and subsidized meals to every resident student.'
    );
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [currentTargetHall, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Hall name is required.');
      sounds.playErrorBuzz();
      return;
    }

    if (!provostName.trim()) {
      setErrorMessage('Provost name is required.');
      sounds.playErrorBuzz();
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Hall office phone number is required.');
      sounds.playErrorBuzz();
      return;
    }

    // Sync updated prices to dining schedule
    const updatedSchedule = currentTargetHall.diningSchedule.map(ds => {
      if (ds.mealSlot === 'LUNCH') {
        return { ...ds, price: lunchPrice };
      }
      if (ds.mealSlot === 'DINNER') {
        return { ...ds, price: dinnerPrice };
      }
      return ds;
    });

    const updatedHall: ResidentialHall = {
      ...currentTargetHall,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      managerName: `${provostName.trim()} (Provost)`,
      provostName: provostName.trim(),
      provostDesignation: provostDesignation.trim(),
      phone: phone.trim(),
      email: email.trim(),
      diningManagerName: diningManagerName.trim(),
      diningManagerPhone: diningManagerPhone.trim(),
      capacity: Number(capacity),
      lunchPrice: Number(lunchPrice),
      dinnerPrice: Number(dinnerPrice),
      provostNotice: provostNotice.trim(),
      diningSchedule: updatedSchedule
    };

    onSaveHall(updatedHall);
    sounds.playTokenSuccess();
    setSuccessMessage(`Credentials updated successfully for ${updatedHall.name}!`);

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200/80 space-y-5 animate-in fade-in duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden p-1 shrink-0 shadow-2xs">
              <img
                src="/assets/aistudio/university_projects_550e2ddf.png"
                alt="MBSTU University Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Hall Administration &amp; Credentials Editor
                </h3>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold rounded uppercase">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-[#8b1d24] font-medium leading-tight mt-0.5">
                Official Residential Hall Dining &amp; Provost Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hall Selection Dropdown (Switch Hall if Super Admin) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Active Hall Being Managed:
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedHallId}
              onChange={e => setSelectedHallId(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all cursor-pointer"
            >
              {allHalls.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.code}) · {h.gender} Hall
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 text-xs p-3.5 rounded-xl flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-3.5 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Editor Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Hall Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hall Official Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
              />
            </div>
          </div>

          {/* Provost Name & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hall Provost Full Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Dr. Tariqul Islam"
                  value={provostName}
                  onChange={e => setProvostName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Provost Academic Designation
              </label>
              <input
                type="text"
                placeholder="e.g. Provost & Professor, Dept. of CSE"
                value={provostDesignation}
                onChange={e => setProvostDesignation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
              />
            </div>
          </div>

          {/* Hall Office Phone & Official Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Provost / Office Phone <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Support Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Dining Manager & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dining Manager Name
              </label>
              <input
                type="text"
                value={diningManagerName}
                onChange={e => setDiningManagerName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dining Manager Phone
              </label>
              <input
                type="tel"
                value={diningManagerPhone}
                onChange={e => setDiningManagerPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Seat Capacity
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="100"
                  max="3000"
                  value={capacity}
                  onChange={e => setCapacity(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Meal Rates: Lunch (৳) and Dinner (৳) */}
          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-2xl">
            <span className="block text-xs font-bold text-[#8b1d24] mb-2 uppercase tracking-wide">
              Subsidized Dining Rates (BDT)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lunch Rate (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="150"
                    value={lunchPrice}
                    onChange={e => setLunchPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dinner Rate (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="150"
                    value={dinnerPrice}
                    onChange={e => setDinnerPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Provost Desk Official Notice / Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Provost Desk Notice / Statement
            </label>
            <textarea
              rows={3}
              value={provostNotice}
              onChange={e => setProvostNotice(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white resize-none"
              placeholder="Enter official provost notice to boarders..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8b1d24] hover:bg-[#70161c] text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Persist Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

