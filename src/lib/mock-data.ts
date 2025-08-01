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



export const subjectScoreData: Record<string, SubjectScore[]> = {
  this_term: [ { name: "computer-science", averageScore: 95.1 }, { name: "physics", averageScore: 90.2 }, { name: "history", averageScore: 84.0 }, { name: "english", averageScore: 88.8 }, { name: "mathematics", averageScore: 89.5 } ],
  last_term: [ { name: "computer-science", averageScore: 93.5 }, { name: "physics", averageScore: 92.1 }, { name: "history", averageScore: 86.0 }, { name: "english", averageScore: 90.2 }, { name: "mathematics", averageScore: 87.5 } ],
  full_year: [ { name: "computer-science", averageScore: 94.1 }, { name: "physics", averageScore: 91.2 }, { name: "history", averageScore: 85.0 }, { name: "english", averageScore: 89.8 }, { name: "mathematics", averageScore: 88.5 } ],
};

export const attendanceData: StudentAttendance[] = [
  { month: "Jan", attendance: 95 }, { month: "Feb", attendance: 92 }, { month: "Mar", attendance: 93 }, { month: "Apr", attendance: 88 }, { month: "May", attendance: 90 }, { month: "Jun", attendance: 85 },
  { month: "Jul", attendance: 89 }, { month: "Aug", attendance: 91 }, { month: "Sep", attendance: 94 }, { month: "Oct", attendance: 96 }, { month: "Nov", attendance: 93 }, { month: "Dec", attendance: 87 },
];
