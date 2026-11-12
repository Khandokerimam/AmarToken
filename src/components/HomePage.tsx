import React, { useState } from 'react';
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
  Layers
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
    title: 'Strict Observance of Daily Meal Token Cutoff Deadlines',
    date: 'November 12, 2026',
    summary:
      'All resident boarders are notified that Lunch token booking closes strictly at 10:30 AM and Dinner token booking closes strictly at 5:00 PM. No manual or offline token requests will be entertained after these deadlines.',
    badge: 'Critical Deadline',
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
    title: 'Academic Email Verification for Subsidized Hall Dining Rates',
    date: 'November 05, 2026',
    summary:
      'MBSTU subsidized dining rates (৳65 for Lunch, ৳60 for Dinner) are exclusively applicable to enrolled students registered with verified @mbstu.ac.bd academic accounts.',
    badge: 'Eligibility',
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
  student
}) => {
  const [activeNoticeTab, setActiveNoticeTab] = useState<'ALL' | 'DINING' | 'POLICY' | 'ADMIN'>('ALL');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

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

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Institutional Hotline & Marquee Strip (BAUST Style) */}
      <div className="bg-red-800 text-white text-xs px-4 py-2.5 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 border border-red-700">
        <div className="flex items-center gap-2 overflow-hidden w-full md:w-auto">
          <span className="px-2 py-0.5 bg-red-950 font-bold rounded text-[10px] uppercase tracking-wider text-red-200 shrink-0">
            Official Bulletin
          </span>
          <p className="truncate text-red-100 font-medium">
            Daily Lunch booking cutoff: <strong className="text-white">10:30 AM</strong> · Dinner booking cutoff: <strong className="text-white">5:00 PM</strong> · Strict Non-Refundable Token Policy Enforced.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-red-200 shrink-0">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-red-300" /> Dining Hotline: +880-921-55100
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">MBSTU, Santosh, Tangail-1902</span>
        </div>
      </div>

      {/* 2. Institutional Hero Section with University Emblem (BAUST Layout) */}
      <section className="relative overflow-hidden bg-white rounded-3xl border border-red-100 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-red-50 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none opacity-60" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white border border-red-200 p-1.5 shadow-sm flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/university_projects_550e2ddf.png"
                  alt="Mawlana Bhashani Science & Technology University Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-700">
                  Mawlana Bhashani Science and Technology University
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Central Residential Hall Dining Portal
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-red-800 font-mono mt-0.5">
                  AmarToken · Digitized Meal Reservation &amp; Dining Hall Management
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Welcome to the centralized hall portal for all 7 residential halls of MBSTU. Boarders can seamlessly purchase subsidized daily <strong>Lunch</strong> and <strong>Dinner</strong> tokens, authenticate instantly at dining gates via encrypted QR turnstiles, and ensure disciplined, zero-waste university food governance.
            </p>

            {/* Badges / Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-800 rounded-lg font-semibold border border-red-200">
                <Building2 className="w-3.5 h-3.5 text-red-700" />
                7 Residential Halls
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-800 rounded-lg font-semibold border border-red-200">
                <Utensils className="w-3.5 h-3.5 text-red-700" />
                2 Meals (Lunch &amp; Dinner)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-800 rounded-lg font-semibold border border-red-200">
                <QrCode className="w-3.5 h-3.5 text-red-700" />
                Digital QR Gate Pass
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
                className="flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Enter Meal Store</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {isLoggedIn ? (
                <button
                  onClick={onNavigateToTokens}
                  className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-red-50 text-red-800 border-2 border-red-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-red-700" />
                  <span>View My Tokens</span>
                </button>
              ) : (
                <button
                  onClick={onOpenRegisterModal}
                  className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-red-50 text-red-800 border-2 border-red-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-red-700" />
                  <span>Student Login / Register</span>
                </button>
              )}

              <a
                href="#halls-directory"
                className="px-4 py-3 text-slate-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Browse 7 Halls Directory ↓
              </a>
            </div>
          </div>

          {/* Hero Right Quick Status Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-red-50/80 via-white to-red-50/40 rounded-2xl border border-red-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <span className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-700" /> Dining Schedule
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                Active Today
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-red-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-red-700" />
                    Subsidized Lunch
                  </span>
                  <span className="text-xs font-bold text-red-700 font-mono">৳65.00</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Serving: 12:30 PM – 2:30 PM
                </div>
                <div className="text-[11px] text-red-700 font-semibold mt-0.5">
                  Cutoff: 10:30 AM (Strict)
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-red-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-red-700" />
                    Subsidized Dinner
                  </span>
                  <span className="text-xs font-bold text-red-700 font-mono">৳60.00</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Serving: 7:30 PM – 9:30 PM
                </div>
                <div className="text-[11px] text-red-700 font-semibold mt-0.5">
                  Cutoff: 5:00 PM (Strict)
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-100/60 rounded-xl text-[11px] text-red-900 leading-relaxed border border-red-200/60">
              <span className="font-bold">Notice:</span> No meal cancellations or refund requests will be accepted once confirmed.
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

      {/* 4. Official Notice Board & Circulars Section (BAUST Style) */}
      <section className="bg-white rounded-3xl border border-red-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-700" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Official Notice Board &amp; Dining Circulars
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Important administrative directives, dining schedules, and provost council notices
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['ALL', 'DINING', 'POLICY', 'ADMIN'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  sounds.playTabSwitch();
                  setActiveNoticeTab(tab);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeNoticeTab === tab
                    ? 'bg-red-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-red-700'
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

        {/* Notices List */}
        <div className="divide-y divide-slate-100 mt-4">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              onClick={() => handleNoticeClick(notice)}
              className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:bg-red-50/40 px-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-700 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        notice.isUrgent
                          ? 'bg-red-700 text-white'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {notice.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {notice.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors mt-1">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {notice.summary}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-red-700 group-hover:translate-x-1 transition-transform self-end sm:self-center">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-red-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded ${
                  selectedNotice.isUrgent ? 'bg-red-700 text-white' : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedNotice.badge}
              </span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
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

      {/* 5. Residential Halls Directory (All 7 MBSTU Halls) */}
      <section id="halls-directory" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-700" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Residential Halls of MBSTU (7 Halls)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select your residential hall to inspect dining schedules, provost desk, and purchase meal tokens
            </p>
          </div>
          <span className="text-xs font-semibold text-red-700">
            Total Capacity: 8,500 Boarders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall, idx) => {
            const isUserHall = isLoggedIn && student.hallId === hall.id;
            return (
              <div
                key={hall.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between hover:shadow-md ${
                  isUserHall
                    ? 'border-red-600 ring-2 ring-red-100 shadow-sm'
                    : 'border-slate-200 hover:border-red-300'
                }`}
              >
                {/* Hall Card Header */}
                <div className="p-5 border-b border-slate-100 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-mono font-bold rounded">
                        {hall.code}
                      </span>
                      {hall.banglaName && (
                        <span className="ml-2 text-xs text-slate-500 font-normal">
                          {hall.banglaName}
                        </span>
                      )}
                    </div>
                    {isUserHall && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Your Hall
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700">
                    {hall.name}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="font-semibold">{hall.managerName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Phone className="w-3 h-3 text-red-600" /> {hall.phone}
                    </div>
                  </div>
                </div>

                {/* Hall Capacity & Meals Info */}
                <div className="p-5 bg-slate-50/60 space-y-3 text-xs flex-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Hall Capacity:</span>
                    <span className="font-semibold text-slate-800">{hall.capacity} Students</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Current Residents:</span>
                    <span className="font-semibold text-slate-800">{hall.currentResidents} Boarders</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Daily Meals:</span>
                    <span className="font-semibold text-red-800">Lunch (৳65) &amp; Dinner (৳60)</span>
                  </div>

                  {/* Lunch Menu Snippet */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">Today&apos;s Lunch: </span>
                    {hall.diningSchedule[0]?.menu?.name || 'Subsidized University Lunch'}
                  </div>
                </div>

                {/* Hall Action Button */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <button
                    onClick={() => handleHallClick(hall)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
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

      {/* 6. Message from the Chairman, Provost Council (BAUST Style) */}
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-red-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
            <div className="w-24 h-24 rounded-2xl bg-white p-2 border-2 border-red-300 shadow-md overflow-hidden">
              <img
                src="/assets/aistudio/university_projects_550e2ddf.png"
                alt="Provost Council MBSTU"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Prof. Dr. Mahmudul Hasan</h3>
              <p className="text-xs text-red-200 font-medium">Chairman, Provost Council</p>
              <p className="text-[11px] text-red-300">Mawlana Bhashani Science and Technology University</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="px-3 py-1 bg-red-950/70 border border-red-300/30 text-red-200 text-xs font-bold rounded-lg uppercase tracking-wider">
              Provost Desk Message
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              Ensuring Nutritious Dining, Discipline &amp; Zero Wastage Across All Halls
            </h4>
            <blockquote className="text-red-100 text-xs sm:text-sm leading-relaxed italic border-l-2 border-red-400 pl-4">
              &ldquo;The residential hall dining system at MBSTU is committed to providing high-protein, hygienic, and subsidized meals to every resident student. Through the centralized AmarToken digital platform, we have instituted real-time gate authentication, strict cutoff adherence (10:30 AM for lunch, 5:00 PM for dinner), and an uncompromising non-refundable meal token standard that ensures exact kitchen procurement and eliminates food wastage. We urge all boarders to maintain dining hall etiquette, verify their academic emails, and cooperate with hall administration.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* 7. Facilities & Key Highlights Grid (BAUST Style) */}
      <section className="bg-white rounded-3xl border border-red-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-red-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Hall Dining Facilities &amp; System Features
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Modernized residential infrastructure supporting balanced nutrition and transparent hall administration
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">2 Subsidized Daily Meals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized, nutritious Lunch (৳65) and Dinner (৳60) menu with chicken roast, river fish curry, polao, lentil soup, and fresh greens.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Digital QR Gate Scanners</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast, fraud-proof turnstile entry. Tokens are cryptographically validated to guarantee single-use redemption and prevent proxy theft.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Student Dining Wallet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct digital top-ups via bKash, Nagad, debit cards, or hall office cash deposits. Instant 1-click token purchases.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Zero Food Waste Policy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict non-refundable token governance ensures kitchen head chefs cook the exact quantity required, minimizing institutional food waste.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">RO Water &amp; Steam Kitchen</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Each residential hall is equipped with multi-stage Reverse Osmosis drinking water plants and stainless steel commercial steam cookers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">24/7 Caretaker &amp; Emergency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated hall dining caretakers and on-call university medical center support for boarders experiencing sudden health issues.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Dining Regulations & Timings Table */}
      <section className="bg-white rounded-3xl border border-red-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-red-100 pb-4">
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
              <tr className="bg-red-50 text-red-900 border-b border-red-200">
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
                <td className="py-3.5 px-4 text-red-700 font-bold">10:30 AM (Morning)</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">৳65.00</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold text-[11px]">
                    Non-Refundable
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Dinner</td>
                <td className="py-3.5 px-4 font-medium">7:30 PM – 9:30 PM</td>
                <td className="py-3.5 px-4 text-red-700 font-bold">5:00 PM (Afternoon)</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">৳60.00</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold text-[11px]">
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
              <AlertTriangle className="w-4 h-4 text-red-700" /> Dining Hall Decorum Rules
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
              <li>Token purchases are locked at the respective cutoff hour.</li>
              <li>Ingredients are requisitioned and cooked in proportion to purchased tokens.</li>
              <li>Unredeemed tokens will expire automatically after the dining window closes.</li>
              <li>Refunds will only be sanctioned if a meal service is officially suspended by university order.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Provost Office & Emergency Administration Contacts Desk */}
      <section className="bg-white rounded-3xl border border-red-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-red-100 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Hall Administration &amp; Emergency Support Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Direct communication channels for accommodation, dining emergencies, and student welfare
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-red-50/40 rounded-xl border border-red-100 space-y-1.5">
            <div className="font-bold text-slate-900">Provost Council Office</div>
            <div className="text-slate-600">Administrative Building, 2nd Floor</div>
            <div className="text-red-700 font-mono font-medium">+880-921-55100</div>
            <div className="text-[11px] text-slate-500">provost.council@mbstu.ac.bd</div>
          </div>

          <div className="p-4 bg-red-50/40 rounded-xl border border-red-100 space-y-1.5">
            <div className="font-bold text-slate-900">Proctor Office (Security)</div>
            <div className="text-slate-600">Main Gate Complex, MBSTU</div>
            <div className="text-red-700 font-mono font-medium">+880-1711-223344</div>
            <div className="text-[11px] text-slate-500">proctor@mbstu.ac.bd</div>
          </div>

          <div className="p-4 bg-red-50/40 rounded-xl border border-red-100 space-y-1.5">
            <div className="font-bold text-slate-900">University Medical Center</div>
            <div className="text-slate-600">24/7 Ambulance &amp; First Aid</div>
            <div className="text-red-700 font-mono font-medium">+880-921-55112</div>
            <div className="text-[11px] text-slate-500">medical@mbstu.ac.bd</div>
          </div>

          <div className="p-4 bg-red-50/40 rounded-xl border border-red-100 space-y-1.5">
            <div className="font-bold text-slate-900">ICT &amp; Portal Helpdesk</div>
            <div className="text-slate-600">Academic Building 1, Room 304</div>
            <div className="text-red-700 font-mono font-medium">+880-921-55200</div>
            <div className="text-[11px] text-slate-500">support.token@mbstu.ac.bd</div>
          </div>
        </div>
      </section>

    </div>
  );
};
