import { ResidentialHall, StudentProfile, MealToken, WalletTransaction, KitchenExpenseItem } from '../types';

export const UNIVERSITY_HALLS: ResidentialHall[] = [
  {
    id: 'jamh',
    name: 'Jananeta Abdul Mannan Hall',
    code: 'JAMH',
    gender: 'Male',
    banglaName: 'জননেতা আব্দুল মান্নান হল',
    capacity: 1250,
    currentResidents: 1180,
    managerName: 'Prof. Dr. M. A. Matin (Provost)',
    provostName: 'Prof. Dr. M. A. Matin',
    provostDesignation: 'Provost & Professor, Department of Chemistry',
    phone: '+880-1711-102938',
    email: 'provost.jamh@mbstu.ac.bd',
    diningManagerName: 'Md. Anwar Hossain',
    diningManagerPhone: '+880-1711-987654',
    lunchPrice: 30,
    dinnerPrice: 30,
    provostNotice: 'Welcome to Jananeta Abdul Mannan Hall. All boarders are requested to book meal tokens within 6:00 PM - 12:00 AM.',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'jamh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-jamh-l',
          name: 'Polao Rice, Deshi Chicken Curry & Ghono Daal',
          description: 'Aromatic polao rice served with tender chicken curry, seasonal vegetables, and thick lentil dal.',
          calories: 780,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Steamed Polao Rice (Unlimited)', 'Chicken Roast / Curry', 'Mixed Vegetable Bhaji', 'Musur Dal']
        }
      },
      {
        id: 'jamh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-jamh-d',
          name: 'Steamed Rice, River Fish Curry & Mixed Bharta',
          description: 'Fresh fish curry with aromatic spices, roasted eggplant bharta, steamed rice, and dal.',
          calories: 690,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Fine Atash Rice', 'Spicy Fish Curry', 'Begun Bharta', 'Thick Daal']
        }
      }
    ]
  },
  {
    id: 'akbh',
    name: 'Alema Khatun Bhashani Hall',
    code: 'AKBH',
    gender: 'Female',
    banglaName: 'আলেমা খাতুন ভাসানী হল',
    capacity: 1100,
    currentResidents: 1020,
    managerName: 'Prof. Dr. Nasreen Begum (Provost)',
    provostName: 'Prof. Dr. Nasreen Begum',
    provostDesignation: 'Provost & Professor, Department of ESRM',
    phone: '+880-1819-482019',
    email: 'provost.akbh@mbstu.ac.bd',
    diningManagerName: 'Mrs. Salma Khatun',
    diningManagerPhone: '+880-1819-332211',
    lunchPrice: 30,
    dinnerPrice: 30,
    provostNotice: 'Alema Khatun Bhashani Hall maintains strict hygienic dining protocols. Please show your QR tokens at the turnstile.',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'akbh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-akbh-l',
          name: 'Steamed Rice, Beef Bhuna / Shahi Paneer & Daal',
          description: 'Choice of beef cube bhuna or cottage cheese paneer butter masala with fresh dal and salad.',
          calories: 760,
          dietary: ['REGULAR', 'VEGETARIAN', 'HALAL_NON_VEG'],
          itemsList: ['Steamed Miniket Rice', 'Slow-cooked Beef Bhuna OR Paneer', 'Potato Bhaji', 'Musur Daal']
        }
      },
      {
        id: 'akbh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-akbh-d',
          name: 'Ruti or Rice, Chicken Roast & Mixed Vegetable',
          description: 'Handmade roti or rice with tender chicken breast roast, mixed vegetables, and dal.',
          calories: 620,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['3x Handmade Wheat Ruti OR Rice', 'Chicken Roast Piece', 'Mixed Vegetable', 'Light Daal']
        }
      }
    ]
  },
  {
    id: 'szrh',
    name: 'Shahid Ziaur Rahman Hall',
    code: 'SZRH',
    gender: 'Male',
    banglaName: 'শহীদ জিয়াউর রহমান হল',
    capacity: 1400,
    currentResidents: 1340,
    managerName: 'Prof. Dr. Tariqul Islam (Provost)',
    provostName: 'Prof. Dr. Tariqul Islam',
    provostDesignation: 'Provost & Professor, Department of CSE',
    phone: '+880-1712-445566',
    email: 'admin.szrh@mbstu.ac.bd',
    diningManagerName: 'Md. Rafiqul Islam',
    diningManagerPhone: '+880-1711-223344',
    lunchPrice: 30,
    dinnerPrice: 30,
    provostNotice: 'Shahid Ziaur Rahman Hall dining operates on zero-wastage procurement. Token booking strictly closes at 12:00 AM.',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'szrh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-szrh-l',
          name: 'Rice, Chicken Jhol, Aloo Bhorta & Daal',
          description: 'Steamed rice, village-style chicken curry with potato chunks, spicy mashed potato, and dal.',
          calories: 740,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Steamed Rice', 'Deshi Chicken Curry with Gravy', 'Mustard Aloo Bhorta', 'Yellow Dal']
        }
      },
      {
        id: 'szrh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-szrh-d',
          name: 'Rice, Katla Fish Curry, Danta Shak & Daal',
          description: 'Steamed rice with fresh fish curry in spicy mustard gravy, leafy vegetable fry, and dal.',
          calories: 670,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Steamed Rice', 'Katla Fish Curry', 'Fresh Saag Bhaji', 'Musur Daal']
        }
      }
    ]
  },
  {
    id: 'sjjh',
    name: 'Shahid Janoni Jahanara Imam Hall',
    code: 'SJJH',
    gender: 'Female',
    banglaName: 'শহীদ জননী জাহানারা ইমাম হল',
    capacity: 1150,
    currentResidents: 1080,
    managerName: 'Prof. Dr. Ferdousi Begum (Provost)',
    provostName: 'Prof. Dr. Ferdousi Begum',
    provostDesignation: 'Provost & Associate Professor, Department of BGE',
    phone: '+880-1911-334455',
    email: 'provost.sjjh@mbstu.ac.bd',
    diningManagerName: 'Rokeya Begum',
    diningManagerPhone: '+880-1715-667788',
    lunchPrice: 30,
    dinnerPrice: 30,
    provostNotice: 'Shahid Janoni Jahanara Imam Hall provides nutritious balanced meals for all female boarders.',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'sjjh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-sjjh-l',
          name: 'Basmati Rice, Beef Rezala & Daal',
          description: 'Tender beef shank in aromatic cashew and curd gravy with cumin rice and lentils.',
          calories: 820,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Long grain rice', 'Beef Rezala (200g)', 'Potato bhaji', 'Daal tadka']
        }
      },
      {
        id: 'sjjh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-sjjh-d',
          name: 'Rice, Chicken Roast, Daal & Cabbage fry',
          description: 'Quarter chicken roast, spiced cabbage bhaji, and warm lentil broth.',
          calories: 710,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Rice', 'Spicy Chicken Roast', 'Cabbage Bhaji', 'Daal']
        }
      }
    ]
  },
  {
    id: 'bfzh',
    name: 'Begum Fazilatunnessa Zoha Hall',
    code: 'BFZH',
    gender: 'Female',
    banglaName: 'বেগম ফজিলাতুন্নেছা জোহা হল',
    capacity: 1050,
    currentResidents: 990,
    managerName: 'Prof. Dr. Tahmina Akhter (Provost)',
    provostName: 'Prof. Dr. Tahmina Akhter',
    provostDesignation: 'Provost & Professor, Department of Mathematics',
    phone: '+880-1817-667788',
    email: 'provost.bfzh@mbstu.ac.bd',
    diningManagerName: 'Fatema Tuz Zohra',
    diningManagerPhone: '+880-1714-557799',
    lunchPrice: 30,
    dinnerPrice: 30,
    provostNotice: 'Begum Fazilatunnessa Zoha Hall dining is committed to nutritious meals and transparent accounts.',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'bfzh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-bfzh-l',
          name: 'Polao Rice, Deshi Chicken Curry & Mixed Labra',
          description: 'Fine polao rice with slow-simmered chicken curry and mixed vegetable labra.',
          calories: 770,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Polao Rice', 'Chicken Curry Quarter', 'Mixed Vegetable Labra', 'Musur Daal']
        }
      },
      {
        id: 'bfzh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-bfzh-d',
          name: 'Steamed Rice, Pabda/Rui Fish & Daal',
          description: 'Steamed rice with seasonal river fish in tomato gravy, mashed potato, and dal.',
          calories: 650,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Steamed Rice', 'Pabda/Rui Fish Curry', 'Aloo Bharta', 'Daal']
        }
      }
    ]
  },
  {
    id: 'safh',
    name: 'Shaheed Abrar Fahad Hall',
    code: 'SAFH',
    gender: 'Male',
    banglaName: 'শহীদ আবরার ফাহাদ হল',
    capacity: 1350,
    currentResidents: 1290,
    managerName: 'Prof. Dr. Mahmudul Hasan (Provost)',
    provostName: 'Prof. Dr. Mahmudul Hasan',
    provostDesignation: 'Provost & Professor, Department of ICT',
    phone: '+880-1715-998877',
    email: 'provost.safh@mbstu.ac.bd',
    diningManagerName: 'Kazi Mominul Huq',
    diningManagerPhone: '+880-1716-889900',
    lunchPrice: 30,
    dinnerPrice: 30,
    provostNotice: 'Shaheed Abrar Fahad Hall fosters discipline and student welfare. Verify your institutional email for dining services.',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'safh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-safh-l',
          name: 'Polao Rice, Deshi Chicken Roast & Ghono Daal',
          description: 'Aromatic polao rice with golden roasted chicken quarter, tempered musur dal, and salad.',
          calories: 810,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Polao Rice (Unlimited)', 'Chicken Roast (Leg/Breast)', 'Mixed Vegetable Bhaji', 'Musur Dal', 'Green Chili & Lemon']
        }
      },
      {
        id: 'safh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-safh-d',
          name: 'Steamed Rice, Beef Bhuna / Rui Fish Kalia & Daal',
          description: 'Miniket rice, tender beef bhuna or river Rui fish kalia, eggplant bharta, and yellow dal.',
          calories: 720,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Fine Miniket Rice', 'Beef Bhuna OR Rui Fish Kalia', 'Begun Bharta', 'Yellow Lentil Daal']
        }
      }
    ]
  },
  {
    id: 'sohh',
    name: 'Shaheed Osman Hadi Hall',
    code: 'SOHH',
    gender: 'Male',
    banglaName: 'শহীদ ওসমান হাদী হল',
    capacity: 1200,
    currentResidents: 1120,
    managerName: 'Prof. Dr. Anwarul Karim (Provost)',
    provostName: 'Prof. Dr. Anwarul Karim',
    provostDesignation: 'Provost & Professor, Department of Physics',
    phone: '+880-1718-223344',
    email: 'provost.sohh@mbstu.ac.bd',
    diningManagerName: 'Md. Nurul Huda',
    diningManagerPhone: '+880-1713-224466',
    lunchPrice: 30,
    dinnerPrice: 30,
    provostNotice: 'Shaheed Osman Hadi Hall welcomes boarders to high quality dining. Please cooperate with the gate staff.',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'sohh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-sohh-l',
          name: 'Steamed Rice, Deshi Chicken Curry & Vegetables',
          description: 'Steamed rice, chicken curry with savory gravy, seasonal vegetable fry, and yellow dal.',
          calories: 750,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Steamed Rice', 'Deshi Chicken Curry', 'Vegetable Fry', 'Thick Daal']
        }
      },
      {
        id: 'sohh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '12:00 AM (Midnight)',
        cutoffHoursRemaining: 6,
        price: 30,
        isCutoffPassed: false,
        menu: {
          id: 'menu-sohh-d',
          name: 'Rice, Katla Fish Curry & Aloo Bhorta',
          description: 'Steamed rice, Katla fish in mustard gravy, mustard mashed potato, and dal.',
          calories: 680,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: ['Rice', 'Katla Fish Curry', 'Mustard Aloo Bhorta', 'Musur Daal']
        }
      }
    ]
  }
];

export const INITIAL_STUDENT: StudentProfile = {
  id: 'stu-001',
  studentId: 'IT-22084',
  name: 'Tanvir Ahmed',
  academicEmail: 'tanvir.it22084@mbstu.ac.bd',
  password: 'mbstu123',
  role: 'STUDENT',
  gender: 'Male',
  hallId: 'safh',
  hallName: 'Shaheed Abrar Fahad Hall',
  roomNumber: 'Room 314 (Block B)',
  department: 'Information and Communication Technology (ICT)',
  batch: '2021-22',
  walletBalance: 420,
  dietaryPreference: 'HALAL_NON_VEG',
  phone: '+880-1700-112233'
};

export const DEMO_STAFF: StudentProfile = {
  id: 'staff-001',
  studentId: 'STAFF-SZRH-01',
  name: 'Md. Rafiqul Islam',
  academicEmail: 'staff.szrh@mbstu.ac.bd',
  password: 'mbstu123',
  role: 'STAFF',
  gender: 'Male',
  hallId: 'szrh',
  hallName: 'Shahid Ziaur Rahman Hall',
  roomNumber: 'Dining Staff Office',
  department: 'Hall Dining Management',
  batch: 'Senior Kitchen Staff',
  walletBalance: 0,
  dietaryPreference: 'REGULAR',
  phone: '+880-1711-223344',
  idCardPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const DEMO_ADMIN: StudentProfile = {
  id: 'admin-001',
  studentId: 'ADM-SZRH-01',
  name: 'Prof. Dr. Tariqul Islam',
  academicEmail: 'admin.szrh@mbstu.ac.bd',
  password: 'mbstu123',
  role: 'ADMIN',
  gender: 'Male',
  hallId: 'szrh',
  hallName: 'Shahid Ziaur Rahman Hall',
  roomNumber: 'Provost Office',
  department: 'Computer Science & Engineering',
  batch: 'Hall Provost',
  walletBalance: 0,
  dietaryPreference: 'REGULAR',
  phone: '+880-1712-445566',
  idCardPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
};

export const DEMO_ACCOUNTS: StudentProfile[] = [
  INITIAL_STUDENT,
  DEMO_STAFF,
  DEMO_ADMIN
];

export const DEFAULT_KITCHEN_EXPENSES: KitchenExpenseItem[] = [
  { id: 'exp-1', name: 'Polao / Fine Miniket Rice', category: 'Grains', perStudentQuantity: 0.16, unit: 'kg', unitPrice: 75 },
  { id: 'exp-2', name: 'Deshi Farm Chicken / River Fish', category: 'Protein', perStudentQuantity: 0.21, unit: 'kg', unitPrice: 220 },
  { id: 'exp-3', name: 'Red Musur Lentils (Dal)', category: 'Pulses', perStudentQuantity: 0.035, unit: 'kg', unitPrice: 140 },
  { id: 'exp-4', name: 'Soybean & Mustard Cooking Oil', category: 'Oils', perStudentQuantity: 0.04, unit: 'Liters', unitPrice: 170 },
  { id: 'exp-5', name: 'Deshi Onions (Peyaj)', category: 'Produce', perStudentQuantity: 0.055, unit: 'kg', unitPrice: 65 },
  { id: 'exp-6', name: 'Ginger & Garlic Paste (Ada-Roshun)', category: 'Spices', perStudentQuantity: 0.025, unit: 'kg', unitPrice: 180 },
  { id: 'exp-7', name: 'Potatoes & Seasonal Vegetables', category: 'Produce', perStudentQuantity: 0.08, unit: 'kg', unitPrice: 35 },
  { id: 'exp-8', name: 'Pure Spices & Turmeric Powder', category: 'Spices', perStudentQuantity: 0.015, unit: 'kg', unitPrice: 300 },
  { id: 'exp-9', name: 'Cucumbers, Green Chili & Lemons', category: 'Produce', perStudentQuantity: 0.03, unit: 'kg', unitPrice: 80 },
  { id: 'exp-10', name: 'Kitchen LP Gas & Firewood Fuel', category: 'Fuel/Misc', perStudentQuantity: 0.01, unit: 'pcs', unitPrice: 4 }
];

export const INITIAL_TOKENS: MealToken[] = [
  {
    id: 'tok-101',
    tokenNumber: 'SAFH-20261112-L-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    roomNumber: 'Room 314 (Block B)',
    mealSlot: 'LUNCH',
    mealDate: '2026-11-12',
    menuName: 'Polao Rice, Deshi Chicken Roast & Ghono Daal',
    dietaryType: 'HALAL_NON_VEG',
    price: 30,
    status: 'ACTIVE',
    issuedAt: '2026-11-12T08:15:00Z',
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'tok-102',
    tokenNumber: 'SAFH-20261112-D-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    roomNumber: 'Room 314 (Block B)',
    mealSlot: 'DINNER',
    mealDate: '2026-11-12',
    menuName: 'Steamed Rice, Beef Bhuna / Rui Fish Kalia & Daal',
    dietaryType: 'HALAL_NON_VEG',
    price: 30,
    status: 'ACTIVE',
    issuedAt: '2026-11-12T08:15:00Z',
    verificationHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 'tok-099',
    tokenNumber: 'SAFH-20261111-D-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    roomNumber: 'Room 314 (Block B)',
    mealSlot: 'DINNER',
    mealDate: '2026-11-11',
    menuName: 'Steamed Rice, Deshi Chicken Curry',
    dietaryType: 'HALAL_NON_VEG',
    price: 30,
    status: 'REDEEMED',
    issuedAt: '2026-11-11T09:00:00Z',
    redeemedAt: '2026-11-11T20:14:22Z',
    redemptionStaff: 'Dining Gate Attendant (SAFH)',
    verificationHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-201',
    date: '2026-11-12 08:10 AM',
    type: 'TOPUP',
    amount: 500,
    description: 'Wallet Recharge via bKash',
    referenceId: 'BKSH-992144812',
    paymentMethod: 'BKASH'
  },
  {
    id: 'tx-202',
    date: '2026-11-12 08:15 AM',
    type: 'TOKEN_PURCHASE',
    amount: -30,
    description: 'Purchased Lunch Token SAFH-20261112-L-084',
    referenceId: 'tok-101',
    paymentMethod: 'STUDENT_WALLET'
  },
  {
    id: 'tx-203',
    date: '2026-11-12 08:15 AM',
    type: 'TOKEN_PURCHASE',
    amount: -30,
    description: 'Purchased Dinner Token SAFH-20261112-D-084',
    referenceId: 'tok-102',
    paymentMethod: 'STUDENT_WALLET'
  }
];
