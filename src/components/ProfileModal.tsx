import React, { useState } from 'react';
import {
  StudentProfile,
  ResidentialHall,
  DietaryType
} from '../types';
import {
  X,
  User,
  Mail,
  Building2,
  Home,
  GraduationCap,
  Phone,
  UtensilsCrossed,
  Wallet,
  LogOut,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Hash
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  halls: ResidentialHall[];
  onUpdateProfile: (updatedProfile: StudentProfile) => void;
  onLogout: () => void;
  onOpenWalletModal: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  halls,
  onUpdateProfile,
  onLogout,
  onOpenWalletModal
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [name, setName] = useState(student.name);
  const [roomNumber, setRoomNumber] = useState(student.roomNumber);
  const [department, setDepartment] = useState(student.department);
  const [batch, setBatch] = useState(student.batch);
  const [phone, setPhone] = useState(student.phone);
  const [hallId, setHallId] = useState(student.hallId);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryType>(student.dietaryPreference);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Reset form to current student state whenever modal opens or cancel is clicked
  const handleCancelEdit = () => {
    setName(student.name);
    setRoomNumber(student.roomNumber);
    setDepartment(student.department);
    setBatch(student.batch);
    setPhone(student.phone);
    setHallId(student.hallId);
    setDietaryPreference(student.dietaryPreference);
    setErrorMsg(null);
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }
    if (!roomNumber.trim()) {
      setErrorMsg('Room number is required.');
      return;
    }
    if (!department.trim()) {
      setErrorMsg('Department is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Contact phone number is required.');
      return;
    }

    const matchedHall = halls.find(h => h.id === hallId);
    const updated: StudentProfile = {
      ...student,
      name: name.trim(),
      roomNumber: roomNumber.trim(),
      department: department.trim(),
      batch: batch.trim(),
      phone: phone.trim(),
      hallId,
      hallName: matchedHall ? matchedHall.name : student.hallName,
      dietaryPreference
    };

    onUpdateProfile(updated);
    setSaveSuccess(true);
    setIsEditing(false);
    setErrorMsg(null);
    sounds.playTokenSuccess();

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleConfirmLogout = () => {
    sounds.playTabSwitch();
    setShowLogoutConfirm(false);
    onClose();
    onLogout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Institutional Theme */}
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-6 py-5 text-white flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white p-1 border border-red-300 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/university_projects_550e2ddf.png"
                alt="MBSTU Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Student Profile</h3>
                <span className="px-2 py-0.5 bg-red-900/60 border border-red-300/30 rounded text-[10px] font-mono tracking-wider uppercase text-red-100">
                  MBSTU Boarder ID
                </span>
              </div>
              <p className="text-xs text-red-100/90 font-medium">
                AmarToken · Mawlana Bhashani Science &amp; Technology University
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Profile details successfully updated and synchronized!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Identification Banner */}
          <div className="bg-gradient-to-br from-red-50/70 via-white to-slate-50 border border-red-100 rounded-xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-red-700 text-white font-black text-xl flex items-center justify-center shadow-sm shrink-0 border-2 border-white ring-2 ring-red-200">
                {student.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  {student.name}
                  <span title="Verified MBSTU Boarder">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </span>
                </h4>
                <p className="text-xs text-slate-600 font-mono flex items-center gap-1.5 mt-0.5">
                  <span>ID: {student.studentId}</span>
                  <span>·</span>
                  <span className="text-red-700 font-medium">{student.hallName}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {student.roomNumber} · {student.batch}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-red-100">
              <span className="text-[11px] text-slate-500">Dining Wallet</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenWalletModal();
                }}
                className="flex items-center gap-1 text-sm font-bold text-red-700 hover:text-red-800 transition-colors font-mono cursor-pointer"
                title="Click to recharge wallet"
              >
                <Wallet className="w-3.5 h-3.5" />
                ৳{student.walletBalance.toFixed(2)}
              </button>
            </div>
          </div>

          {/* Form View / Edit View */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Editing Student Information
                </span>
                <span className="text-xs text-slate-400">
                  Academic Email &amp; ID are locked
                </span>
              </div>

              {/* Locked Academic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-red-600" /> Academic Email (Verified)
                  </span>
                  <div className="font-mono text-slate-800 font-medium mt-0.5 truncate">
                    {student.academicEmail}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-red-600" /> Student Roll / ID
                  </span>
                  <div className="font-mono text-slate-800 font-medium mt-0.5">
                    {student.studentId}
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                      placeholder="e.g. Tanvir Ahmed"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Residential Hall <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <select
                        value={hallId}
                        onChange={e => setHallId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-slate-800"
                      >
                        {halls.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Allocated Room / Block <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={roomNumber}
                        onChange={e => setRoomNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        placeholder="e.g. Room 314 (Block B)"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        placeholder="e.g. ICT, CSE, EEE, Textile"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Session / Batch
                    </label>
                    <input
                      type="text"
                      value={batch}
                      onChange={e => setBatch(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                      placeholder="e.g. 2021-22"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        placeholder="+880-1700-000000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dietary Preference
                    </label>
                    <div className="relative">
                      <UtensilsCrossed className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <select
                        value={dietaryPreference}
                        onChange={e => setDietaryPreference(e.target.value as DietaryType)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-slate-800"
                      >
                        <option value="HALAL_NON_VEG">Halal Non-Veg (Standard)</option>
                        <option value="REGULAR">Regular Meal</option>
                        <option value="VEGETARIAN">Vegetarian Special</option>
                        <option value="DIABETIC_SPECIAL">Diabetic / Low Spice</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* Read-Only Details Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Institutional Record
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-red-700" />
                    Residential Hall
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {student.hallName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    MBSTU Campus Accommodation
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-red-700" />
                    Allocated Room
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {student.roomNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Boarder Seat Registered
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-red-700" />
                    Department &amp; Batch
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {student.department}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Session: {student.batch}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-red-700" />
                    Academic Email
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-900 mt-1 truncate">
                    {student.academicEmail}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Subsidized Dining Verified
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-red-700" />
                    Contact Phone
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">
                    {student.phone}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Registered Mobile Hotline
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-red-700" />
                    Dietary Preference
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-1">
                    {student.dietaryPreference.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Assigned Dining Kitchen
                  </div>
                </div>
              </div>

              {/* Policy note */}
              <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl text-slate-600 text-[11px] leading-relaxed">
                <span className="font-bold text-red-800">Dining Rules Reminder:</span> Tokens purchased for Lunch (closing 10:30 AM) and Dinner (closing 5:00 PM) are strictly non-refundable and tied to your residential boarder credentials.
              </div>
            </div>
          )}

          {/* Logout Section */}
          <div className="pt-4 border-t border-slate-200">
            {showLogoutConfirm ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2.5 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Log out of AmarToken?</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      You will be logged out of your student session and redirected to the university hall portal homepage.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Stay Logged In
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Confirm Logout &amp; Go to Homepage
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Session active as <span className="font-semibold text-slate-700">{student.name}</span>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
