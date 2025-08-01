
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
  name:string;
}

export const periodStats = {
  this_term: { passRate: "85.3%", passRateChange: "-1.2%", isPassRateNegative: true, avgAttendance: "91%", changeLabel: "This Term" },
  last_term: { passRate: "86.5%", passRateChange: "+0.5%", isPassRateNegative: false, avgAttendance: "89%", changeLabel: "Last Term" },
  full_year: { passRate: "85.9%", passRateChange: "+2.1%", isPassRateNegative: false, avgAttendance: "90%", changeLabel: "Full Year" },
};

export const gradeDistributionData: Record<string, GradeDistribution[]> = {
  this_term: [ { grade: "A", count: 23 }, { grade: "B", count: 40 }, { grade: "C", count: 25 }, { grade: "D", count: 8 }, { grade: "F", count: 4 } ],
  last_term: [ { grade: "A", count: 25 }, { grade: "B", count: 45 }, { grade: "C", count: 20 }, { grade: "D", count: 7 }, { grade: "F", count: 3 } ],
  full_year: [ { grade: "A", count: 24 }, { grade: "B", count: 42 }, { grade: "C", count: 22 }, { grade: "D", count: 8 }, { grade: "F", count: 4 } ],
};

export const subjectScoreData: Record<string, SubjectScore[]> = {
  this_term: [ { name: "computer-science", averageScore: 95.1 }, { name: "physics", averageScore: 90.2 }, { name: "history", averageScore: 84.0 }, { name: "english", averageScore: 88.8 }, { name: "mathematics", averageScore: 89.5 } ],
  last_term: [ { name: "computer-science", averageScore: 93.5 }, { name: "physics", averageScore: 92.1 }, { name: "history", averageScore: 86.0 }, { name: "english", averageScore: 90.2 }, { name: "mathematics", averageScore: 87.5 } ],
  full_year: [ { name: "computer-science", averageScore: 94.1 }, { name: "physics", averageScore: 91.2 }, { name: "history", averageScore: 85.0 }, { name: "english", averageScore: 89.8 }, { name: "mathematics", averageScore: 88.5 } ],
};

export const attendanceData: StudentAttendance[] = [
  { month: "Jan", attendance: 95 }, { month: "Feb", attendance: 92 }, { month: "Mar", attendance: 93 }, { month: "Apr", attendance: 88 }, { month: "May", attendance: 90 }, { month: "Jun", attendance: 85 },
  { month: "Jul", attendance: 89 }, { month: "Aug", attendance: 91 }, { month: "Sep", attendance: 94 }, { month: "Oct", attendance: 96 }, { month: "Nov", attendance: 93 }, { month: "Dec", attendance: 87 },
];

