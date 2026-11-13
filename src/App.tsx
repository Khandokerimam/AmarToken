/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UNIVERSITY_HALLS,
  INITIAL_STUDENT,
  INITIAL_TOKENS,
  INITIAL_TRANSACTIONS,
  DEMO_ACCOUNTS
} from './data/hallsData';
import {
  ResidentialHall,
  StudentProfile,
  MealToken,
  WalletTransaction,
  MealSlot,
  MealSchedule,
  DietaryType,
  UserRole
} from './types';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { StudentPortal } from './components/StudentPortal';
import { TokenVault } from './components/TokenVault';
import { StaffScanner } from './components/StaffScanner';
import { ManagerKitchenPanel } from './components/ManagerKitchenPanel';
import { WalletModal } from './components/WalletModal';
import { RegisterModal } from './components/RegisterModal';
import { ProfileModal } from './components/ProfileModal';
import { AdminHallEditorModal } from './components/AdminHallEditorModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'store' | 'tokens' | 'scanner' | 'kitchen'>('home');
  
  // Halls state with localStorage persistence
  const [halls, setHalls] = useState<ResidentialHall[]>(() => {
    try {
      const saved = localStorage.getItem('amartoken_halls');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return UNIVERSITY_HALLS;
  });

  const [selectedHall, setSelectedHall] = useState<ResidentialHall>(() => halls[5] || UNIVERSITY_HALLS[5]); // Shaheed Abrar Fahad Hall
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [tokens, setTokens] = useState<MealToken[]>(INITIAL_TOKENS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerModalMode, setRegisterModalMode] = useState<'login' | 'register'>('register');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminHallEditorOpen, setIsAdminHallEditorOpen] = useState(false);

  // Multi-account state with localStorage persistence & seeded demo accounts
  const [registeredAccounts, setRegisteredAccounts] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('amartoken_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const emails = new Set(parsed.map((a: any) => a.academicEmail?.toLowerCase()));
          const merged = [...parsed];
          DEMO_ACCOUNTS.forEach(demo => {
            if (!emails.has(demo.academicEmail.toLowerCase())) {
              merged.push(demo);
            }
          });
          return merged;
        }
      }
    } catch {}
    return DEMO_ACCOUNTS;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('amartoken_accounts', JSON.stringify(registeredAccounts));
    } catch {}
  }, [registeredAccounts]);

  // Save halls to localStorage whenever updated
  React.useEffect(() => {
    try {
      localStorage.setItem('amartoken_halls', JSON.stringify(halls));
    } catch {}
  }, [halls]);

  // RBAC Route Guard: ensure students cannot open staff/kitchen tabs, and staff/admin cannot open student booking tabs
  React.useEffect(() => {
    if (isLoggedIn) {
      const role = student.role || 'STUDENT';
      if (role === 'STUDENT' && (activeTab === 'scanner' || activeTab === 'kitchen')) {
        setActiveTab('home');
      } else if ((role === 'STAFF' || role === 'ADMIN') && (activeTab === 'store' || activeTab === 'tokens')) {
        setActiveTab('home');
      }
    }
  }, [isLoggedIn, student.role, activeTab]);

  // Update Hall Credentials from Admin Editor Modal
  const handleUpdateHall = (updatedHall: ResidentialHall) => {
    setHalls(prev => prev.map(h => (h.id === updatedHall.id ? updatedHall : h)));
    if (selectedHall.id === updatedHall.id) {
      setSelectedHall(updatedHall);
    }
  };

  // Modal triggers for login vs register
  const handleOpenRegister = () => {
    setRegisterModalMode('register');
    setIsRegisterModalOpen(true);
  };

  const handleOpenLogin = () => {
    setRegisterModalMode('login');
    setIsRegisterModalOpen(true);
  };

  // Active token count for badge
  const activeTokenCount = tokens.filter(t => t.status === 'ACTIVE').length;

  // Logout Handler (switches to Homepage)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileModalOpen(false);
    setActiveTab('home');
  };

  // Student Profile Update Handler
  const handleUpdateProfile = (updatedProfile: StudentProfile) => {
    setStudent(updatedProfile);
    setRegisteredAccounts(prev =>
      prev.map(acc =>
        acc.academicEmail.toLowerCase() === updatedProfile.academicEmail.toLowerCase()
          ? updatedProfile
          : acc
      )
    );
    const registeredHall = halls.find(h => h.id === updatedProfile.hallId);
    if (registeredHall) {
      setSelectedHall(registeredHall);
    }
  };

  // Hall Selection and Navigation from Homepage
  const handleSelectHallAndNavigate = (hall: ResidentialHall) => {
    setSelectedHall(hall);
    setActiveTab('store');
  };

  // Purchase Token Handler
  const handlePurchaseToken = (
    mealSlot: MealSlot,
    mealSchedule: MealSchedule,
    dietary: DietaryType,
    paymentMethod: string
  ): boolean => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tokenSeq = Math.floor(1000 + Math.random() * 9000);
    const tokenNumber = `${selectedHall.code}-${todayStr.replace(/-/g, '')}-${mealSlot[0]}-${tokenSeq}`;

    // Cryptographic hash simulation
    const hash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newToken: MealToken = {
      id: `tok-${Date.now()}-${Math.random()}`,
      tokenNumber,
      studentId: student.studentId,
      studentName: student.name,
      academicEmail: student.academicEmail,
      hallId: selectedHall.id,
      hallName: selectedHall.name,
      roomNumber: student.roomNumber,
      mealSlot,
      mealDate: todayStr,
      menuName: mealSchedule.menu.name,
      dietaryType: dietary,
      price: mealSchedule.price,
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
      verificationHash: hash
    };

    // Deduct from wallet if wallet payment
    if (paymentMethod === 'WALLET') {
      setStudent(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - mealSchedule.price
      }));
    }

    // Add transaction ledger entry
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: 'TOKEN_PURCHASE',
      amount: -mealSchedule.price,
      description: `Purchased ${mealSlot} Token (${tokenNumber})`,
      referenceId: newToken.id,
      paymentMethod: paymentMethod as any
    };

    setTokens(prev => [newToken, ...prev]);
    setTransactions(prev => [newTx, ...prev]);

    return true;
  };

  // Staff Gate Scanner Redemption
  const handleRedeemToken = (
    tokenNumber: string,
    staffName: string
  ): { success: boolean; reason: string; message: string; token?: MealToken } => {
    const foundToken = tokens.find(
      t => t.tokenNumber.toUpperCase() === tokenNumber.toUpperCase()
    );

    if (!foundToken) {
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: `Token #${tokenNumber} was not found in MBSTU records!`
      };
    }

    // Check Hall match
    if (foundToken.hallId.toLowerCase() !== selectedHall.id.toLowerCase()) {
      return {
        success: false,
        reason: 'WRONG_HALL',
        message: `Cross-Hall Denied! Token was issued for "${foundToken.hallName}", but this gate is "${selectedHall.name}".`,
        token: foundToken
      };
    }

    // Anti double-spend check
    if (foundToken.status === 'REDEEMED') {
      return {
        success: false,
        reason: 'ALREADY_REDEEMED',
        message: `FRAUD ALERT! Token was already redeemed on ${
          foundToken.redeemedAt
            ? new Date(foundToken.redeemedAt).toLocaleTimeString()
            : 'earlier today'
        }!`,
        token: foundToken
      };
    }

    // Success: atomically redeem token
    const nowIso = new Date().toISOString();
    setTokens(prev =>
      prev.map(t =>
        t.id === foundToken.id
          ? {
              ...t,
              status: 'REDEEMED',
              redeemedAt: nowIso,
              redemptionStaff: staffName
            }
          : t
      )
    );

    return {
      success: true,
      reason: 'APPROVED',
      message: `MEAL APPROVED: Admit ${foundToken.studentName} (${foundToken.roomNumber})`,
      token: {
        ...foundToken,
        status: 'REDEEMED',
        redeemedAt: nowIso,
        redemptionStaff: staffName
      }
    };
  };

  // Wallet Top-Up Handler
  const handleTopUp = (
    amount: number,
    method: 'BKASH' | 'NAGAD' | 'STUDENT_WALLET' | 'BANK_CARD' | 'HALL_OFFICE_CASH'
  ) => {
    setStudent(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: 'TOPUP',
      amount,
      description: `Wallet Recharge via ${method}`,
      paymentMethod: method
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Student & Staff Registration Handler
  const handleRegisterStudent = (newProfile: StudentProfile) => {
    setRegisteredAccounts(prev => {
      const existingIdx = prev.findIndex(
        acc => acc.academicEmail.toLowerCase() === newProfile.academicEmail.toLowerCase()
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newProfile;
        return copy;
      }
      return [...prev, newProfile];
    });
    setStudent(newProfile);
    setIsLoggedIn(true);
    const registeredHall = halls.find(h => h.id === newProfile.hallId);
    if (registeredHall) {
      setSelectedHall(registeredHall);
    }
    const role = newProfile.role || 'STUDENT';
    if (role === 'STUDENT') {
      setActiveTab('store');
    } else if (role === 'STAFF') {
      setActiveTab('scanner');
    } else {
      setActiveTab('kitchen');
    }
  };

  // Student & Staff Login Handler
  const handleLoginStudent = (profile: StudentProfile) => {
    setStudent(profile);
    setIsLoggedIn(true);
    const registeredHall = halls.find(h => h.id === profile.hallId);
    if (registeredHall) {
      setSelectedHall(registeredHall);
    }
    const role = profile.role || 'STUDENT';
    if (role === 'STUDENT') {
      setActiveTab('store');
    } else if (role === 'STAFF') {
      setActiveTab('scanner');
    } else {
      setActiveTab('kitchen');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-100 selection:text-red-900">
      {/* Top Bar Header with MBSTU Logo, Red Theme & Profile Section */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        student={student}
        activeTokenCount={activeTokenCount}
        isLoggedIn={isLoggedIn}
        onOpenWalletModal={() => {
          if (!isLoggedIn) {
            handleOpenRegister();
          } else {
            setIsWalletModalOpen(true);
          }
        }}
        onOpenRegisterModal={handleOpenRegister}
        onOpenLoginModal={handleOpenLogin}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        onOpenHallEditor={() => setIsAdminHallEditorOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <HomePage
            halls={halls}
            onSelectHallAndNavigate={handleSelectHallAndNavigate}
            onNavigateToStore={() => {
              if (!isLoggedIn) {
                setIsLoggedIn(true);
              }
              setActiveTab('store');
            }}
            onNavigateToTokens={() => {
              if (!isLoggedIn) {
                setIsLoggedIn(true);
              }
              setActiveTab('tokens');
            }}
            onOpenRegisterModal={handleOpenRegister}
            onOpenLoginModal={handleOpenLogin}
            isLoggedIn={isLoggedIn}
            student={student}
          />
        )}

        {activeTab === 'store' && (
          <StudentPortal
            halls={halls}
            selectedHall={selectedHall}
            onSelectHall={setSelectedHall}
            student={student}
            onPurchaseToken={handlePurchaseToken}
            onOpenWalletModal={() => setIsWalletModalOpen(true)}
            onOpenRegisterModal={handleOpenRegister}
          />
        )}

        {activeTab === 'tokens' && (
          <TokenVault
            tokens={tokens}
            onSimulateGateScan={tokenNum => {
              setActiveTab('scanner');
              setTimeout(() => {
                handleRedeemToken(tokenNum, `Gate Attendant (${selectedHall.code})`);
              }, 150);
            }}
            onNavigateToStore={() => setActiveTab('store')}
          />
        )}

        {activeTab === 'scanner' && (
          <StaffScanner
            hall={selectedHall}
            tokens={tokens}
            onRedeemToken={handleRedeemToken}
          />
        )}

        {activeTab === 'kitchen' && (
          <ManagerKitchenPanel
            hall={selectedHall}
            tokens={tokens}
            userRole={student.role || 'STUDENT'}
            onOpenHallEditor={() => setIsAdminHallEditorOpen(true)}
          />
        )}
      </main>

      {/* Admin Hall Credentials & Rates Editor Modal */}
      <AdminHallEditorModal
        isOpen={isAdminHallEditorOpen}
        onClose={() => setIsAdminHallEditorOpen(false)}
        hall={selectedHall}
        allHalls={halls}
        onSaveHall={handleUpdateHall}
        userRole={student.role}
      />

      {/* Student Profile & Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={student}
        halls={halls}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Student Academic Registration Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        halls={halls}
        onRegisterStudent={handleRegisterStudent}
        onLoginStudent={handleLoginStudent}
        currentStudent={student}
        initialMode={registerModalMode}
        registeredAccounts={registeredAccounts}
      />

      {/* Student Wallet Recharge Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        student={student}
        transactions={transactions}
        onTopUp={handleTopUp}
      />

      {/* University Footer in Crimson and White (only rendered for logged-in app experience) */}
      {isLoggedIn && (
        <footer className="border-t border-red-100 bg-white py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/university_projects_550e2ddf.png"
                alt="MBSTU Logo"
                className="w-5 h-5 object-contain"
              />
              <span className="font-bold text-[#8b1d24]">AmarToken</span>
              <span aria-hidden="true">·</span>
              <span>Mawlana Bhashani Science &amp; Technology University</span>
            </div>
            <div className="text-[11px] text-slate-400">
              University Residential Hall Meal Token Management System
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
