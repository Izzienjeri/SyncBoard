
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