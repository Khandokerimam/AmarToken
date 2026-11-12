export type MealSlot = 'LUNCH' | 'DINNER';

export type DietaryType = 'REGULAR' | 'VEGETARIAN' | 'HALAL_NON_VEG' | 'DIABETIC_SPECIAL';

export type TokenStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  dietary: DietaryType[];
  itemsList: string[];
}

export interface MealSchedule {
  id: string;
  mealSlot: MealSlot;
  title: string;
  timeWindow: string;
  cutoffTime: string; // e.g. "10:30 AM"
  cutoffHoursRemaining: number;
  price: number;
  isCutoffPassed: boolean;
  menu: MenuItem;
}

export interface ResidentialHall {
  id: string;
  name: string;
  code: string;
  banglaName?: string;
  capacity: number;
  currentResidents: number;
  managerName: string;
  phone: string;
  colorTheme: string;
  diningSchedule: MealSchedule[];
}

export interface StudentProfile {
  id: string;
  studentId: string;
  name: string;
  academicEmail: string;
  hallId: string;
  hallName: string;
  roomNumber: string;
  department: string;
  batch: string;
  walletBalance: number;
  dietaryPreference: DietaryType;
  phone: string;
}

export interface MealToken {
  id: string;
  tokenNumber: string; // e.g. SAFH-20261112-L-084
  studentId: string;
  studentName: string;
  academicEmail?: string;
  hallId: string;
  hallName: string;
  roomNumber: string;
  mealSlot: MealSlot;
  mealDate: string; // YYYY-MM-DD
  menuName: string;
  dietaryType: DietaryType;
  price: number;
  status: TokenStatus;
  issuedAt: string;
  redeemedAt?: string;
  redemptionStaff?: string;
  verificationHash: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'TOPUP' | 'TOKEN_PURCHASE';
  amount: number;
  description: string;
  referenceId?: string;
  paymentMethod: 'BKASH' | 'NAGAD' | 'STUDENT_WALLET' | 'BANK_CARD' | 'HALL_OFFICE_CASH';
}

export interface KitchenRequisition {
  item: string;
  category: 'Grains' | 'Meat & Fish' | 'Vegetables' | 'Spices & Oil' | 'Dairy';
  quantity: number;
  unit: string;
  allocatedFor: string;
}
