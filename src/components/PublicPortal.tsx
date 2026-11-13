import React, { useState, useEffect } from 'react';
import {
  ResidentialHall,
  StudentProfile,
  AdminAccount,
  StaffAccount,
  PublicRoute,
  UserRole,
  DietaryType
} from '../types';
import {
  Building,
  GraduationCap,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Ban,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  UserPlus,
  LogIn
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface PublicPortalProps {
  route: PublicRoute;
  onNavigate: (route: PublicRoute) => void;
  halls: ResidentialHall[];
  students: StudentProfile[];
  admins: AdminAccount[];
  staffList: StaffAccount[];
  onLoginSuccess: (role: UserRole, userId: string) => void;
  onRegisterStudent: (newProfile: StudentProfile) => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  route,
  onNavigate,
  halls,
  students,
  admins,
  staffList,
  onLoginSuccess,
  onRegisterStudent
}) => {
  // Login state
  const [loginRole, setLoginRole] = useState<UserRole>('STUDENT');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regHallId, setRegHallId] = useState(halls[5]?.id || halls[0]?.id || 'safh');
  const [regRoom, setRegRoom] = useState('');
  const [regDepartment, setRegDepartment] = useState('Information and Communication Technology');
  const [regBatch, setRegBatch] = useState('2022-23');
  const [regPhone, setRegPhone] = useState('+880-17');
  const [regDietary, setRegDietary] = useState<DietaryType>('HALAL_NON_VEG');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    setLoginError('');
    setRegError('');
  }, [route, loginRole]);

  const validateAcademicEmail = (emailStr: string): boolean => {
    const trimmed = emailStr.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return false;
    return (
      trimmed.endsWith('@mbstu.ac.bd') ||
      trimmed.endsWith('.ac.bd') ||
      trimmed.endsWith('.edu.bd') ||
      trimmed.endsWith('.edu')
    );
  };

  const handleOpenRoleLogin = (role: UserRole) => {
    setLoginRole(role);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    onNavigate('login');
  };

  const fillDemoCredentials = (role: UserRole) => {
    setLoginError('');
    if (role === 'STUDENT') {
      const demo = students[0];
      if (demo) {
        setLoginEmail(demo.academicEmail);
        setLoginPassword(demo.password);
      }
    } else if (role === 'ADMIN') {
      const demo = admins[0];
      if (demo) {
        setLoginEmail(demo.email);
        setLoginPassword(demo.password);
      }
    } else {
      const demo = staffList[0];
      if (demo) {
        setLoginEmail(demo.email);
        setLoginPassword(demo.password);
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const normalizedEmail = loginEmail.trim().toLowerCase();
    if (!normalizedEmail || !loginPassword) {
      setLoginError('Please enter both email address and password.');
      sounds.playErrorBuzz();
      return;
    }

    if (loginRole === 'STUDENT') {
      const match = students.find(
        s => s.academicEmail.toLowerCase() === normalizedEmail && s.password === loginPassword
      );
      if (!match) {
        setLoginError('Invalid student academic email or password.');
        sounds.playErrorBuzz();
        return;
      }
      if (match.status === 'SUSPENDED') {
        setLoginError('Your student dining account is currently suspended. Please contact your Hall Provost office.');
        sounds.playErrorBuzz();
        return;
      }
      sounds.playSuccessChime();
      onLoginSuccess('STUDENT', match.id);
      return;
    }

    if (loginRole === 'ADMIN') {
      const match = admins.find(
        a => a.email.toLowerCase() === normalizedEmail && a.password === loginPassword
      );
      if (!match) {
        setLoginError('Invalid administrator email or password.');
        sounds.playErrorBuzz();
        return;
      }
      sounds.playSuccessChime();
      onLoginSuccess('ADMIN', match.id);
      return;
    }

    if (loginRole === 'STAFF') {
      const match = staffList.find(
        st => st.email.toLowerCase() === normalizedEmail && st.password === loginPassword
      );
      if (!match) {
        setLoginError('Invalid dining staff email or password.');
        sounds.playErrorBuzz();
        return;
      }
      sounds.playSuccessChime();
      onLoginSuccess('STAFF', match.id);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const trimmedEmail = regEmail.trim().toLowerCase();
    const trimmedId = regStudentId.trim().toUpperCase();

    if (!regName.trim() || !trimmedId || !regRoom.trim() || !trimmedEmail || !regPassword) {
      setRegError('All required student fields must be completed.');
      sounds.playErrorBuzz();
      return;
    }

    if (!validateAcademicEmail(trimmedEmail)) {
      setRegError(
        'Personal email providers (e.g. Gmail, Yahoo) are rejected. Use your institutional academic email ending in @mbstu.ac.bd, .ac.bd, or .edu.bd.'
      );
      sounds.playErrorBuzz();
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      sounds.playErrorBuzz();
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      sounds.playErrorBuzz();
      return;
    }

    const emailExists = students.some(s => s.academicEmail.toLowerCase() === trimmedEmail);
    if (emailExists) {
      setRegError('An account with this academic email is already registered.');
      sounds.playErrorBuzz();
      return;
    }

    const idExists = students.some(s => s.studentId.toUpperCase() === trimmedId);
    if (idExists) {
      setRegError('This Student ID is already registered in the hall directory.');
      sounds.playErrorBuzz();
      return;
    }

    const chosenHall = halls.find(h => h.id === regHallId) || halls[0];
    const newProfile: StudentProfile = {
      id: `stu-${Date.now()}`,
      studentId: trimmedId,
      name: regName.trim(),
      academicEmail: trimmedEmail,
      password: regPassword,
      hallId: chosenHall.id,
      hallName: chosenHall.name,
      roomNumber: regRoom.trim(),
      department: regDepartment.trim() || 'General Studies',
      batch: regBatch.trim() || '2022-23',
      walletBalance: 300,
      dietaryPreference: regDietary,
      phone: regPhone.trim() || '+880-1700-000000',
      status: 'ACTIVE',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    sounds.playPurchaseChime();
    onRegisterStudent(newProfile);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Public 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Identity */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <img
              src="/assets/aistudio/university_projects_550e2ddf.png"
              alt="MBSTU Logo"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div>
              <div className="text-lg font-extrabold tracking-tight text-red-800 leading-none">
                AmarToken
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                MBSTU Residential Hall Dining
              </div>
            </div>
          </button>

          {/* Zone 2: Primary Public Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'home' as const, label: 'Home' },
              { id: 'register' as const, label: 'Student Registration' },
              { id: 'login' as const, label: 'Portal Login' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  route === item.id
                    ? 'bg-red-50 text-red-800'
                    : 'text-slate-600 hover:text-red-800 hover:bg-red-50/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="px-3.5 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="px-3.5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Student Register
            </button>
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        {route === 'home' && (
          <div>
            {/* Crimson & White Hero Section */}
            <section className="border-b border-red-100 bg-gradient-to-b from-red-50/60 via-white to-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="text-xs font-bold uppercase tracking-widest text-red-700">
                      Mawlana Bhashani Science &amp; Technology University · 7 Residential Halls
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
                      Digital Hall Meal Tokens,{' '}
                      <span className="text-red-700">Built for Campus Dining.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                      AmarToken manages daily subsidized Lunch and Dinner token issuance, QR verification at hall dining gates, and transparent hall administration across all seven MBSTU residential halls.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => onNavigate('register')}
                        className="px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Student Registration</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenRoleLogin('STUDENT')}
                        className="px-6 py-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-800 text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Student Login</span>
                      </button>
                    </div>

                    {/* Key Dining Policies */}
                    <div className="pt-4 border-t border-red-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900">Academic Email Only</div>
                          <div className="text-slate-500 mt-0.5">Verified @mbstu.ac.bd / .ac.bd registration</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900">Lunch &amp; Dinner Only</div>
                          <div className="text-slate-500 mt-0.5">Lunch ৳65 (10:30 AM cutoff) · Dinner ৳60 (5:00 PM)</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Ban className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900">Strict No-Refund Policy</div>
                          <div className="text-slate-500 mt-0.5">Purchased tokens are final and non-refundable</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Hero Card: Official University Emblem & Daily Rates */}
                  <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl border border-red-200 p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="flex items-center gap-4 pb-5 border-b border-red-100">
                        <img
                          src="/assets/aistudio/university_projects_550e2ddf.png"
                          alt="MBSTU Emblem"
                          className="w-16 h-16 object-contain shrink-0"
                        />
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-red-700">
                            Official Portal
                          </div>
                          <div className="text-xl font-extrabold text-slate-900">
                            AmarToken System
                          </div>
                          <div className="text-xs text-slate-500">
                            Central Hall Dining Authority
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50/70 border border-red-100">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-red-800">
                              Daily Lunch Token
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              Served 12:30 PM – 2:30 PM · Cutoff 10:30 AM
                            </div>
                          </div>
                          <div className="text-2xl font-extrabold font-mono text-red-800 tabular-nums">
                            ৳65
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50/70 border border-red-100">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-red-800">
                              Daily Dinner Token
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              Served 7:30 PM – 9:30 PM · Cutoff 5:00 PM
                            </div>
                          </div>
                          <div className="text-2xl font-extrabold font-mono text-red-800 tabular-nums">
                            ৳60
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span>Active Registered Halls: 7</span>
                        <span className="font-semibold text-red-700">QR Cryptographic Verification</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Three Role-Based Portals Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-red-100">
              <div className="max-w-2xl mb-8">
                <div className="text-xs font-bold uppercase tracking-widest text-red-700">
                  Role-Based Access
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                  Three Dedicated Portals for Campus Dining
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  Sign in with your assigned role credentials to access your dedicated AmarToken workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Student Portal Card */}
                <div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col justify-between hover:border-red-300 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center mb-4">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Student Portal</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      For MBSTU residential hall students verified with an academic email.
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Dashboard &amp; Dining Wallet Overview</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Buy Lunch &amp; Dinner Meal Tokens</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>My Orders, My QR Tokens &amp; Payment History</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Academic Profile Management</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenRoleLogin('STUDENT')}
                      className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Student Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('register')}
                      className="px-3.5 py-2.5 border border-red-200 hover:bg-red-50 text-red-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Register
                    </button>
                  </div>
                </div>

                {/* Admin Portal Card */}
                <div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col justify-between hover:border-red-300 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-red-900 text-white flex items-center justify-center mb-4">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Administrator Portal</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      For Hall Provosts and Central Dining Controllers managing all 7 halls.
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Dashboard Statistics &amp; Revenue Reports</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Manage Meals &amp; Meal Schedules</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Manage Students &amp; Manage Orders</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Verify Student Payment Slips</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenRoleLogin('ADMIN')}
                      className="w-full py-2.5 bg-red-900 hover:bg-red-950 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Administrator Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Staff Portal Card */}
                <div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col justify-between hover:border-red-300 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Dining Staff Portal</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      For Hall Dining Gate attendants verifying student meal tokens in real time.
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Live QR Scanner &amp; Gate Counter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Token Verification &amp; Double-Spend Prevention</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Cross-Hall Entry Validation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>Used Token History Ledger</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenRoleLogin('STAFF')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Staff Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 7 Residential Halls Directory */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-red-700">
                    Campus Hall Network
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                    Seven MBSTU Residential Halls
                  </h2>
                </div>
                <div className="text-xs text-slate-500">
                  Daily Service: Lunch (12:30–2:30 PM) · Dinner (7:30–9:30 PM)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {halls.map(hall => {
                  const lunch = hall.diningSchedule.find(s => s.mealSlot === 'LUNCH');
                  const dinner = hall.diningSchedule.find(s => s.mealSlot === 'DINNER');
                  return (
                    <div
                      key={hall.id}
                      className="bg-white rounded-2xl border border-red-100 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-mono font-bold text-red-700 tracking-wider">
                            {hall.code}
                          </span>
                          <span className="font-mono text-slate-500 tabular-nums">
                            {hall.currentResidents}/{hall.capacity} residents
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 flex items-start gap-2">
                          <Building className="w-4 h-4 text-red-700 shrink-0 mt-1" />
                          <span>{hall.name}</span>
                        </h3>
                        {hall.banglaName && (
                          <div className="text-xs text-slate-500 mt-1 pl-6">{hall.banglaName}</div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-red-50/60 rounded-lg px-3 py-2">
                          <div className="text-[10px] font-bold uppercase text-red-800">Lunch</div>
                          <div className="font-mono font-bold text-slate-900 tabular-nums">
                            ৳{lunch?.price ?? 65}
                          </div>
                        </div>
                        <div className="bg-red-50/60 rounded-lg px-3 py-2">
                          <div className="text-[10px] font-bold uppercase text-red-800">Dinner</div>
                          <div className="font-mono font-bold text-slate-900 tabular-nums">
                            ৳{dinner?.price ?? 60}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* PUBLIC STUDENT REGISTRATION VIEW */}
        {route === 'register' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-2xl border border-red-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-4 pb-5 border-b border-red-100">
                <img
                  src="/assets/aistudio/university_projects_550e2ddf.png"
                  alt="MBSTU Logo"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-red-700">
                    MBSTU Student Onboarding
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-950">
                    Student Registration (Academic Email Required)
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Only institutional academic email addresses (@mbstu.ac.bd, .ac.bd, .edu.bd) are eligible to register.
                  </p>
                </div>
              </div>

              {regError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span className="font-medium">{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Institutional Academic Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname.dept22001@mbstu.ac.bd"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Personal emails (@gmail.com, @yahoo.com) are blocked by university dining security rules.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rakibul Hasan"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Student ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IT-23015"
                      value={regStudentId}
                      onChange={e => setRegStudentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Residential Hall *</label>
                    <select
                      value={regHallId}
                      onChange={e => setRegHallId(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    >
                      {halls.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Room Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Room 214 (Block A)"
                      value={regRoom}
                      onChange={e => setRegRoom(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={e => setRegDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Session / Batch</label>
                    <input
                      type="text"
                      value={regBatch}
                      onChange={e => setRegBatch(e.target.value)}
                      className="w-full px-3.5 py-2.5 font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dietary Preference</label>
                    <select
                      value={regDietary}
                      onChange={e => setRegDietary(e.target.value as DietaryType)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    >
                      <option value="HALAL_NON_VEG">Halal Non-Veg</option>
                      <option value="REGULAR">Regular Balanced</option>
                      <option value="VEGETARIAN">Vegetarian</option>
                      <option value="DIABETIC_SPECIAL">Diabetic Special</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>
                </div>

                <div className="p-3 bg-red-50/80 border border-red-100 rounded-xl text-[11px] text-red-900 flex items-start gap-2">
                  <Ban className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dining Policy Notice:</strong> By registering, you acknowledge that all Lunch &amp; Dinner tokens are final once purchased. No cancellations or refunds are permitted.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                  >
                    Already registered? Go to Student Login
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Registration &amp; Enter Dashboard</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PUBLIC 3-ROLE LOGIN VIEW */}
        {route === 'login' && (
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl border border-red-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3.5 pb-4 border-b border-red-100">
                <img
                  src="/assets/aistudio/university_projects_550e2ddf.png"
                  alt="MBSTU Logo"
                  className="w-11 h-11 object-contain shrink-0"
                />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-red-700">
                    AmarToken Authentication
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-950">
                    Sign In to Your Dashboard
                  </h1>
                </div>
              </div>

              {/* 3-Role Switcher */}
              <div className="grid grid-cols-3 gap-1.5 bg-red-50/70 p-1.5 rounded-xl border border-red-100">
                {[
                  { id: 'STUDENT' as const, label: 'Student', icon: GraduationCap },
                  { id: 'ADMIN' as const, label: 'Administrator', icon: ShieldCheck },
                  { id: 'STAFF' as const, label: 'Dining Staff', icon: QrCode }
                ].map(item => {
                  const Icon = item.icon;
                  const active = loginRole === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLoginRole(item.id)}
                      className={`py-2.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        active
                          ? 'bg-red-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-red-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span className="font-medium">{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {loginRole === 'STUDENT'
                      ? 'Academic Email Address'
                      : loginRole === 'ADMIN'
                      ? 'Administrator Email'
                      : 'Staff Counter Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder={
                        loginRole === 'STUDENT'
                          ? 'tanvir.it22084@mbstu.ac.bd'
                          : loginRole === 'ADMIN'
                          ? 'provost.admin@mbstu.ac.bd'
                          : 'rafiq.staff@mbstu.ac.bd'
                      }
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    Sign In as {loginRole === 'STUDENT' ? 'Student' : loginRole === 'ADMIN' ? 'Administrator' : 'Dining Staff'}
                  </span>
                </button>
              </form>

              {/* Quick Demo Access Helper */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Demo Account Credentials ({loginRole}):</span>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials(loginRole)}
                    className="text-red-700 font-bold hover:underline cursor-pointer"
                  >
                    Fill Demo Credentials
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] font-mono text-slate-600 space-y-1">
                  {loginRole === 'STUDENT' && (
                    <>
                      <div>Email: tanvir.it22084@mbstu.ac.bd</div>
                      <div>Password: password123</div>
                    </>
                  )}
                  {loginRole === 'ADMIN' && (
                    <>
                      <div>Email: provost.admin@mbstu.ac.bd</div>
                      <div>Password: admin123</div>
                    </>
                  )}
                  {loginRole === 'STAFF' && (
                    <>
                      <div>Email: rafiq.staff@mbstu.ac.bd</div>
                      <div>Password: staff123</div>
                    </>
                  )}
                </div>

                {loginRole === 'STUDENT' && (
                  <div className="text-center text-xs text-slate-500 pt-1">
                    New MBSTU resident?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('register')}
                      className="text-red-700 font-bold hover:underline cursor-pointer"
                    >
                      Register with your academic email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-red-100 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/university_projects_550e2ddf.png"
              alt="MBSTU Logo"
              className="w-5 h-5 object-contain"
            />
            <span className="font-bold text-red-800">AmarToken</span>
            <span aria-hidden="true">·</span>
            <span>Mawlana Bhashani Science &amp; Technology University</span>
            <span aria-hidden="true">·</span>
            <span className="text-red-700 font-medium">Non-Refundable Dining Policy</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Student · Administrator · Dining Staff Portal
          </div>
        </div>
      </footer>
    </div>
  );
};
