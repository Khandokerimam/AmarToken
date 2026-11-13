/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UNIVERSITY_HALLS,
  INITIAL_STUDENTS,
  ADMIN_ACCOUNTS,
  STAFF_ACCOUNTS,
  INITIAL_TOKENS,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_TRANSACTIONS
} from './data/hallsData';
import {
  ResidentialHall,
  StudentProfile,
  MealToken,
  MealOrder,
  PaymentSubmission,
  WalletTransaction,
  MealSlot,
  MealSchedule,
  DietaryType,
  AuthSession,
  PublicRoute,
  UserRole
} from './types';
import { PublicPortal } from './components/PublicPortal';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { WalletModal } from './components/WalletModal';

const STORAGE_KEY = 'amartoken_mbstu_state_v2';

interface PersistedState {
  halls: ResidentialHall[];
  students: StudentProfile[];
  tokens: MealToken[];
  orders: MealOrder[];
  payments: PaymentSubmission[];
  transactions: WalletTransaction[];
  session: AuthSession | null;
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && Array.isArray(parsed.halls) && Array.isArray(parsed.students)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to initial defaults
  }
  return {
    halls: UNIVERSITY_HALLS,
    students: INITIAL_STUDENTS,
    tokens: INITIAL_TOKENS,
    orders: INITIAL_ORDERS,
    payments: INITIAL_PAYMENTS,
    transactions: INITIAL_TRANSACTIONS,
    session: null
  };
}

export default function App() {
  const initial = loadInitialState();

  const [halls, setHalls] = useState<ResidentialHall[]>(initial.halls);
  const [students, setStudents] = useState<StudentProfile[]>(initial.students);
  const [tokens, setTokens] = useState<MealToken[]>(initial.tokens);
  const [orders, setOrders] = useState<MealOrder[]>(initial.orders);
  const [payments, setPayments] = useState<PaymentSubmission[]>(initial.payments);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initial.transactions);
  const [session, setSession] = useState<AuthSession | null>(initial.session);
  const [publicRoute, setPublicRoute] = useState<PublicRoute>('home');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    try {
      const payload: PersistedState = {
        halls,
        students,
        tokens,
        orders,
        payments,
        transactions,
        session
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [halls, students, tokens, orders, payments, transactions, session]);

  const handleLoginSuccess = (role: UserRole, userId: string) => {
    if (role === 'STUDENT') {
      const st = students.find(s => s.id === userId);
      if (!st) return;
      setSession({
        role: 'STUDENT',
        userId: st.id,
        name: st.name,
        email: st.academicEmail,
        hallId: st.hallId,
        hallName: st.hallName
      });
    } else if (role === 'ADMIN') {
      const adm = ADMIN_ACCOUNTS.find(a => a.id === userId);
      if (!adm) return;
      setSession({
        role: 'ADMIN',
        userId: adm.id,
        name: adm.name,
        email: adm.email,
        hallId: adm.assignedHallId,
        hallName: 'All MBSTU Halls'
      });
    } else if (role === 'STAFF') {
      const stf = STAFF_ACCOUNTS.find(s => s.id === userId);
      if (!stf) return;
      const hallObj = halls.find(h => h.id === stf.assignedHallId);
      setSession({
        role: 'STAFF',
        userId: stf.id,
        name: stf.name,
        email: stf.email,
        hallId: stf.assignedHallId,
        hallName: hallObj?.name || 'Hall Gate'
      });
    }
  };

  const handleRegisterStudent = (newProfile: StudentProfile) => {
    setStudents(prev => [newProfile, ...prev]);
    setTransactions(prev => [
      {
        id: `tx-welcome-${Date.now()}`,
        studentId: newProfile.studentId,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'TOPUP',
        amount: newProfile.walletBalance,
        description: 'Initial Hall Dining Wallet Opening Balance',
        paymentMethod: 'HALL_OFFICE_CASH'
      },
      ...prev
    ]);
    setSession({
      role: 'STUDENT',
      userId: newProfile.id,
      name: newProfile.name,
      email: newProfile.academicEmail,
      hallId: newProfile.hallId,
      hallName: newProfile.hallName
    });
  };

  const handleLogout = () => {
    setSession(null);
    setPublicRoute('home');
    setIsWalletModalOpen(false);
  };

  // Student token purchase handler
  const handlePurchaseToken = (
    hall: ResidentialHall,
    mealSlot: MealSlot,
    mealSchedule: MealSchedule,
    dietary: DietaryType,
    paymentMethod: 'WALLET' | 'BKASH' | 'NAGAD' | 'CARD'
  ): boolean => {
    if (!session || session.role !== 'STUDENT') return false;
    const activeStudent = students.find(s => s.id === session.userId);
    if (!activeStudent) return false;

    const todayStr = new Date().toISOString().split('T')[0];
    const tokenSeq = Math.floor(1000 + Math.random() * 9000);
    const tokenNumber = `${hall.code}-${todayStr.replace(/-/g, '')}-${mealSlot[0]}-${tokenSeq}`;
    const orderNumber = `ORD-${todayStr.replace(/-/g, '')}-${tokenSeq}`;
    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const hash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newToken: MealToken = {
      id: `tok-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      tokenNumber,
      studentId: activeStudent.studentId,
      studentName: activeStudent.name,
      academicEmail: activeStudent.academicEmail,
      hallId: hall.id,
      hallName: hall.name,
      roomNumber: activeStudent.roomNumber,
      mealSlot,
      mealDate: todayStr,
      mealTitle: mealSchedule.title,
      dietaryType: dietary,
      price: mealSchedule.price,
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
      verificationHash: hash
    };

    const newOrder: MealOrder = {
      id: orderId,
      orderNumber,
      tokenNumber,
      studentId: activeStudent.studentId,
      studentName: activeStudent.name,
      academicEmail: activeStudent.academicEmail,
      hallId: hall.id,
      hallName: hall.name,
      mealSlot,
      mealDate: todayStr,
      amount: mealSchedule.price,
      paymentMethod,
      orderStatus: 'ISSUED',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    if (paymentMethod === 'WALLET') {
      setStudents(prev =>
        prev.map(s =>
          s.id === activeStudent.id
            ? { ...s, walletBalance: Math.max(0, s.walletBalance - mealSchedule.price) }
            : s
        )
      );
    }

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: activeStudent.studentId,
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
      paymentMethod:
        paymentMethod === 'WALLET'
          ? 'STUDENT_WALLET'
          : paymentMethod === 'CARD'
          ? 'BANK_CARD'
          : paymentMethod
    };

    setTokens(prev => [newToken, ...prev]);
    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  // Student instant top-up
  const handleTopUp = (
    amount: number,
    method: 'BKASH' | 'NAGAD' | 'BANK_CARD' | 'HALL_OFFICE_CASH'
  ) => {
    if (!session || session.role !== 'STUDENT') return;
    const activeStudent = students.find(s => s.id === session.userId);
    if (!activeStudent) return;

    setStudents(prev =>
      prev.map(s =>
        s.id === activeStudent.id ? { ...s, walletBalance: s.walletBalance + amount } : s
      )
    );

    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        studentId: activeStudent.studentId,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'TOPUP',
        amount,
        description: `Instant Wallet Recharge via ${method}`,
        paymentMethod: method
      },
      ...prev
    ]);
  };

  // Student submit payment slip for Admin verification
  const handleSubmitPaymentSlip = (
    amount: number,
    method: 'BKASH' | 'NAGAD' | 'BANK_CARD' | 'HALL_OFFICE_CASH',
    referenceId: string
  ) => {
    if (!session || session.role !== 'STUDENT') return;
    const activeStudent = students.find(s => s.id === session.userId);
    if (!activeStudent) return;

    const newSlip: PaymentSubmission = {
      id: `pay-${Date.now()}`,
      referenceId,
      studentId: activeStudent.studentId,
      studentName: activeStudent.name,
      academicEmail: activeStudent.academicEmail,
      hallId: activeStudent.hallId,
      hallName: activeStudent.hallName,
      amount,
      method,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'PENDING'
    };

    setPayments(prev => [newSlip, ...prev]);
  };

  // Student profile update
  const handleUpdateStudentProfile = (phone: string, dietaryPreference: DietaryType) => {
    if (!session || session.role !== 'STUDENT') return;
    setStudents(prev =>
      prev.map(s =>
        s.id === session.userId ? { ...s, phone, dietaryPreference } : s
      )
    );
  };

  // Staff token redemption
  const handleRedeemToken = (
    tokenNumber: string,
    gateHallId: string,
    staffLabel: string
  ): { success: boolean; reason: string; message: string; token?: MealToken } => {
    const foundToken = tokens.find(
      t => t.tokenNumber.toUpperCase() === tokenNumber.toUpperCase()
    );
    const gateHall = halls.find(h => h.id === gateHallId);

    if (!foundToken) {
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: `Token #${tokenNumber} was not found in MBSTU records.`
      };
    }

    if (foundToken.hallId.toLowerCase() !== gateHallId.toLowerCase()) {
      return {
        success: false,
        reason: 'WRONG_HALL',
        message: `Cross-Hall Denied! Token belongs to ${foundToken.hallName}, not ${gateHall?.name || 'this gate'}.`,
        token: foundToken
      };
    }

    if (foundToken.status === 'REDEEMED') {
      return {
        success: false,
        reason: 'ALREADY_REDEEMED',
        message: `DOUBLE-SPEND BLOCKED! Token was already redeemed on ${
          foundToken.redeemedAt ? new Date(foundToken.redeemedAt).toLocaleTimeString() : 'earlier'
        }.`,
        token: foundToken
      };
    }

    const nowIso = new Date().toISOString();
    setTokens(prev =>
      prev.map(t =>
        t.id === foundToken.id
          ? { ...t, status: 'REDEEMED', redeemedAt: nowIso, redemptionStaff: staffLabel }
          : t
      )
    );
    setOrders(prev =>
      prev.map(o =>
        o.tokenNumber === foundToken.tokenNumber ? { ...o, orderStatus: 'REDEEMED' } : o
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
        redemptionStaff: staffLabel
      }
    };
  };

  // Admin: Manage Meals
  const handleUpdateMeal = (
    hallId: string,
    mealSlot: MealSlot,
    updates: {
      title: string;
      description: string;
      price: number;
      calories: number;
      isAvailable: boolean;
    }
  ) => {
    setHalls(prev =>
      prev.map(h => {
        if (h.id !== hallId) return h;
        return {
          ...h,
          diningSchedule: h.diningSchedule.map(sch =>
            sch.mealSlot === mealSlot
              ? {
                  ...sch,
                  title: updates.title,
                  price: updates.price,
                  isAvailable: updates.isAvailable,
                  menu: {
                    ...sch.menu,
                    description: updates.description,
                    calories: updates.calories
                  }
                }
              : sch
          )
        };
      })
    );
  };

  // Admin: Manage Meal Schedules
  const handleUpdateSchedule = (
    hallId: string,
    mealSlot: MealSlot,
    updates: {
      timeWindow: string;
      cutoffTime: string;
      isCutoffPassed: boolean;
    }
  ) => {
    setHalls(prev =>
      prev.map(h => {
        if (h.id !== hallId) return h;
        return {
          ...h,
          diningSchedule: h.diningSchedule.map(sch =>
            sch.mealSlot === mealSlot ? { ...sch, ...updates } : sch
          )
        };
      })
    );
  };

  // Admin: Manage Students
  const handleToggleStudentStatus = (studentRecordId: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === studentRecordId
          ? { ...s, status: s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : s
      )
    );
  };

  const handleCreditStudentWallet = (studentRecordId: string, amount: number) => {
    const target = students.find(s => s.id === studentRecordId);
    if (!target) return;

    setStudents(prev =>
      prev.map(s =>
        s.id === studentRecordId ? { ...s, walletBalance: s.walletBalance + amount } : s
      )
    );
    setTransactions(prev => [
      {
        id: `tx-adm-${Date.now()}`,
        studentId: target.studentId,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'TOPUP',
        amount,
        description: 'Hall Admin Direct Wallet Credit',
        paymentMethod: 'HALL_OFFICE_CASH'
      },
      ...prev
    ]);
  };

  // Admin: Verify Payments
  const handleVerifyPayment = (
    paymentId: string,
    decision: 'VERIFIED' | 'REJECTED',
    adminName: string
  ) => {
    const targetPayment = payments.find(p => p.id === paymentId);
    if (!targetPayment || targetPayment.status !== 'PENDING') return;

    const verifiedAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? { ...p, status: decision, verifiedBy: adminName, verifiedAt }
          : p
      )
    );

    if (decision === 'VERIFIED') {
      setStudents(prev =>
        prev.map(s =>
          s.studentId === targetPayment.studentId
            ? { ...s, walletBalance: s.walletBalance + targetPayment.amount }
            : s
        )
      );
      setTransactions(prev => [
        {
          id: `tx-ver-${Date.now()}`,
          studentId: targetPayment.studentId,
          date: verifiedAt,
          type: 'TOPUP',
          amount: targetPayment.amount,
          description: `Verified Payment Slip (${targetPayment.referenceId})`,
          referenceId: targetPayment.referenceId,
          paymentMethod: targetPayment.method
        },
        ...prev
      ]);
    }
  };

  // Route 1: Public Portal (Home, Student Registration, 3-Role Login)
  if (!session) {
    return (
      <PublicPortal
        route={publicRoute}
        onNavigate={setPublicRoute}
        halls={halls}
        students={students}
        admins={ADMIN_ACCOUNTS}
        staffList={STAFF_ACCOUNTS}
        onLoginSuccess={handleLoginSuccess}
        onRegisterStudent={handleRegisterStudent}
      />
    );
  }

  // Route 2: Student Dashboard
  if (session.role === 'STUDENT') {
    const activeStudent = students.find(s => s.id === session.userId);
    if (!activeStudent) {
      handleLogout();
      return null;
    }

    return (
      <>
        <StudentDashboard
          student={activeStudent}
          halls={halls}
          tokens={tokens}
          orders={orders}
          payments={payments}
          transactions={transactions}
          onPurchaseToken={handlePurchaseToken}
          onOpenWalletModal={() => setIsWalletModalOpen(true)}
          onSubmitPaymentSlip={handleSubmitPaymentSlip}
          onUpdateProfile={handleUpdateStudentProfile}
          onLogout={handleLogout}
        />
        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          student={activeStudent}
          transactions={transactions}
          onTopUp={handleTopUp}
          onSubmitPaymentSlip={handleSubmitPaymentSlip}
        />
      </>
    );
  }

  // Route 3: Admin Dashboard
  if (session.role === 'ADMIN') {
    const activeAdmin = ADMIN_ACCOUNTS.find(a => a.id === session.userId) || ADMIN_ACCOUNTS[0];
    return (
      <AdminDashboard
        admin={activeAdmin}
        halls={halls}
        students={students}
        tokens={tokens}
        orders={orders}
        payments={payments}
        onUpdateMeal={handleUpdateMeal}
        onUpdateSchedule={handleUpdateSchedule}
        onToggleStudentStatus={handleToggleStudentStatus}
        onCreditStudentWallet={handleCreditStudentWallet}
        onVerifyPayment={handleVerifyPayment}
        onLogout={handleLogout}
      />
    );
  }

  // Route 4: Staff Dashboard
  const activeStaff = STAFF_ACCOUNTS.find(s => s.id === session.userId) || STAFF_ACCOUNTS[0];
  return (
    <StaffDashboard
      staff={activeStaff}
      halls={halls}
      tokens={tokens}
      onRedeemToken={handleRedeemToken}
      onLogout={handleLogout}
    />
  );
}
