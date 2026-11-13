import {
  ResidentialHall,
  StudentProfile,
  AdminAccount,
  StaffAccount,
  MealToken,
  MealOrder,
  PaymentSubmission,
  WalletTransaction
} from '../types';

export const UNIVERSITY_HALLS: ResidentialHall[] = [
  {
    id: 'jamh',
    name: 'Jananeta Abdul Mannan Hall',
    code: 'JAMH',
    banglaName: 'জননেতা আব্দুল মান্নান হল',
    capacity: 1250,
    currentResidents: 1180,
    managerName: 'Prof. Dr. M. A. Matin (Provost)',
    phone: '+880-1711-102938',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'jamh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '10:30 AM',
        cutoffHoursRemaining: 2,
        price: 65,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-jamh-l',
          name: 'Standard Hall Lunch',
          description: 'Daily subsidized afternoon lunch meal token for Jananeta Abdul Mannan Hall residents.',
          calories: 780,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      },
      {
        id: 'jamh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-jamh-d',
          name: 'Standard Hall Dinner',
          description: 'Daily subsidized evening dinner meal token for Jananeta Abdul Mannan Hall residents.',
          calories: 690,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      }
    ]
  },
  {
    id: 'akbh',
    name: 'Alema Khatun Bhashani Hall',
    code: 'AKBH',
    banglaName: 'আলেমা খাতুন ভাসানী হল',
    capacity: 1100,
    currentResidents: 1020,
    managerName: 'Prof. Dr. Nasreen Begum (Provost)',
    phone: '+880-1819-482019',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'akbh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '10:30 AM',
        cutoffHoursRemaining: 2,
        price: 65,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-akbh-l',
          name: 'Standard Hall Lunch',
          description: 'Daily subsidized afternoon lunch meal token for Alema Khatun Bhashani Hall residents.',
          calories: 760,
          dietary: ['REGULAR', 'VEGETARIAN', 'HALAL_NON_VEG'],
          itemsList: []
        }
      },
      {
        id: 'akbh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-akbh-d',
          name: 'Standard Hall Dinner',
          description: 'Daily subsidized evening dinner meal token for Alema Khatun Bhashani Hall residents.',
          calories: 620,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      }
    ]
  },
  {
    id: 'szrh',
    name: 'Shahid Ziaur Rahman Hall',
    code: 'SZRH',
    banglaName: 'শহীদ জিয়াউর রহমান হল',
    capacity: 1400,
    currentResidents: 1340,
    managerName: 'Prof. Dr. Tariqul Islam (Provost)',
    phone: '+880-1712-445566',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'szrh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '10:30 AM',
        cutoffHoursRemaining: 2,
        price: 65,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-szrh-l',
          name: 'Standard Hall Lunch',
          description: 'Daily subsidized afternoon lunch meal token for Shahid Ziaur Rahman Hall residents.',
          calories: 740,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      },
      {
        id: 'szrh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-szrh-d',
          name: 'Standard Hall Dinner',
          description: 'Daily subsidized evening dinner meal token for Shahid Ziaur Rahman Hall residents.',
          calories: 670,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      }
    ]
  },
  {
    id: 'sjjh',
    name: 'Shahid Janoni Jahanara Imam Hall',
    code: 'SJJH',
    banglaName: 'শহীদ জননী জাহানারা ইমাম হল',
    capacity: 1150,
    currentResidents: 1080,
    managerName: 'Prof. Dr. Ferdousi Begum (Provost)',
    phone: '+880-1911-334455',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'sjjh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '10:30 AM',
        cutoffHoursRemaining: 2,
        price: 65,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-sjjh-l',
          name: 'Standard Hall Lunch',
          description: 'Daily subsidized afternoon lunch meal token for Shahid Janoni Jahanara Imam Hall residents.',
          calories: 820,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      },
      {
        id: 'sjjh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-sjjh-d',
          name: 'Standard Hall Dinner',
          description: 'Daily subsidized evening dinner meal token for Shahid Janoni Jahanara Imam Hall residents.',
          calories: 710,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      }
    ]
  },
  {
    id: 'bfzh',
    name: 'Begum Fazilatunnessa Zoha Hall',
    code: 'BFZH',
    banglaName: 'বেগম ফজিলাতুন্নেছা জোহা হল',
    capacity: 1050,
    currentResidents: 990,
    managerName: 'Prof. Dr. Tahmina Akhter (Provost)',
    phone: '+880-1817-667788',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'bfzh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '10:30 AM',
        cutoffHoursRemaining: 2,
        price: 65,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-bfzh-l',
          name: 'Standard Hall Lunch',
          description: 'Daily subsidized afternoon lunch meal token for Begum Fazilatunnessa Zoha Hall residents.',
          calories: 770,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      },
      {
        id: 'bfzh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-bfzh-d',
          name: 'Standard Hall Dinner',
          description: 'Daily subsidized evening dinner meal token for Begum Fazilatunnessa Zoha Hall residents.',
          calories: 650,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      }
    ]
  },
  {
    id: 'safh',
    name: 'Shaheed Abrar Fahad Hall',
    code: 'SAFH',
    banglaName: 'শহীদ আবরার ফাহাদ হল',
    capacity: 1350,
    currentResidents: 1290,
    managerName: 'Prof. Dr. Mahmudul Hasan (Provost)',
    phone: '+880-1715-998877',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'safh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '10:30 AM',
        cutoffHoursRemaining: 2,
        price: 65,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-safh-l',
          name: 'Standard Hall Lunch',
          description: 'Daily subsidized afternoon lunch meal token for Shaheed Abrar Fahad Hall residents.',
          calories: 810,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      },
      {
        id: 'safh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-safh-d',
          name: 'Standard Hall Dinner',
          description: 'Daily subsidized evening dinner meal token for Shaheed Abrar Fahad Hall residents.',
          calories: 720,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      }
    ]
  },
  {
    id: 'sohh',
    name: 'Shaheed Osman Hadi Hall',
    code: 'SOHH',
    banglaName: 'শহীদ ওসমান হাদী হল',
    capacity: 1200,
    currentResidents: 1120,
    managerName: 'Prof. Dr. Anwarul Karim (Provost)',
    phone: '+880-1718-223344',
    colorTheme: 'red',
    diningSchedule: [
      {
        id: 'sohh-l',
        mealSlot: 'LUNCH',
        title: 'Hall Lunch Token',
        timeWindow: '12:30 PM – 2:30 PM',
        cutoffTime: '10:30 AM',
        cutoffHoursRemaining: 2,
        price: 65,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-sohh-l',
          name: 'Standard Hall Lunch',
          description: 'Daily subsidized afternoon lunch meal token for Shaheed Osman Hadi Hall residents.',
          calories: 750,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      },
      {
        id: 'sohh-d',
        mealSlot: 'DINNER',
        title: 'Hall Dinner Token',
        timeWindow: '7:30 PM – 9:30 PM',
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
        isCutoffPassed: false,
        isAvailable: true,
        menu: {
          id: 'menu-sohh-d',
          name: 'Standard Hall Dinner',
          description: 'Daily subsidized evening dinner meal token for Shaheed Osman Hadi Hall residents.',
          calories: 680,
          dietary: ['REGULAR', 'HALAL_NON_VEG'],
          itemsList: []
        }
      }
    ]
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'stu-001',
    studentId: 'IT-22084',
    name: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    password: 'password123',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    roomNumber: 'Room 314 (Block B)',
    department: 'Information and Communication Technology',
    batch: '2021-22',
    walletBalance: 420,
    dietaryPreference: 'HALAL_NON_VEG',
    phone: '+880-1700-112233',
    status: 'ACTIVE',
    registeredAt: '2026-10-01'
  },
  {
    id: 'stu-002',
    studentId: 'CE-21019',
    name: 'Nusrat Jahan Mim',
    academicEmail: 'nusrat.ce21019@mbstu.ac.bd',
    password: 'password123',
    hallId: 'akbh',
    hallName: 'Alema Khatun Bhashani Hall',
    roomNumber: 'Room 208 (East Wing)',
    department: 'Computer Science & Engineering',
    batch: '2020-21',
    walletBalance: 310,
    dietaryPreference: 'REGULAR',
    phone: '+880-1812-334455',
    status: 'ACTIVE',
    registeredAt: '2026-10-04'
  },
  {
    id: 'stu-003',
    studentId: 'TE-22041',
    name: 'Mehedi Hasan Shuvo',
    academicEmail: 'mehedi.te22041@mbstu.ac.bd',
    password: 'password123',
    hallId: 'jamh',
    hallName: 'Jananeta Abdul Mannan Hall',
    roomNumber: 'Room 112',
    department: 'Textile Engineering',
    batch: '2021-22',
    walletBalance: 185,
    dietaryPreference: 'HALAL_NON_VEG',
    phone: '+880-1915-778899',
    status: 'ACTIVE',
    registeredAt: '2026-10-09'
  },
  {
    id: 'stu-004',
    studentId: 'BG-23007',
    name: 'Farhana Yasmin',
    academicEmail: 'farhana.bg23007@mbstu.ac.bd',
    password: 'password123',
    hallId: 'sjjh',
    hallName: 'Shahid Janoni Jahanara Imam Hall',
    roomNumber: 'Room 402',
    department: 'Biotechnology and Genetic Engineering',
    batch: '2022-23',
    walletBalance: 540,
    dietaryPreference: 'VEGETARIAN',
    phone: '+880-1718-556677',
    status: 'ACTIVE',
    registeredAt: '2026-10-15'
  }
];

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'adm-001',
    name: 'Prof. Dr. Mahmudul Hasan',
    email: 'provost.admin@mbstu.ac.bd',
    password: 'admin123',
    designation: 'Chief Dining Administrator & Provost',
    assignedHallId: 'ALL'
  },
  {
    id: 'adm-002',
    name: 'Dr. Tahmina Akhter',
    email: 'hall.admin@mbstu.ac.bd',
    password: 'admin123',
    designation: 'Hall Dining Controller',
    assignedHallId: 'ALL'
  }
];

export const STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'stf-001',
    staffId: 'STF-SAFH-01',
    name: 'Md. Rafiqul Islam',
    email: 'rafiq.staff@mbstu.ac.bd',
    password: 'staff123',
    assignedHallId: 'safh',
    counterGate: 'Gate Counter A'
  },
  {
    id: 'stf-002',
    staffId: 'STF-AKBH-01',
    name: 'Salma Khatun',
    email: 'salma.staff@mbstu.ac.bd',
    password: 'staff123',
    assignedHallId: 'akbh',
    counterGate: 'Main Gate Counter'
  }
];

export const INITIAL_TOKENS: MealToken[] = [
  {
    id: 'tok-101',
    orderId: 'ord-101',
    tokenNumber: 'SAFH-20261112-L-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    roomNumber: 'Room 314 (Block B)',
    mealSlot: 'LUNCH',
    mealDate: '2026-11-12',
    mealTitle: 'Hall Lunch Token',
    dietaryType: 'HALAL_NON_VEG',
    price: 65,
    status: 'ACTIVE',
    issuedAt: '2026-11-12T08:15:00Z',
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'tok-102',
    orderId: 'ord-102',
    tokenNumber: 'SAFH-20261112-D-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    roomNumber: 'Room 314 (Block B)',
    mealSlot: 'DINNER',
    mealDate: '2026-11-12',
    mealTitle: 'Hall Dinner Token',
    dietaryType: 'HALAL_NON_VEG',
    price: 60,
    status: 'ACTIVE',
    issuedAt: '2026-11-12T08:15:00Z',
    verificationHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 'tok-103',
    orderId: 'ord-103',
    tokenNumber: 'AKBH-20261112-L-019',
    studentId: 'CE-21019',
    studentName: 'Nusrat Jahan Mim',
    academicEmail: 'nusrat.ce21019@mbstu.ac.bd',
    hallId: 'akbh',
    hallName: 'Alema Khatun Bhashani Hall',
    roomNumber: 'Room 208 (East Wing)',
    mealSlot: 'LUNCH',
    mealDate: '2026-11-12',
    mealTitle: 'Hall Lunch Token',
    dietaryType: 'REGULAR',
    price: 65,
    status: 'ACTIVE',
    issuedAt: '2026-11-12T08:40:00Z',
    verificationHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
  },
  {
    id: 'tok-099',
    orderId: 'ord-099',
    tokenNumber: 'SAFH-20261111-D-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    roomNumber: 'Room 314 (Block B)',
    mealSlot: 'DINNER',
    mealDate: '2026-11-11',
    mealTitle: 'Hall Dinner Token',
    dietaryType: 'HALAL_NON_VEG',
    price: 60,
    status: 'REDEEMED',
    issuedAt: '2026-11-11T09:00:00Z',
    redeemedAt: '2026-11-11T20:14:22Z',
    redemptionStaff: 'Md. Rafiqul Islam (Gate Counter A)',
    verificationHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  },
  {
    id: 'tok-098',
    orderId: 'ord-098',
    tokenNumber: 'JAMH-20261111-L-041',
    studentId: 'TE-22041',
    studentName: 'Mehedi Hasan Shuvo',
    academicEmail: 'mehedi.te22041@mbstu.ac.bd',
    hallId: 'jamh',
    hallName: 'Jananeta Abdul Mannan Hall',
    roomNumber: 'Room 112',
    mealSlot: 'LUNCH',
    mealDate: '2026-11-11',
    mealTitle: 'Hall Lunch Token',
    dietaryType: 'HALAL_NON_VEG',
    price: 65,
    status: 'REDEEMED',
    issuedAt: '2026-11-11T08:25:00Z',
    redeemedAt: '2026-11-11T13:18:05Z',
    redemptionStaff: 'Gate Attendant (JAMH)',
    verificationHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
  }
];

export const INITIAL_ORDERS: MealOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-20261112-101',
    tokenNumber: 'SAFH-20261112-L-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    mealSlot: 'LUNCH',
    mealDate: '2026-11-12',
    amount: 65,
    paymentMethod: 'WALLET',
    orderStatus: 'ISSUED',
    createdAt: '2026-11-12 08:15 AM'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-20261112-102',
    tokenNumber: 'SAFH-20261112-D-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    mealSlot: 'DINNER',
    mealDate: '2026-11-12',
    amount: 60,
    paymentMethod: 'WALLET',
    orderStatus: 'ISSUED',
    createdAt: '2026-11-12 08:15 AM'
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-20261112-103',
    tokenNumber: 'AKBH-20261112-L-019',
    studentId: 'CE-21019',
    studentName: 'Nusrat Jahan Mim',
    academicEmail: 'nusrat.ce21019@mbstu.ac.bd',
    hallId: 'akbh',
    hallName: 'Alema Khatun Bhashani Hall',
    mealSlot: 'LUNCH',
    mealDate: '2026-11-12',
    amount: 65,
    paymentMethod: 'BKASH',
    orderStatus: 'ISSUED',
    createdAt: '2026-11-12 08:40 AM'
  },
  {
    id: 'ord-099',
    orderNumber: 'ORD-20261111-099',
    tokenNumber: 'SAFH-20261111-D-084',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    mealSlot: 'DINNER',
    mealDate: '2026-11-11',
    amount: 60,
    paymentMethod: 'WALLET',
    orderStatus: 'REDEEMED',
    createdAt: '2026-11-11 09:00 AM'
  },
  {
    id: 'ord-098',
    orderNumber: 'ORD-20261111-098',
    tokenNumber: 'JAMH-20261111-L-041',
    studentId: 'TE-22041',
    studentName: 'Mehedi Hasan Shuvo',
    academicEmail: 'mehedi.te22041@mbstu.ac.bd',
    hallId: 'jamh',
    hallName: 'Jananeta Abdul Mannan Hall',
    mealSlot: 'LUNCH',
    mealDate: '2026-11-11',
    amount: 65,
    paymentMethod: 'WALLET',
    orderStatus: 'REDEEMED',
    createdAt: '2026-11-11 08:25 AM'
  }
];

export const INITIAL_PAYMENTS: PaymentSubmission[] = [
  {
    id: 'pay-301',
    referenceId: 'BKSH-88412093A',
    studentId: 'IT-22084',
    studentName: 'Tanvir Ahmed',
    academicEmail: 'tanvir.it22084@mbstu.ac.bd',
    hallId: 'safh',
    hallName: 'Shaheed Abrar Fahad Hall',
    amount: 500,
    method: 'BKASH',
    submittedAt: '2026-11-12 09:42 AM',
    status: 'PENDING'
  },
  {
    id: 'pay-302',
    referenceId: 'NGD-44910281K',
    studentId: 'TE-22041',
    studentName: 'Mehedi Hasan Shuvo',
    academicEmail: 'mehedi.te22041@mbstu.ac.bd',
    hallId: 'jamh',
    hallName: 'Jananeta Abdul Mannan Hall',
    amount: 300,
    method: 'NAGAD',
    submittedAt: '2026-11-12 09:15 AM',
    status: 'PENDING'
  },
  {
    id: 'pay-303',
    referenceId: 'SLIP-SJJH-092',
    studentId: 'BG-23007',
    studentName: 'Farhana Yasmin',
    academicEmail: 'farhana.bg23007@mbstu.ac.bd',
    hallId: 'sjjh',
    hallName: 'Shahid Janoni Jahanara Imam Hall',
    amount: 600,
    method: 'HALL_OFFICE_CASH',
    submittedAt: '2026-11-11 03:20 PM',
    status: 'VERIFIED',
    verifiedBy: 'Prof. Dr. Mahmudul Hasan',
    verifiedAt: '2026-11-11 04:05 PM'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-201',
    studentId: 'IT-22084',
    date: '2026-11-12 08:10 AM',
    type: 'TOPUP',
    amount: 500,
    description: 'Wallet Recharge via bKash',
    referenceId: 'BKSH-992144812',
    paymentMethod: 'BKASH'
  },
  {
    id: 'tx-202',
    studentId: 'IT-22084',
    date: '2026-11-12 08:15 AM',
    type: 'TOKEN_PURCHASE',
    amount: -65,
    description: 'Purchased Lunch Token SAFH-20261112-L-084',
    referenceId: 'tok-101',
    paymentMethod: 'STUDENT_WALLET'
  },
  {
    id: 'tx-203',
    studentId: 'IT-22084',
    date: '2026-11-12 08:15 AM',
    type: 'TOKEN_PURCHASE',
    amount: -60,
    description: 'Purchased Dinner Token SAFH-20261112-D-084',
    referenceId: 'tok-102',
    paymentMethod: 'STUDENT_WALLET'
  }
];
