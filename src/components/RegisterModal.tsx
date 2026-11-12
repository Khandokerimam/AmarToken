import React, { useState } from 'react';
import { ResidentialHall, StudentProfile, DietaryType } from '../types';
import { UserPlus, Mail, ShieldCheck, AlertCircle, Building2, User, KeyRound, CheckCircle2, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  halls: ResidentialHall[];
  onRegisterStudent: (profile: StudentProfile) => void;
  currentStudent: StudentProfile;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  halls,
  onRegisterStudent,
  currentStudent
}) => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [academicEmail, setAcademicEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedHallId, setSelectedHallId] = useState(halls[0]?.id || 'safh');
  const [roomNumber, setRoomNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [phone, setPhone] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryType>('HALAL_NON_VEG');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Validate that email is an authentic academic email (.ac.bd, .edu.bd, .edu, @mbstu.ac.bd)
  const isAcademicEmail = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    const academicPatterns = [
      /\.ac\.bd$/,
      /\.edu\.bd$/,
      /\.edu$/,
      /@mbstu\.ac\.bd$/
    ];
    return academicPatterns.some(pattern => pattern.test(clean));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = academicEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please provide your academic email address.');
      sounds.playErrorBuzz();
      return;
    }

    if (!isAcademicEmail(cleanEmail)) {
      setErrorMessage(
        'Invalid Domain: Only university academic email addresses are permitted (e.g. student@mbstu.ac.bd, *.ac.bd, *.edu.bd). Personal emails (Gmail, Yahoo) cannot register for hall dining.'
      );
      sounds.playErrorBuzz();
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your full name as printed on your university ID.');
      sounds.playErrorBuzz();
      return;
    }

    if (!studentId.trim()) {
      setErrorMessage('Please enter your official Student ID (e.g. IT-22084, CSE-21015).');
      sounds.playErrorBuzz();
      return;
    }

    if (!roomNumber.trim()) {
      setErrorMessage('Please provide your allocated hall room number.');
      sounds.playErrorBuzz();
      return;
    }

    const selectedHall = halls.find(h => h.id === selectedHallId) || halls[0];

    const newProfile: StudentProfile = {
      id: `stu-${Date.now()}`,
      studentId: studentId.trim().toUpperCase(),
      name: name.trim(),
      academicEmail: cleanEmail,
      hallId: selectedHall.id,
      hallName: selectedHall.name,
      roomNumber: `Room ${roomNumber.trim()}`,
      department: department.trim(),
      batch: 'Current Academic Year',
      walletBalance: 300, // Welcome dining subsidy
      dietaryPreference,
      phone: phone.trim() || '+880-1700-000000'
    };

    sounds.playPurchaseChime();
    setSuccessMessage(`Registration verified! Welcome, ${newProfile.name}.`);
    onRegisterStudent(newProfile);

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = academicEmail.trim().toLowerCase();
    if (!cleanEmail || !isAcademicEmail(cleanEmail)) {
      setErrorMessage('Please enter your registered academic email (.ac.bd / .edu.bd).');
      sounds.playErrorBuzz();
      return;
    }

    sounds.playPurchaseChime();
    setSuccessMessage('Logged in successfully via Academic Single Sign-On.');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-red-100 space-y-5 animate-in fade-in duration-150 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center overflow-hidden p-1 shrink-0">
              <img
                src="/assets/aistudio/university_projects_550e2ddf.png"
                alt="University Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isLoginMode ? 'Student Academic Sign-In' : 'Student Academic Registration'}
              </h3>
              <p className="text-xs text-red-700 font-medium">
                Mawlana Bhashani Science &amp; Technology University
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Email Policy Notice */}
        <div className="bg-red-50 border border-red-200 text-red-900 rounded-xl p-3.5 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Institutional Security Policy:</span> Only verified academic email addresses (<code className="font-mono text-red-800 font-semibold">@mbstu.ac.bd</code> or university <code className="font-mono text-red-800 font-semibold">*.ac.bd</code>) are authorized to register and purchase hall meal tokens.
          </div>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        {!isLoginMode ? (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Academic Email Field (Required, Primary) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Academic Email Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname.it22084@mbstu.ac.bd"
                  value={academicEmail}
                  onChange={e => {
                    setAcademicEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Must end in <strong className="text-slate-700">.ac.bd</strong> or <strong className="text-slate-700">.edu.bd</strong>
              </p>
            </div>

            {/* Name & Student ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Student Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Student ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IT-22084"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Hall Selection (1 of the 7 MBSTU Halls) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Assigned Residential Hall <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedHallId}
                onChange={e => setSelectedHallId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              >
                {halls.map(hall => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name} ({hall.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Room Number & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Allocated Room # <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 314 (Block B)"
                  value={roomNumber}
                  onChange={e => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information and Communication Technology">ICT</option>
                  <option value="Textile Engineering">Textile Engg (TE)</option>
                  <option value="Biotechnology and Genetic Engineering">BGE</option>
                  <option value="Environmental Science & Resource Management">ESRM</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Business Administration">BBA</option>
                </select>
              </div>
            </div>

            {/* Phone & Dietary Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+880 1700-000000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Dietary Preference
                </label>
                <select
                  value={dietaryPreference}
                  onChange={e => setDietaryPreference(e.target.value as DietaryType)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                >
                  <option value="HALAL_NON_VEG">Halal Non-Veg</option>
                  <option value="REGULAR">Regular</option>
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="DIABETIC_SPECIAL">Diabetic / Low-Oil</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Verify Academic Email &amp; Complete Registration</span>
            </button>
          </form>
        ) : (
          /* Sign-In Mode */
          <form onSubmit={handleQuickLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Your Academic Email Address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. tanvir.it22084@mbstu.ac.bd"
                  value={academicEmail}
                  onChange={e => setAcademicEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
            >
              Access AmarToken via Academic SSO
            </button>
          </form>
        )}

        {/* Switch Mode Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>
            {isLoginMode ? "Don't have an account yet?" : 'Already registered?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMessage(null);
            }}
            className="text-red-700 font-bold hover:underline cursor-pointer"
          >
            {isLoginMode ? 'Register with Academic Email' : 'Sign in to Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
