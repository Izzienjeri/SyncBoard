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
