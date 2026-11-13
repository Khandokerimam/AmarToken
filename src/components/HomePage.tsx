import React, { useState, useEffect } from 'react';
import { ResidentialHall, StudentProfile } from '../types';
import {
  Utensils,
  QrCode,
  ShieldCheck,
  Building2,
  Clock,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  FileText,
  HeartHandshake,
  Users,
  Compass,
  AlertTriangle,
  Flame,
  Droplets,
  DollarSign,
  Shield,
  Layers,
  CreditCard,
  Copy,
  Check
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HomePageProps {
  halls: ResidentialHall[];
  onSelectHallAndNavigate: (hall: ResidentialHall) => void;
  onNavigateToStore: () => void;
  onNavigateToTokens: () => void;
  onOpenRegisterModal: () => void;
  isLoggedIn: boolean;
  student: StudentProfile;
  onOpenLoginModal?: () => void;
}

interface NoticeItem {
  id: string;
  category: 'DINING' | 'ADMIN' | 'URGENT' | 'POLICY';
  title: string;
  date: string;
  summary: string;
  badge: string;
  isUrgent?: boolean;
}

const NOTICES: NoticeItem[] = [
  {
    id: 'not-01',
    category: 'URGENT',
    title: 'Daily Meal Token Booking Window: 6:00 PM – 12:00 AM (Midnight)',
    date: 'November 12, 2026',
    summary:
      'All resident boarders are notified that meal token booking for the following day strictly operates from 6:00 PM until 12:00 AM (Midnight). No manual or offline token requests will be entertained after midnight.',
    badge: 'Window: 6PM–12AM',
    isUrgent: true
  },
  {
    id: 'not-02',
    category: 'POLICY',
    title: 'Provost Council Resolution: 100% Non-Refundable & Non-Cancellable Policy',
    date: 'November 10, 2026',
    summary:
      'To prevent perishable food waste and streamline bulk kitchen procurement, tokens once purchased cannot be cancelled or refunded under any circumstances. Tokens can only be consumed by the designated boarder or transferred through official gate proxy.',
    badge: 'Provost Resolution',
    isUrgent: false
  },
  {
    id: 'not-03',
    category: 'DINING',
    title: 'Mandatory QR Code Presentation at Hall Dining Turnstiles',
    date: 'November 08, 2026',
    summary:
      'Students must present their digital token QR code from their mobile device or a high-contrast printed copy at the dining hall entrance scanner. Staff scanners will immediately invalidate double-entry attempts.',
    badge: 'Gate Protocol',
    isUrgent: false
  },
  {
    id: 'not-04',
    category: 'ADMIN',
    title: 'Academic Email Verification for Subsidized Rates (৳30 Lunch / ৳30 Dinner)',
    date: 'November 05, 2026',
    summary:
      'MBSTU subsidized dining rates (৳30 for Lunch, ৳30 for Dinner) are exclusively applicable to enrolled students registered with verified @mbstu.ac.bd academic accounts.',
    badge: '৳30 Fixed Rate',
    isUrgent: false
  },
  {
    id: 'not-05',
    category: 'DINING',
    title: 'Routine Steam Kitchen Cleanliness & RO Drinking Water Quality Audit',
    date: 'November 01, 2026',
    summary:
      'The University Health & Dining Committee completed weekly chemical and microbial testing on dining hall steam cookers and reverse-osmosis filtration units across all 7 residential halls. All parameters verified safe.',
    badge: 'Health & Safety',
    isUrgent: false
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  halls,
  onSelectHallAndNavigate,
  onNavigateToStore,
  onNavigateToTokens,
  onOpenRegisterModal,
  isLoggedIn,
  student,
  onOpenLoginModal
}) => {
  const [activeNoticeTab, setActiveNoticeTab] = useState<'ALL' | 'DINING' | 'POLICY' | 'ADMIN'>('ALL');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [previewLanding, setPreviewLanding] = useState<boolean>(false);
  const [copiedPhoneHallId, setCopiedPhoneHallId] = useState<string | null>(null);
  const [hallGenderFilter, setHallGenderFilter] = useState<'AUTO' | 'ALL' | 'Male' | 'Female'>('AUTO');

  // Live Clock & Booking Window Countdown (6:00 PM – 12:00 AM Midnight)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentSecond = currentTime.getSeconds();
  // Booking window is active between 18:00 (6:00 PM) and 24:00 (12:00 AM Midnight)
  const isBookingWindowOpen = currentHour >= 18 && currentHour < 24;

  let windowCountdownText = '';
  if (isBookingWindowOpen) {
    const hLeft = 23 - currentHour;
    const mLeft = 59 - currentMinute;
    const sLeft = 59 - currentSecond;
    windowCountdownText = `Closes in ${hLeft}h ${mLeft}m ${sLeft}s`;
  } else {
    const diffSecs = (18 * 3600) - (currentHour * 3600 + currentMinute * 60 + currentSecond);
    const positiveDiff = diffSecs > 0 ? diffSecs : diffSecs + 86400;
    const h = Math.floor(positiveDiff / 3600);
    const m = Math.floor((positiveDiff % 3600) / 60);
    const s = positiveDiff % 60;
    windowCountdownText = `Opens in ${h}h ${m}m ${s}s`;
  }

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const handleCopyPhone = (e: React.MouseEvent, hallId: string, phone: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhoneHallId(hallId);
    sounds.playTabSwitch();
    setTimeout(() => {
      setCopiedPhoneHallId(null);
    }, 2000);
  };

  const effectiveGenderFilter = hallGenderFilter === 'AUTO'
    ? (student?.gender === 'Male' || student?.gender === 'Female' ? student.gender : 'ALL')
    : hallGenderFilter;

  const displayedHalls = halls.filter(hall => {
    if (effectiveGenderFilter === 'ALL') return true;
    return hall.gender === effectiveGenderFilter;
  });

  const filteredNotices = NOTICES.filter(n => {
    if (activeNoticeTab === 'ALL') return true;
    if (activeNoticeTab === 'DINING') return n.category === 'DINING' || n.category === 'URGENT';
    if (activeNoticeTab === 'POLICY') return n.category === 'POLICY';
    if (activeNoticeTab === 'ADMIN') return n.category === 'ADMIN';
    return true;
  });

  const handleHallClick = (hall: ResidentialHall) => {
    sounds.playTabSwitch();
    onSelectHallAndNavigate(hall);
  };

  const handleNoticeClick = (notice: NoticeItem) => {
    sounds.playTabSwitch();
    setSelectedNotice(notice);
  };

  // --------------------------------------------------------------------------
  // UNAUTHENTICATED (LOGGED-OUT) MINIMALIST SAAS-STYLE LANDING VIEW
  // --------------------------------------------------------------------------
  if (!isLoggedIn || previewLanding) {
    return (
      <div className="space-y-16 sm:space-y-24 pb-8 max-w-6xl mx-auto">
        {/* Preview Banner for logged-in users */}
        {isLoggedIn && previewLanding && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between">
            <span className="font-medium">
              You are currently previewing the public visitor landing page.
            </span>
            <button
              onClick={() => setPreviewLanding(false)}
              className="font-bold underline text-amber-800 hover:text-amber-950 cursor-pointer"
            >
              Return to Hall Dashboard
            </button>
          </div>
        )}

        {/* Section A: Centered Hero Section */}
        <section className="relative pt-6 sm:pt-14 pb-4 sm:pb-8 overflow-hidden text-center">
          {/* Subtle soft radial glow at top center using our crimson/rose theme */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-red-100/70 via-rose-50/40 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"
            aria-hidden="true"
          />

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-red-200/90 shadow-2xs text-xs font-semibold text-slate-700 mb-6 sm:mb-8 backdrop-blur-xs">
            <Utensils className="w-3.5 h-3.5 text-[#8b1d24]" />
            <span>Smart Meal Management for MBSTU Halls</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14] max-w-4xl mx-auto">
            The most efficient way to <br />
            <span className="bg-gradient-to-r from-[#8b1d24] via-red-700 to-amber-500 bg-clip-text text-transparent">
              manage hall meals.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Automate student bookings, manage prices, track billing, and streamline hall operations with our comprehensive solution tailored for MBSTU.
          </p>

          {/* Primary CTA Button */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={onOpenRegisterModal}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#8b1d24] hover:bg-[#73181e] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>Get Started Now</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* Section B: 3-Column Feature Cards Section */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Smart Bookings */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#8b1d24] text-white flex items-center justify-center shadow-xs mb-6 shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Smart Bookings
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Students can easily book lunch and dinner within strict daily cutoff windows across all 7 MBSTU residential halls.
              </p>
            </div>

            {/* Card 2: Prepaid Wallet */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs mb-6 shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Prepaid Wallet
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automated balance tracking via bKash, Nagad, and Smart Campus ID ensures meal costs are deducted accurately from student accounts.
              </p>
            </div>

            {/* Card 3: Hall Admin Tools */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start text-left">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs mb-6 shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Hall Admin Tools
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Verify cryptographic QR tokens at the gate, track payment deposits, and generate kitchen grocery requisitions with ease.
              </p>
            </div>
          </div>
        </section>

        {/* Section C: Minimalist Institutional Footer */}
        <footer className="border-t border-slate-200/80 pt-8 pb-4 mt-20 sm:mt-28">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left side: emblem, AmarToken, Hall Management System */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 p-1 overflow-hidden shrink-0 border border-slate-200/60">
                <img
                  src="/assets/aistudio/university_projects_550e2ddf.png"
                  alt="MBSTU Emblem"
                  className="w-full h-full object-contain grayscale opacity-80"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 leading-tight">AmarToken</div>
                <div className="text-xs text-slate-500 leading-tight">Hall Management System</div>
              </div>
            </div>

            {/* Right side: University name and copyright */}
            <div className="text-center sm:text-right">
              <div className="text-xs font-medium text-slate-600">
                Mawlana Bhashani Science and Technology University
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                © 2026 All rights reserved. Developed for MBSTU.
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED (LOGGED-IN) RICH INSTITUTIONAL DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-12 pb-16">
      {/* Session Pill & Public Landing Preview Toggle */}
      <div className="flex items-center justify-between pb-1 text-xs">
        <span className="text-slate-500 font-medium">
          Boarder Portal active for <strong className="text-slate-800">{student.name}</strong> ({student.hallName})
        </span>
        <button
          onClick={() => setPreviewLanding(true)}
          className="text-xs text-red-700 hover:text-red-900 font-semibold underline cursor-pointer"
        >
          Preview Public Landing Page →
        </button>
      </div>
      
      {/* 1. Institutional Hotline, Live Window Status & Bulletin Strip */}
      <div className="bg-[#8b1d24] text-white text-xs px-4 py-3 rounded-2xl shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3 border border-[#70161c]">
        <div className="flex flex-wrap items-center gap-2 overflow-hidden w-full lg:w-auto">
          <span className="px-2 py-0.5 bg-[#4a0d12] font-bold rounded text-[10px] uppercase tracking-wider text-rose-200 shrink-0">
            Official Bulletin
          </span>
          <p className="text-rose-100 font-medium">
            Daily meal booking window: <strong className="text-white">6:00 PM – 12:00 AM (Midnight)</strong> for next day · Strict Non-Refundable Policy.
          </p>
        </div>

        {/* Live Booking Window Status & Clock Pill */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 border border-white/20 text-xs backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isBookingWindowOpen ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isBookingWindowOpen ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </span>
            <span className="font-semibold text-white">
              {isBookingWindowOpen ? 'Booking Window Open' : 'Booking Window Closed'}
            </span>
            <span className="text-rose-200">·</span>
            <span className="font-mono text-amber-300 font-medium">{windowCountdownText}</span>
            <span className="text-rose-200">·</span>
            <span className="font-mono text-rose-200/90 text-[11px]">{formattedTime}</span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-rose-200">
            <Phone className="w-3 h-3 text-rose-300" /> Dining Hotline: +880-921-55100
          </div>
        </div>
      </div>

      {/* 2. Institutional Hero Section with University Emblem */}
      <section className="relative overflow-hidden bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-rose-50 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none opacity-60" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white border border-rose-200 p-1.5 shadow-sm flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/university_projects_550e2ddf.png"
                  alt="Mawlana Bhashani Science & Technology University Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#8b1d24]">
                  Mawlana Bhashani Science and Technology University
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Central Residential Hall Dining Portal
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#8b1d24] font-mono mt-0.5">
                  AmarToken · Digitized Meal Reservation &amp; Dining Hall Management
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Welcome to the centralized hall portal for all 7 residential halls of MBSTU. Boarders can seamlessly purchase subsidized daily <strong>Lunch (৳30)</strong> and <strong>Dinner (৳30)</strong> tokens, authenticate instantly at dining gates via encrypted QR turnstiles, and ensure disciplined, zero-waste university food governance.
            </p>

            {/* Badges / Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-[#8b1d24] rounded-lg font-semibold border border-rose-200">
                <Building2 className="w-3.5 h-3.5 text-[#8b1d24]" />
                7 Residential Halls
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-[#8b1d24] rounded-lg font-semibold border border-rose-200">
                <Utensils className="w-3.5 h-3.5 text-[#8b1d24]" />
                ৳30 Fixed Lunch &amp; Dinner
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-[#8b1d24] rounded-lg font-semibold border border-rose-200">
                <Clock className="w-3.5 h-3.5 text-[#8b1d24]" />
                Booking Window: 6PM – 12AM
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-medium border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Non-Refundable Policy
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToStore}
                className="flex items-center gap-2 px-6 py-3 bg-[#8b1d24] hover:bg-[#70161c] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Enter Meal Store</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {isLoggedIn ? (
                <button
                  onClick={onNavigateToTokens}
                  className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-rose-50 text-[#8b1d24] border-2 border-[#8b1d24] rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#8b1d24]" />
                  <span>View My Tokens</span>
                </button>
              ) : (
                <button
                  onClick={onOpenRegisterModal}
                  className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-rose-50 text-[#8b1d24] border-2 border-[#8b1d24] rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-[#8b1d24]" />
                  <span>Student Login / Register</span>
                </button>
              )}

              <a
                href="#halls-directory"
                className="px-4 py-3 text-slate-600 hover:text-[#8b1d24] text-sm font-medium transition-colors"
              >
                Browse Residential Halls Directory ↓
              </a>
            </div>
          </div>

          {/* Hero Right Quick Status Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/40 rounded-2xl border border-rose-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <span className="text-xs font-bold text-[#8b1d24] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8b1d24]" /> Daily Dining Schedule
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                isBookingWindowOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isBookingWindowOpen ? 'Window Active' : 'Opens at 6:00 PM'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-[#8b1d24]" />
                    Subsidized Lunch
                  </span>
                  <span className="text-xs font-bold text-[#8b1d24] font-mono">৳30.00</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Serving: 12:30 PM – 2:30 PM
                </div>
                <div className="text-[11px] text-[#8b1d24] font-semibold mt-0.5">
                  Cutoff: 12:00 AM Midnight (Strict)
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-[#8b1d24]" />
                    Subsidized Dinner
                  </span>
                  <span className="text-xs font-bold text-[#8b1d24] font-mono">৳30.00</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Serving: 7:30 PM – 9:30 PM
                </div>
                <div className="text-[11px] text-[#8b1d24] font-semibold mt-0.5">
                  Cutoff: 12:00 AM Midnight (Strict)
                </div>
              </div>
            </div>

            <div className="p-3 bg-rose-100/60 rounded-xl text-[11px] text-rose-950 leading-relaxed border border-rose-200/60">
              <span className="font-bold">Booking Rule:</span> Daily tokens are booked between 6:00 PM and 12:00 AM Midnight for the following day. All purchases are non-refundable.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Metrics / Stats Strip (BAUST Style) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">7</div>
            <div className="text-xs text-slate-500 font-medium">Residential Halls (MBSTU)</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">8,500+</div>
            <div className="text-xs text-slate-500 font-medium">Resident Boarders</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">4,800+</div>
            <div className="text-xs text-slate-500 font-medium">Daily Meals Served</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">100%</div>
            <div className="text-xs text-slate-500 font-medium">Automated QR Verification</div>
          </div>
        </div>
      </section>

      {/* 4. Official Notice Board & Circulars (Smooth Moving Marquee Ticker) */}
      <section className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b1d24] animate-pulse" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Official Notice Board &amp; Dining Circulars
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live moving circular ticker · Hover over any notice to pause scrolling or click to inspect full directive
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            {(['ALL', 'DINING', 'POLICY', 'ADMIN'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  sounds.playTabSwitch();
                  setActiveNoticeTab(tab);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeNoticeTab === tab
                    ? 'bg-[#8b1d24] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#8b1d24]'
                }`}
              >
                {tab === 'ALL' && 'All Notices'}
                {tab === 'DINING' && 'Dining & Cutoffs'}
                {tab === 'POLICY' && 'Regulations'}
                {tab === 'ADMIN' && 'Administration'}
              </button>
            ))}
          </div>
        </div>

        {/* Seamless Moving Marquee Carousel (Right to Left) */}
        <div className="relative overflow-hidden w-full py-2">
          {/* Subtle edge fade overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {[...filteredNotices, ...filteredNotices, ...filteredNotices].map((notice, idx) => (
              <div
                key={`${notice.id}-${idx}`}
                onClick={() => handleNoticeClick(notice)}
                className="w-[320px] sm:w-[380px] shrink-0 bg-white rounded-2xl border border-rose-100/90 hover:border-[#8b1d24] p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        notice.isUrgent
                          ? 'bg-[#8b1d24] text-white'
                          : 'bg-rose-100 text-[#8b1d24]'
                      }`}
                    >
                      {notice.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {notice.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#8b1d24] transition-colors line-clamp-2 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {notice.summary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#8b1d24]">
                  <span className="text-[11px] text-slate-400 font-normal">MBSTU Provost Council</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Circular</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-rose-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded ${
                  selectedNotice.isUrgent ? 'bg-[#8b1d24] text-white' : 'bg-rose-100 text-[#8b1d24]'
                }`}
              >
                {selectedNotice.badge}
              </span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono mb-1">{selectedNotice.date}</div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {selectedNotice.title}
              </h3>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 leading-relaxed">
              {selectedNotice.summary}
            </div>
            <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between">
              <span>Provost Council &amp; Dining Hall Directorate</span>
              <span>MBSTU Tangail</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Residential Halls Directory (Gender-Filtered with Micro-Interactions) */}
      <section id="halls-directory" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#8b1d24]" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Residential Halls of MBSTU ({displayedHalls.length} {effectiveGenderFilter !== 'ALL' ? `${effectiveGenderFilter} ` : ''}Halls)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select your residential hall to inspect dining schedules, provost desk, and purchase meal tokens
            </p>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {student?.gender && (
              <button
                onClick={() => {
                  sounds.playTabSwitch();
                  setHallGenderFilter('AUTO');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  hallGenderFilter === 'AUTO'
                    ? 'bg-[#8b1d24] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#8b1d24]'
                }`}
              >
                My Halls ({student.gender})
              </button>
            )}
            <button
              onClick={() => {
                sounds.playTabSwitch();
                setHallGenderFilter('Male');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                hallGenderFilter === 'Male'
                  ? 'bg-[#8b1d24] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#8b1d24]'
              }`}
            >
              Male Halls (4)
            </button>
            <button
              onClick={() => {
                sounds.playTabSwitch();
                setHallGenderFilter('Female');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                hallGenderFilter === 'Female'
                  ? 'bg-[#8b1d24] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#8b1d24]'
              }`}
            >
              Female Halls (3)
            </button>
            <button
              onClick={() => {
                sounds.playTabSwitch();
                setHallGenderFilter('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                hallGenderFilter === 'ALL'
                  ? 'bg-[#8b1d24] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#8b1d24]'
              }`}
            >
              All Halls (7)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedHalls.map(hall => {
            const isUserHall = isLoggedIn && student.hallId === hall.id;
            const isCopied = copiedPhoneHallId === hall.id;

            return (
              <div
                key={hall.id}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg ${
                  isUserHall
                    ? 'border-[#8b1d24] ring-2 ring-rose-100 shadow-md'
                    : 'border-slate-200/90 hover:border-rose-300 shadow-sm'
                }`}
              >
                {/* Hall Card Header */}
                <div className="p-6 border-b border-slate-100 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 bg-rose-100 text-[#8b1d24] text-[10px] font-mono font-bold rounded">
                        {hall.code}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                        {hall.gender} Hall
                      </span>
                      {hall.banglaName && (
                        <span className="ml-1 text-xs text-slate-500 font-normal">
                          {hall.banglaName}
                        </span>
                      )}
                    </div>
                    {isUserHall && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Your Hall
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#8b1d24]">
                    {hall.name}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span>{hall.managerName}</span>
                    </div>

                    {/* Interactive Click-to-Copy Phone with Feedback */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={e => handleCopyPhone(e, hall.id, hall.phone)}
                        title="Click to copy provost phone number"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-[11px] text-slate-600 hover:text-[#8b1d24] border border-slate-200 transition-colors cursor-pointer group/copy"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="font-bold text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Phone className="w-3 h-3 text-[#8b1d24]" />
                            <span className="font-mono">{hall.phone}</span>
                            <Copy className="w-3 h-3 text-slate-400 group-hover/copy:text-[#8b1d24] ml-0.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hall Capacity & Subsidized Rates (Lunch Menu snippet removed) */}
                <div className="p-6 bg-slate-50/60 space-y-3 text-xs flex-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Hall Capacity:</span>
                    <span className="font-semibold text-slate-800">{hall.capacity} Students</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Current Residents:</span>
                    <span className="font-semibold text-slate-800">{hall.currentResidents} Boarders</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                    <span>Daily Meals:</span>
                    <span className="font-bold text-[#8b1d24]">
                      Lunch (৳{hall.lunchPrice || 30}) &amp; Dinner (৳{hall.dinnerPrice || 30})
                    </span>
                  </div>
                </div>

                {/* Hall Action Button */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <button
                    onClick={() => handleHallClick(hall)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8b1d24] hover:bg-[#70161c] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Select Hall &amp; Buy Tokens</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Dining Regulations & Timings Table */}
      <section className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-rose-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Hall Dining Regulations &amp; Operating Timings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rules adopted by the University Hall Directorate for orderly dining operations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-rose-50 text-rose-950 border-b border-rose-200">
                <th className="py-3 px-4 font-bold">Meal Slot</th>
                <th className="py-3 px-4 font-bold">Serving Window</th>
                <th className="py-3 px-4 font-bold">Booking Cutoff Deadline</th>
                <th className="py-3 px-4 font-bold">Subsidized Rate</th>
                <th className="py-3 px-4 font-bold">Cancellation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Lunch</td>
                <td className="py-3.5 px-4 font-medium">12:30 PM – 2:30 PM</td>
                <td className="py-3.5 px-4 text-[#8b1d24] font-bold">12:00 AM Midnight (Opens 6:00 PM)</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">৳30.00</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-rose-100 text-[#8b1d24] rounded font-semibold text-[11px]">
                    Non-Refundable
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Dinner</td>
                <td className="py-3.5 px-4 font-medium">7:30 PM – 9:30 PM</td>
                <td className="py-3.5 px-4 text-[#8b1d24] font-bold">12:00 AM Midnight (Opens 6:00 PM)</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">৳30.00</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-rose-100 text-[#8b1d24] rounded font-semibold text-[11px]">
                    Non-Refundable
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#8b1d24]" /> Dining Hall Decorum Rules
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
              <li>Boarders must form an orderly line at the dining gate turnstiles.</li>
              <li>Students must scan their own valid QR token. Proxy token scans are prohibited.</li>
              <li>Decent and formal attire is mandatory inside the residential dining halls.</li>
              <li>No dining utensils, plates, or glasses may be taken to dormitory rooms.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Non-Refund Policy Guidelines
            </h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
              <li>Token purchases are locked at the 12:00 AM midnight cutoff.</li>
              <li>Ingredients are requisitioned and cooked in proportion to purchased tokens.</li>
              <li>Unredeemed tokens will expire automatically after the dining window closes.</li>
              <li>Refunds will only be sanctioned if a meal service is officially suspended by university order.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Message from the Chairman, Provost Council (Repositioned directly above Emergency Directory) */}
      <section className="bg-gradient-to-br from-[#8b1d24] via-[#70161c] to-[#4a0d12] text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#8b1d24] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
            <div className="w-24 h-24 rounded-2xl bg-white p-2 border-2 border-rose-300 shadow-md overflow-hidden">
              <img
                src="/assets/aistudio/university_projects_550e2ddf.png"
                alt="Provost Council MBSTU"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Prof. Dr. Mahmudul Hasan</h3>
              <p className="text-xs text-rose-200 font-medium">Chairman, Provost Council</p>
              <p className="text-[11px] text-rose-300">Mawlana Bhashani Science and Technology University</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="px-3 py-1 bg-black/30 border border-white/20 text-rose-200 text-xs font-bold rounded-lg uppercase tracking-wider">
              Provost Desk Message
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              Ensuring Nutritious Dining, Discipline &amp; Zero Wastage Across All Halls
            </h4>
            <blockquote className="text-rose-100 text-xs sm:text-sm leading-relaxed italic border-l-2 border-rose-400 pl-4">
              &ldquo;The residential hall dining system at MBSTU is committed to providing high-protein, hygienic, and subsidized meals (৳30 lunch, ৳30 dinner) to every resident student. Through the centralized AmarToken digital platform, we have instituted real-time gate authentication, strict cutoff adherence (6:00 PM – 12:00 AM Midnight for following day), and an uncompromising non-refundable meal token standard that ensures exact kitchen procurement and eliminates food wastage. We urge all boarders to maintain dining hall etiquette, verify their academic emails, and cooperate with hall administration.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* 8. Provost Office & Emergency Administration Contacts Desk */}
      <section className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-rose-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Hall Administration &amp; Emergency Support Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Direct communication channels for accommodation, dining emergencies, and student welfare
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 space-y-1.5">
            <div className="font-bold text-slate-900">Provost Council Office</div>
            <div className="text-slate-600">Administrative Building, 2nd Floor</div>
            <div className="text-[#8b1d24] font-mono font-medium">+880-921-55100</div>
            <div className="text-[11px] text-slate-500">provost.council@mbstu.ac.bd</div>
          </div>

          <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 space-y-1.5">
            <div className="font-bold text-slate-900">Proctor Office (Security)</div>
            <div className="text-slate-600">Main Gate Complex, MBSTU</div>
            <div className="text-[#8b1d24] font-mono font-medium">+880-1711-223344</div>
            <div className="text-[11px] text-slate-500">proctor@mbstu.ac.bd</div>
          </div>

          <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 space-y-1.5">
            <div className="font-bold text-slate-900">University Medical Center</div>
            <div className="text-slate-600">24/7 Ambulance &amp; First Aid</div>
            <div className="text-[#8b1d24] font-mono font-medium">+880-921-55112</div>
            <div className="text-[11px] text-slate-500">medical@mbstu.ac.bd</div>
          </div>

          <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 space-y-1.5">
            <div className="font-bold text-slate-900">ICT &amp; Portal Helpdesk</div>
            <div className="text-slate-600">Academic Building 1, Room 304</div>
            <div className="text-[#8b1d24] font-mono font-medium">+880-921-55200</div>
            <div className="text-[11px] text-slate-500">support.token@mbstu.ac.bd</div>
          </div>
        </div>
      </section>

    </div>
  );
};
