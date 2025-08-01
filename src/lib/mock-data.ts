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

export type Teacher = {
  id: number;
  name: string;
};

export const periodStats = {
  this_term: {
    passRate: "85.3%",
    passRateChange: "-1.2%",
    isPassRateNegative: true,
    avgAttendance: "91%",
    changeLabel: "This Term",
  },
  last_term: {
    passRate: "86.5%",
    passRateChange: "+0.5%",
    isPassRateNegative: false,
    avgAttendance: "89%",
    changeLabel: "Last Term",
  },
  full_year: {
    passRate: "85.9%",
    passRateChange: "+2.1%",
    isPassRateNegative: false,
    avgAttendance: "90%",
    changeLabel: "Full Year",
  },
};

export const gradeDistributionData: Record<string, GradeDistribution[]> = {
  this_term: [
    { grade: "A", count: 23 }, { grade: "B", count: 40 }, { grade: "C", count: 25 }, { grade: "D", count: 8 }, { grade: "F", count: 4 },
  ],
  last_term: [
    { grade: "A", count: 25 }, { grade: "B", count: 45 }, { grade: "C", count: 20 }, { grade: "D", count: 7 }, { grade: "F", count: 3 },
  ],
  full_year: [
    { grade: "A", count: 24 }, { grade: "B", count: 42 }, { grade: "C", count: 22 }, { grade: "D", count: 8 }, { grade: "F", count: 4 },
  ],
};

export const subjectScoreData: Record<string, SubjectScore[]> = {
  this_term: [
    { name: "computer-science", averageScore: 95.1 },
    { name: "physics", averageScore: 90.2 },
    { name: "history", averageScore: 84.0 },
    { name: "english", averageScore: 88.8 },
    { name: "mathematics", averageScore: 89.5 },
    { name: "biology", averageScore: 85.5 },
    { name: "chemistry", averageScore: 87.9 },
    { name: "art-history", averageScore: 91.3 },
    { name: "philosophy", averageScore: 92.0 },
    { name: "economics", averageScore: 86.4 },
    { name: "political-science", averageScore: 89.1 },
    { name: "music-theory", averageScore: 93.7 },
  ],
  last_term: [
    { name: "computer-science", averageScore: 93.5 },
    { name: "physics", averageScore: 92.1 },
    { name: "history", averageScore: 86.0 },
    { name: "english", averageScore: 90.2 },
    { name: "mathematics", averageScore: 87.5 },
    { name: "biology", averageScore: 84.0 },
    { name: "chemistry", averageScore: 88.2 },
    { name: "art-history", averageScore: 89.9 },
    { name: "philosophy", averageScore: 93.1 },
    { name: "economics", averageScore: 85.0 },
    { name: "political-science", averageScore: 88.0 },
    { name: "music-theory", averageScore: 91.5 },
  ],
  full_year: [
    { name: "computer-science", averageScore: 94.1 },
    { name: "physics", averageScore: 91.2 },
    { name: "history", averageScore: 85.0 },
    { name: "english", averageScore: 89.8 },
    { name: "mathematics", averageScore: 88.5 },
    { name: "biology", averageScore: 84.8 },
    { name: "chemistry", averageScore: 88.0 },
    { name: "art-history", averageScore: 90.5 },
    { name: "philosophy", averageScore: 92.5 },
    { name: "economics", averageScore: 85.7 },
    { name: "political-science", averageScore: 88.5 },
    { name: "music-theory", averageScore: 92.6 },
  ]
};

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

export const allSubjects: string[] = [
  "mathematics",
  "physics",
  "history",
  "english",
  "computer-science",
  "biology",
  "chemistry",
  "art-history",
  "philosophy",
  "economics",
  "political-science",
  "music-theory",
];

export const mockTeachers: Teacher[] = [
  { id: 1, name: "Dr. Evelyn Reed" },
  { id: 2, name: "Mr. Samuel Carter" },
  { id: 3, name: "Ms. Eleanor Vance" },
  { id: 4, name: "Prof. Arthur Chen" },
  { id: 5, name: "Dr. Isabella Rossi" },
  { id: 6, name: "Mr. Benjamin Grant" },
  { id: 7, name: "Ms. Olivia Hayes" },
  { id: 8, name: "Prof. Liam Goldberg" },
];

export const subjectTeacherMapping: Record<string, number[]> = {
  "mathematics": [1, 6],
  "physics": [4, 1],
  "history": [3, 7],
  "english": [2, 5],
  "computer-science": [4, 8],
  "biology": [5, 1],
  "chemistry": [5, 4],
  "art-history": [3],
  "philosophy": [7],
  "economics": [2, 6],
  "political-science": [7, 8],
  "music-theory": [3, 2],
};
