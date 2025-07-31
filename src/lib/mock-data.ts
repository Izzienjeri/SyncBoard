// This file contains all the mock data used to populate the dashboard components.
// It now includes data for BOTH the original and the new dashboard designs to ensure all components work.

// --- Types for Mock Data ---
type Sale = {
    name: string;
    total: number;
  };
  
  type BestSeller = {
    name: string;
    sales: number;
    revenue: number;
    image: string;
  };
  
  type MediaMetric = {
    name: string;
    spend: number;
    clicks: number;
    conversions: number;
  };
  
  type Campaign = {
    id: number;
    name: string;
    status: "Live" | "Paused" | "Draft" | "Finished";
    spend: number;
    clicks: number;
    conversions: number;
  };
  
// --- Types for Student Dashboard ---
export type StudentAttendance = {
    month: string;
    attendance: number;
};

export type GradeDistribution = {
    grade: string;
    count: number;
};

export type SubjectScore = {
    name: string;
    averageScore: number;
};

// --- Data for the ORIGINAL dashboard design (for sales-chart.tsx and best-sellers.tsx) ---
  
  export const salesData: Sale[] = [
    { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
  ];
  
  export const bestSellersData: BestSeller[] = [
    {
      name: "Fjallraven - Foldsack No. 1",
      sales: 1250,
      revenue: 137487.5,
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    },
    {
      name: "Mens Casual Premium Slim Fit T-Shirts",
      sales: 980,
      revenue: 21754,
      image:
        "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    },
    {
      name: "John Hardy Women's Legends Necklace",
      sales: 450,
      revenue: 314550,
      image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    },
    {
      name: "WD 2TB Elements Portable Hard Drive",
      sales: 820,
      revenue: 53218,
      image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    },
  ];
  
// --- Data for the ORIGINAL Media Dashboard ---
  export const mediaData: MediaMetric[] = [
    { name: "Jan", spend: 4000, clicks: 2400, conversions: 240 },
    { name: "Feb", spend: 3000, clicks: 1398, conversions: 221 },
    { name: "Mar", spend: 2000, clicks: 9800, conversions: 229 },
    { name: "Apr", spend: 2780, clicks: 3908, conversions: 200 },
    { name: "May", spend: 1890, clicks: 4800, conversions: 218 },
    { name: "Jun", spend: 2390, clicks: 3800, conversions: 250 },
    { name: "Jul", spend: 3490, clicks: 4300, conversions: 210 },
    { name: "Aug", spend: 4100, clicks: 5200, conversions: 310 },
    { name: "Sep", spend: 3800, clicks: 4900, conversions: 290 },
    { name: "Oct", spend: 5200, clicks: 6100, conversions: 450 },
    { name: "Nov", spend: 5500, clicks: 6800, conversions: 510 },
    { name: "Dec", spend: 6100, clicks: 7500, conversions: 620 },
  ];
  
  export const campaignsData: Campaign[] = [
    {
      id: 1,
      name: "Summer Sale 2024",
      status: "Live",
      spend: 12500,
      clicks: 8200,
      conversions: 450,
    },
    {
      id: 2,
      name: "Back to School",
      status: "Paused",
      spend: 8800,
      clicks: 5100,
      conversions: 210,
    },
    {
      id: 3,
      name: "Holiday Special",
      status: "Draft",
      spend: 0,
      clicks: 0,
      conversions: 0,
    },
    {
      id: 4,
      name: "New Product Launch",
      status: "Live",
      spend: 25000,
      clicks: 15300,
      conversions: 980,
    },
    {
      id: 5,
      name: "Q3 Brand Awareness",
      status: "Finished",
      spend: 15000,
      clicks: 18000,
      conversions: 320,
    },
  ];

// --- Data for Student Dashboard ---

export const attendanceData: StudentAttendance[] = [
    { month: "Jan", attendance: 95 },
    { month: "Feb", attendance: 92 },
    { month: "Mar", attendance: 93 },
    { month: "Apr", attendance: 88 },
    { month: "May", attendance: 90 },
    { month: "Jun", attendance: 85 },
    { month: "Jul", attendance: 89 },
    { month: "Aug", attendance: 91 },
    { month: "Sep", attendance: 94 },
    { month: "Oct", attendance: 96 },
    { month: "Nov", attendance: 93 },
    { month: "Dec", attendance: 87 },
];

export const gradeData: GradeDistribution[] = [
    { grade: "A", count: 28 },
    { grade: "B", count: 55 },
    { grade: "C", count: 32 },
    { grade: "D", count: 12 },
    { grade: "F", count: 5 },
];

export const topSubjectsData: SubjectScore[] = [
    { name: "Computer Science", averageScore: 95 },
    { name: "Physics", averageScore: 92 },
    { name: "Mathematics", averageScore: 88 },
    { name: "English Literature", averageScore: 85 },
    { name: "History", averageScore: 81 },
];
