import React from 'react';
import {
  Wallet,
  Utensils,
  QrCode,
  ShieldCheck,
  ChefHat,
  Plus,
  User,
  UserCheck,
  LogOut,
  Home,
  Building2,
  ChevronDown
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
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones separated by gap-8 */}
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
              <div>
                <span className="text-lg font-extrabold tracking-tight text-red-800 group-hover:text-red-900 transition-colors whitespace-nowrap">
                  AmarToken
                </span>
                <span className="hidden sm:inline text-xs text-slate-500 ml-1.5 font-normal">
                  MBSTU Dining
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
              <span>Kitchen &amp; Provost</span>
            </button>
          </nav>

          {/* Zone 3: Profile & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isLoggedIn ? (
              <>
                {/* Student Profile Button (Opens Profile Modal) */}
                <button
                  onClick={onOpenProfileModal}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50 hover:bg-red-100/80 text-slate-800 border border-red-200 rounded-xl transition-all cursor-pointer group"
                  title="View & Edit Student Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-700 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                    {student.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[110px] leading-tight">
                      {student.name}
                    </span>
                    <span className="text-[10px] text-red-700 font-medium leading-tight">
                      {student.roomNumber.split(' ')[0]} · {student.hallId.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700 transition-colors hidden sm:inline" />
                </button>

                {/* Wallet Balance */}
                <button
                  onClick={onOpenWalletModal}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  title="Click to recharge wallet"
                >
                  <Wallet className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline text-red-100">Balance:</span>
                  <span className="font-mono font-bold tabular-nums">
                    ৳{student.walletBalance.toFixed(0)}
                  </span>
                  <Plus className="w-3 h-3 text-red-200 ml-0.5" />
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
              /* If Logged Out */
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenRegisterModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar for narrow screens */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-red-100 text-xs font-medium text-slate-600 overflow-x-auto">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'home' ? 'text-red-700 font-bold' : ''}`}
          >
            Home
          </button>
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
          <button
            onClick={() => onSelectTab('scanner')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'scanner' ? 'text-red-700 font-bold' : ''}`}
          >
            Gate
          </button>
          <button
            onClick={() => onSelectTab('kitchen')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'kitchen' ? 'text-red-700 font-bold' : ''}`}
          >
            Kitchen
          </button>
          {isLoggedIn ? (
            <button
              onClick={onOpenProfileModal}
              className="px-2 py-1 whitespace-nowrap text-red-700 font-semibold flex items-center gap-1"
            >
              <User className="w-3 h-3" /> Profile
            </button>
          ) : (
            <button
              onClick={onOpenRegisterModal}
              className="px-2 py-1 whitespace-nowrap text-red-700 font-semibold"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
