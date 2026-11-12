/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UNIVERSITY_HALLS,
  INITIAL_STUDENT,
  INITIAL_TOKENS,
  INITIAL_TRANSACTIONS
} from './data/hallsData';
import {
  ResidentialHall,
  StudentProfile,
  MealToken,
  WalletTransaction,
  MealSlot,
  MealSchedule,
  DietaryType
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'store' | 'tokens' | 'scanner' | 'kitchen'>('home');
  const [halls, setHalls] = useState<ResidentialHall[]>(UNIVERSITY_HALLS);
  const [selectedHall, setSelectedHall] = useState<ResidentialHall>(UNIVERSITY_HALLS[5]); // Shaheed Abrar Fahad Hall
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [tokens, setTokens] = useState<MealToken[]>(INITIAL_TOKENS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  // Student Registration Handler
  const handleRegisterStudent = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    setIsLoggedIn(true);
    const registeredHall = halls.find(h => h.id === newProfile.hallId);
    if (registeredHall) {
      setSelectedHall(registeredHall);
    }
    setActiveTab('store');
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
            setIsRegisterModalOpen(true);
          } else {
            setIsWalletModalOpen(true);
          }
        }}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
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
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
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
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
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
          />
        )}
      </main>

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
        currentStudent={student}
      />

      {/* Student Wallet Recharge Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        student={student}
        transactions={transactions}
        onTopUp={handleTopUp}
      />

      {/* University Footer in Crimson and White */}
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
            University Residential Hall Meal Token Management System
          </div>
        </div>
      </footer>
    </div>
  );
}
