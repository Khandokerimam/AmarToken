import React from 'react';
import {
  Utensils,
  QrCode,
  ShieldCheck,
  ChefHat,
  User,
  LogOut,
  Home,
  Building2,
  ChevronDown,
  SlidersHorizontal,
  Settings
} from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  activeTab: 'home' | 'store' | 'tokens' | 'scanner' | 'kitchen';
  onSelectTab: (tab: 'home' | 'store' | 'tokens' | 'scanner' | 'kitchen') => void;
  student: StudentProfile;
  activeTokenCount: number;
  isLoggedIn: boolean;
  onOpenWalletModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenProfileModal: () => void;
  onLogout: () => void;
  onOpenLoginModal?: () => void;
  onOpenHallEditor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  student,
  activeTokenCount,
  isLoggedIn,
  onOpenWalletModal,
  onOpenRegisterModal,
  onOpenProfileModal,
  onLogout,
  onOpenLoginModal,
  onOpenHallEditor
}) => {
  const role = student.role || 'STUDENT';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones */}
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Zone 1: Single brand wordmark with university emblem logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-red-200 shadow-xs flex items-center justify-center p-0.5 overflow-hidden group-hover:border-red-400 transition-colors">
                <img
                  src="/assets/aistudio/university_projects_550e2ddf.png"
                  alt="Mawlana Bhashani Science & Technology University Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-[#8b1d24] group-hover:text-red-900 transition-colors leading-tight">
                  AmarToken
                </span>
                <span className="text-[10px] font-bold tracking-wider text-amber-600 uppercase leading-none mt-0.5">
                  MEAL MANAGEMENT
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Strictly filtered by User Role) */}
          {isLoggedIn ? (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {/* Home is visible to all authenticated roles */}
              <button
                onClick={() => onSelectTab('home')}
                className={`flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === 'home'
                    ? 'border-red-700 text-red-700 font-bold'
                    : 'border-transparent text-slate-600 hover:text-red-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              {/* STUDENT ONLY: Meal Store & My Tokens */}
              {role === 'STUDENT' && (
                <>
                  <button
                    onClick={() => onSelectTab('store')}
                    className={`flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === 'store'
                        ? 'border-red-700 text-red-700 font-bold'
                        : 'border-transparent text-slate-600 hover:text-red-700'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Meal Store</span>
                  </button>

                  <button
                    onClick={() => onSelectTab('tokens')}
                    className={`flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === 'tokens'
                        ? 'border-red-700 text-red-700 font-bold'
                        : 'border-transparent text-slate-600 hover:text-red-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>My Tokens</span>
                    {activeTokenCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-red-100 text-red-800 text-xs font-bold rounded">
                        {activeTokenCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* STAFF & ADMIN: Gate Scanner & Kitchen */}
              {(role === 'STAFF' || role === 'ADMIN') && (
                <>
                  <button
                    onClick={() => onSelectTab('scanner')}
                    className={`flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === 'scanner'
                        ? 'border-red-700 text-red-700 font-bold'
                        : 'border-transparent text-slate-600 hover:text-red-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Gate Scanner</span>
                  </button>

                  <button
                    onClick={() => onSelectTab('kitchen')}
                    className={`flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === 'kitchen'
                        ? 'border-red-700 text-red-700 font-bold'
                        : 'border-transparent text-slate-600 hover:text-red-700'
                    }`}
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>Kitchen</span>
                  </button>
                </>
              )}

              {/* ADMIN ONLY: Hall Credentials Management trigger */}
              {role === 'ADMIN' && onOpenHallEditor && (
                <button
                  onClick={onOpenHallEditor}
                  className="flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors text-amber-700 hover:text-amber-900 font-bold border-b-2 border-transparent hover:border-amber-500"
                  title="Configure Hall Credentials & Meal Rates"
                >
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Hall Management</span>
                </button>
              )}
            </nav>
          ) : (
            <div className="flex-1" />
          )}

          {/* Zone 3: Profile & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isLoggedIn ? (
              <>
                {/* Profile Button with Role Badge (Opens Profile Modal) */}
                <button
                  onClick={onOpenProfileModal}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50 hover:bg-red-100/80 text-slate-800 border border-red-200 rounded-xl transition-all cursor-pointer group"
                  title="View & Edit Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-700 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                    {student.idCardPhotoUrl ? (
                      <img
                        src={student.idCardPhotoUrl}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      student.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                    )}
                  </div>
                  
                  <div className="hidden lg:flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[110px] leading-tight">
                        {student.name}
                      </span>
                      {/* Institutional Role Badge */}
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border tracking-wide leading-none ${
                        role === 'ADMIN'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : role === 'STAFF'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-rose-100 text-[#8b1d24] border-rose-200'
                      }`}>
                        {role}
                      </span>
                    </div>
                    <span className="text-[10px] text-red-700 font-medium leading-tight mt-0.5">
                      {role === 'ADMIN' ? 'Provost' : role === 'STAFF' ? 'Dining Staff' : student.roomNumber.split(' ')[0]} · {student.hallId.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700 transition-colors hidden sm:inline" />
                </button>

                {/* Direct Logout Option in Header */}
                <button
                  onClick={onLogout}
                  className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Log out and return to Homepage"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              /* If Logged Out: Simple "Log in" link and primary crimson "Get Started" button */
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={onOpenLoginModal || onOpenRegisterModal}
                  className="text-sm font-semibold text-slate-700 hover:text-[#8b1d24] transition-colors cursor-pointer px-2 py-1.5"
                >
                  Log in
                </button>
                <button
                  onClick={onOpenRegisterModal}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-[#8b1d24] hover:bg-[#73181e] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar for narrow screens (Strictly Role-Filtered) */}
        {isLoggedIn && (
          <div className="flex md:hidden items-center justify-around py-2 border-t border-red-100 text-xs font-medium text-slate-600 overflow-x-auto">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-2 py-1 whitespace-nowrap ${activeTab === 'home' ? 'text-red-700 font-bold' : ''}`}
            >
              Home
            </button>

            {role === 'STUDENT' && (
              <>
                <button
                  onClick={() => onSelectTab('store')}
                  className={`px-2 py-1 whitespace-nowrap ${activeTab === 'store' ? 'text-red-700 font-bold' : ''}`}
                >
                  Store
                </button>
                <button
                  onClick={() => onSelectTab('tokens')}
                  className={`px-2 py-1 whitespace-nowrap ${activeTab === 'tokens' ? 'text-red-700 font-bold' : ''}`}
                >
                  Tokens ({activeTokenCount})
                </button>
              </>
            )}

            {(role === 'STAFF' || role === 'ADMIN') && (
              <>
                <button
                  onClick={() => onSelectTab('scanner')}
                  className={`px-2 py-1 whitespace-nowrap ${activeTab === 'scanner' ? 'text-red-700 font-bold' : ''}`}
                >
                  Gate Scanner
                </button>
                <button
                  onClick={() => onSelectTab('kitchen')}
                  className={`px-2 py-1 whitespace-nowrap ${activeTab === 'kitchen' ? 'text-red-700 font-bold' : ''}`}
                >
                  Kitchen
                </button>
              </>
            )}

            {role === 'ADMIN' && onOpenHallEditor && (
              <button
                onClick={onOpenHallEditor}
                className="px-2 py-1 whitespace-nowrap text-amber-700 font-bold"
              >
                Hall Admin
              </button>
            )}

            <button
              onClick={onOpenProfileModal}
              className="px-2 py-1 whitespace-nowrap text-red-700 font-semibold flex items-center gap-1"
            >
              <User className="w-3 h-3" /> Profile
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
