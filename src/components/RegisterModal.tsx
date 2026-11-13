import React, { useState, useEffect, useRef } from 'react';
import { ResidentialHall, StudentProfile, UserRole } from '../types';
import {
  UserPlus,
  Mail,
  ShieldCheck,
  AlertCircle,
  Building2,
  User,
  CheckCircle2,
  X,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Phone,
  UploadCloud,
  FileCheck,
  Camera,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  halls: ResidentialHall[];
  onRegisterStudent: (profile: StudentProfile) => void;
  onLoginStudent?: (profile: StudentProfile) => void;
  currentStudent: StudentProfile;
  initialMode?: 'login' | 'register';
  registeredAccounts?: StudentProfile[];
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  halls,
  onRegisterStudent,
  onLoginStudent,
  currentStudent,
  initialMode = 'register',
  registeredAccounts = []
}) => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(initialMode === 'login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  // Form Fields
  const [academicEmail, setAcademicEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [selectedHallId, setSelectedHallId] = useState(
    halls.find(h => h.gender === 'Male')?.id || halls[0]?.id || 'safh'
  );
  const [roomNumber, setRoomNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [phone, setPhone] = useState('');

  // ID Card Upload state for Staff & Admin
  const [idCardPhoto, setIdCardPhoto] = useState<string | null>(null);
  const [idCardFileName, setIdCardFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Recent MBSTU Academic Emails for Autocomplete & Suggestions
  const RECENT_EMAILS_KEY = 'amartoken_recent_emails';
  const [recentEmails, setRecentEmails] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_EMAILS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['tanvir.it22084@mbstu.ac.bd', 'staff.szrh@mbstu.ac.bd', 'admin.szrh@mbstu.ac.bd'];
  });

  const saveRecentEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.endsWith('@mbstu.ac.bd')) return;
    setRecentEmails(prev => {
      const updated = [clean, ...prev.filter(e => e.toLowerCase() !== clean)].slice(0, 5);
      try {
        localStorage.setItem(RECENT_EMAILS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Filter halls based on selected gender
  const availableHalls = halls.filter(h => {
    if (gender === 'Male') return h.gender === 'Male';
    if (gender === 'Female') return h.gender === 'Female';
    return true;
  });

  const handleGenderChange = (newGender: 'Male' | 'Female' | 'Other') => {
    setGender(newGender);
    const matching = halls.filter(h => {
      if (newGender === 'Male') return h.gender === 'Male';
      if (newGender === 'Female') return h.gender === 'Female';
      return true;
    });
    if (matching.length > 0 && !matching.some(h => h.id === selectedHallId)) {
      setSelectedHallId(matching[0].id);
    }
  };

  // Sync mode whenever initialMode or modal opens
  useEffect(() => {
    setIsLoginMode(initialMode === 'login');
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Strict MBSTU Academic Email Validation: must end in @mbstu.ac.bd
  const isMbstuEmail = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    return clean.endsWith('@mbstu.ac.bd') && clean.length > '@mbstu.ac.bd'.length;
  };

  // Handle ID card image file selection
  const handleIdCardFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WEBP).');
      sounds.playErrorBuzz();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller file.');
      sounds.playErrorBuzz();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setIdCardPhoto(reader.result as string);
      setIdCardFileName(file.name);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input dialog
  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Quick fill helper for demo accounts (CRITICAL: never auto-populates password)
  const handleSelectRecentEmail = (em: string) => {
    setAcademicEmail(em);
    setPassword(''); // Strictly clear password so user must type it
    setErrorMessage(null);
  };

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = academicEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please provide your MBSTU institutional email address.');
      sounds.playErrorBuzz();
      return;
    }

    if (!isMbstuEmail(cleanEmail)) {
      setErrorMessage(
        'Invalid Domain: Only verified MBSTU institutional email addresses ending in @mbstu.ac.bd are authorized.'
      );
      sounds.playErrorBuzz();
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your full official name.');
      sounds.playErrorBuzz();
      return;
    }

    // Role-specific validation
    if (selectedRole === 'STUDENT') {
      if (!studentId.trim()) {
        setErrorMessage('Please enter your official Student ID (e.g. IT-22084, CSE-21015).');
        sounds.playErrorBuzz();
        return;
      }
    } else {
      // Staff & Admin validation: phone & ID card photo
      if (!phone.trim()) {
        setErrorMessage('Contact phone number is mandatory for Staff and Admin verification.');
        sounds.playErrorBuzz();
        return;
      }
      if (!idCardPhoto) {
        setErrorMessage('Official University ID Card proof is mandatory for Hall Staff & Admin accounts.');
        sounds.playErrorBuzz();
        return;
      }
    }

    // Password validation: min 6 chars and match confirm
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      sounds.playErrorBuzz();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter matching passwords.');
      sounds.playErrorBuzz();
      return;
    }

    // Check if account already exists
    const accountExists = registeredAccounts.some(
      acc => acc.academicEmail.toLowerCase() === cleanEmail
    );
    if (accountExists) {
      setErrorMessage('An account with this MBSTU email already exists. Please sign in instead.');
      sounds.playErrorBuzz();
      return;
    }

    const selectedHall = halls.find(h => h.id === selectedHallId) || halls[0];
    const finalRoomNumber = selectedRole === 'STUDENT'
      ? roomNumber.trim()
        ? roomNumber.trim().startsWith('Room')
          ? roomNumber.trim()
          : `Room ${roomNumber.trim()}`
        : 'Non-Resident'
      : selectedRole === 'ADMIN'
      ? 'Provost Office'
      : 'Dining Staff Office';

    const newProfile: StudentProfile = {
      id: `${selectedRole.toLowerCase()}-${Date.now()}`,
      studentId: selectedRole === 'STUDENT' ? studentId.trim().toUpperCase() : `${selectedRole}-${selectedHall.code}-01`,
      name: name.trim(),
      academicEmail: cleanEmail,
      password,
      role: selectedRole,
      gender,
      hallId: selectedHall.id,
      hallName: selectedHall.name,
      roomNumber: finalRoomNumber,
      department: selectedRole === 'STUDENT' ? department.trim() : (selectedRole === 'ADMIN' ? 'Hall Administration' : 'Dining Staff'),
      batch: selectedRole === 'STUDENT' ? 'Current Academic Year' : (selectedRole === 'ADMIN' ? 'Hall Administration' : 'Staff Employee'),
      walletBalance: selectedRole === 'STUDENT' ? 300 : 0, // Welcome dining subsidy for students
      dietaryPreference: 'REGULAR',
      phone: phone.trim() || '+880-1700-000000',
      idCardPhotoUrl: idCardPhoto || undefined
    };

    saveRecentEmail(cleanEmail);
    sounds.playPurchaseChime();
    setSuccessMessage(`Registration complete! Welcome to AmarToken as ${selectedRole}.`);
    onRegisterStudent(newProfile);

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1100);
  };

  // Handle Academic Sign-In (Login Mode)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = academicEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your MBSTU institutional email address.');
      sounds.playErrorBuzz();
      return;
    }

    if (!isMbstuEmail(cleanEmail)) {
      setErrorMessage('Invalid Domain: Please enter a valid @mbstu.ac.bd email address.');
      sounds.playErrorBuzz();
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      sounds.playErrorBuzz();
      return;
    }

    // Search accounts (including seeded and local storage accounts)
    const matchedAccount = registeredAccounts.find(
      acc => acc.academicEmail.toLowerCase() === cleanEmail
    );

    if (!matchedAccount) {
      setErrorMessage(
        'No account found with this MBSTU email address. Please register for an account first.'
      );
      sounds.playErrorBuzz();
      return;
    }

    // Role verification: check if matching the selected role
    const accountRole = matchedAccount.role || 'STUDENT';
    if (accountRole !== selectedRole) {
      const roleName = accountRole === 'STUDENT' ? 'Student' : accountRole === 'STAFF' ? 'Hall Staff' : 'Hall Admin';
      setErrorMessage(`Role mismatch: This email is registered as "${roleName}". Please select the "${roleName}" tab above to continue.`);
      sounds.playErrorBuzz();
      return;
    }

    // Check password
    if (matchedAccount.password && matchedAccount.password !== password) {
      setErrorMessage('Incorrect password. Please verify your credentials and try again.');
      sounds.playErrorBuzz();
      return;
    }

    saveRecentEmail(cleanEmail);
    sounds.playPurchaseChime();
    setSuccessMessage(`Welcome back, ${matchedAccount.name}! Signing in as ${accountRole}...`);

    const loginHandler = onLoginStudent || onRegisterStudent;
    setTimeout(() => {
      setSuccessMessage(null);
      loginHandler(matchedAccount);
      onClose();
    }, 900);
  };

  // Role quick demo accounts helper
  const roleDemoEmail = selectedRole === 'STUDENT'
    ? 'tanvir.it22084@mbstu.ac.bd'
    : selectedRole === 'STAFF'
    ? 'staff.szrh@mbstu.ac.bd'
    : 'admin.szrh@mbstu.ac.bd';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-slate-200/80 space-y-5 animate-in fade-in duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Top Header */}
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
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {isLoginMode ? 'Institutional Sign-In' : 'Institutional Registration'}
              </h3>
              <p className="text-xs text-[#8b1d24] font-medium leading-tight mt-0.5">
                Mawlana Bhashani Science &amp; Technology University
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

        {/* 3-Tab Segmented Role Selector (Student | Hall Staff | Hall Admin) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Select Your Institutional Role
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('STUDENT');
                setErrorMessage(null);
                sounds.playTabSwitch();
              }}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                selectedRole === 'STUDENT'
                  ? 'bg-[#8b1d24] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('STAFF');
                setErrorMessage(null);
                sounds.playTabSwitch();
              }}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                selectedRole === 'STAFF'
                  ? 'bg-[#8b1d24] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Hall Staff
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('ADMIN');
                setErrorMessage(null);
                sounds.playTabSwitch();
              }}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                selectedRole === 'ADMIN'
                  ? 'bg-[#8b1d24] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Hall Admin
            </button>
          </div>
        </div>

        {/* Refined Low-Glare Institutional Security Policy Banner */}
        <div className="bg-rose-50/70 border border-rose-200/80 text-slate-700 rounded-2xl p-3.5 text-xs flex items-start gap-2.5 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#8b1d24] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">Institutional Security Policy:</span> Only verified MBSTU email addresses (<code className="font-mono text-[#8b1d24] font-semibold">@mbstu.ac.bd</code>) are authorized to access the AmarToken platform.
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

        {/* Sign-In Form (Login Mode) */}
        {isLoginMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Academic Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {selectedRole === 'STUDENT' ? 'Student Academic Email' : `${selectedRole === 'STAFF' ? 'Staff' : 'Admin'} Official Email`}{' '}
                  <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleSelectRecentEmail(roleDemoEmail)}
                  className="text-[11px] text-[#8b1d24] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Fill Demo {selectedRole === 'STUDENT' ? 'Student' : selectedRole === 'STAFF' ? 'Staff' : 'Admin'}</span>
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  list="recent-mbstu-emails"
                  required
                  placeholder={`e.g. ${roleDemoEmail}`}
                  value={academicEmail}
                  onChange={e => {
                    setAcademicEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                />
                <datalist id="recent-mbstu-emails">
                  {recentEmails.map(em => (
                    <option key={em} value={em} />
                  ))}
                </datalist>
              </div>

              {/* Clickable Quick-Suggestion Chips (CRITICAL: never auto-populates password) */}
              {recentEmails.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Recent:</span>
                  {recentEmails.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => handleSelectRecentEmail(em)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#8b1d24] border border-slate-200 transition-colors cursor-pointer truncate max-w-[220px]"
                      title={`Use ${em} (Password will NOT be autofilled)`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-slate-500 mt-1">
                Must end in <strong className="text-slate-700">@mbstu.ac.bd</strong>
              </p>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password <span className="text-red-600">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Demo: <code className="font-mono text-slate-600 font-medium">mbstu123</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your account password..."
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8b1d24] hover:bg-[#70161c] text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as {selectedRole === 'STUDENT' ? 'Student' : selectedRole === 'STAFF' ? 'Hall Staff' : 'Hall Admin'}</span>
            </button>
          </form>
        ) : (
          /* Distinct Registration Form by Role */
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Common: Institutional Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {selectedRole === 'STUDENT' ? 'Student Academic Email' : 'Official Institutional Email'}{' '}
                <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname.dept@mbstu.ac.bd"
                  value={academicEmail}
                  onChange={e => {
                    setAcademicEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Must end in <strong className="text-slate-700">@mbstu.ac.bd</strong>
              </p>
            </div>

            {/* Common: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Full Name & Role Specific Roll / ID */}
            {selectedRole === 'STUDENT' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Student Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Student ID / Roll <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT-22084"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono uppercase bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'ADMIN' ? 'e.g. Prof. Dr. Tariqul Islam' : 'e.g. Md. Rafiqul Islam'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Gender Selection & Hall Assignment (Dynamic Gender Filter) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gender <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={gender}
                  onChange={e => handleGenderChange(e.target.value as 'Male' | 'Female' | 'Other')}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Assigned Residential Hall <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={selectedHallId}
                    onChange={e => setSelectedHallId(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all cursor-pointer"
                  >
                    {availableHalls.map(hall => (
                      <option key={hall.id} value={hall.id}>
                        {hall.name} ({hall.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Student-only: Room Number & Department */}
            {selectedRole === 'STUDENT' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Allocated Room # (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 314 (Block B) or Non-Resident"
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all cursor-pointer"
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
            )}

            {/* Contact Phone Number (Required for Staff & Admin, Optional for Students) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Phone Number {selectedRole !== 'STUDENT' && <span className="text-red-600">*</span>}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required={selectedRole !== 'STUDENT'}
                  placeholder="+880 17XX-XXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8b1d24] focus:ring-2 focus:ring-[#8b1d24]/15 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Staff & Admin Only: Mandatory Official ID Card Proof Upload */}
            {selectedRole !== 'STUDENT' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official MBSTU ID Card / Appointment Proof <span className="text-red-600">*</span>
                </label>
                
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleIdCardFileSelect}
                  className="hidden"
                />

                {idCardPhoto ? (
                  <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={idCardPhoto}
                        alt="ID Card Proof Preview"
                        className="w-14 h-14 object-cover rounded-xl border border-rose-200 shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {idCardFileName || 'Official_ID_Card.png'}
                        </div>
                        <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Image uploaded &amp; verified</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleTriggerFileInput}
                      className="px-3 py-1.5 text-xs font-semibold text-[#8b1d24] bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={handleTriggerFileInput}
                    className="border-2 border-dashed border-rose-300 hover:border-[#8b1d24] bg-rose-50/30 hover:bg-rose-50/60 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-[#8b1d24] shadow-2xs group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Click to upload MBSTU Employee / Provost ID Card
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Supports PNG, JPG, or WEBP (Max 5MB)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Registration Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#8b1d24] hover:bg-[#70161c] text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as {selectedRole === 'STUDENT' ? 'Student' : selectedRole === 'STAFF' ? 'Hall Staff' : 'Hall Admin'}</span>
            </button>
          </form>
        )}

        {/* Switch Mode Footer */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>
            {isLoginMode ? "Don't have an account yet?" : 'Already registered?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMessage(null);
            }}
            className="text-[#8b1d24] hover:text-[#70161c] font-semibold cursor-pointer transition-colors"
          >
            {isLoginMode ? 'Register with MBSTU Email' : 'Sign in to Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
