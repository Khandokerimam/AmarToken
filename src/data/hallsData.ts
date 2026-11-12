import { ResidentialHall, StudentProfile, MealToken, WalletTransaction } from '../types';

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
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
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
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
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
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
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
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
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
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
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
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
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
        cutoffTime: '5:00 PM',
        cutoffHoursRemaining: 6,
        price: 60,
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
  hallId: 'safh',
  hallName: 'Shaheed Abrar Fahad Hall',
  roomNumber: 'Room 314 (Block B)',
  department: 'Information and Communication Technology (ICT)',
  batch: '2021-22',
  walletBalance: 420,
  dietaryPreference: 'HALAL_NON_VEG',
  phone: '+880-1700-112233'
};

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
    price: 65,
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
    price: 60,
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
    price: 60,
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
    amount: -65,
    description: 'Purchased Lunch Token SAFH-20261112-L-084',
    referenceId: 'tok-101',
    paymentMethod: 'STUDENT_WALLET'
  },
  {
    id: 'tx-203',
    date: '2026-11-12 08:15 AM',
    type: 'TOKEN_PURCHASE',
    amount: -60,
    description: 'Purchased Dinner Token SAFH-20261112-D-084',
    referenceId: 'tok-102',
    paymentMethod: 'STUDENT_WALLET'
  }
];
