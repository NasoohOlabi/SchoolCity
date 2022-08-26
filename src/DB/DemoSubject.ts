import { Subject } from "./schema";

// subject: "++id,&name,gradeId", // periods, full Mark,  description, teacherIds
const DemoSubjects: Subject[] = [
	{ name: "teacher 9 subject", periods: 2, gradeId: 0 },
	{ name: "teacher 10 subject", periods: 4, gradeId: 0 },
	{ name: "teacher 11 subject", periods: 2, gradeId: 0 },
	{ name: "teacher 16 subject", periods: 2, gradeId: 0 },
	{ name: "teacher 17 subject", periods: 3, gradeId: 0 },
	{ name: "teacher 18 subject", periods: 2, gradeId: 0 },
	{ name: "teacher 19 subject", periods: 3, gradeId: 0 },
	{ name: "teacher 22 subject", periods: 1, gradeId: 0 },
	{ name: "teacher 23 subject", periods: 2, gradeId: 0 },
	{ name: "teacher 25 subject", periods: 5, gradeId: 0 },
	{ name: "teacher 26 subject", periods: 1, gradeId: 0 },
	{ name: "teacher 27 subject", periods: 1, gradeId: 0 },
	{ name: "teacher 28 subject", periods: 1, gradeId: 0 },
	{ name: "teacher 29 subject", periods: 6, gradeId: 0 },
	{ name: "teacher 0 subject", periods: 3, gradeId: 1 },
	{ name: "teacher 1 subject", periods: 3, gradeId: 1 },
	{ name: "teacher 9 subject", periods: 2, gradeId: 1 },
	{ name: "teacher 11 subject", periods: 2, gradeId: 1 },
	{ name: "teacher 12 subject", periods: 4, gradeId: 1 },
	{ name: "teacher 16 subject", periods: 1, gradeId: 1 },
	{ name: "teacher 17 subject", periods: 3, gradeId: 1 },
	{ name: "teacher 18 subject", periods: 2, gradeId: 1 },
	{ name: "teacher 19 subject", periods: 3, gradeId: 1 },
	{ name: "teacher 22 subject", periods: 1, gradeId: 1 },
	{ name: "teacher 23 subject", periods: 2, gradeId: 1 },
	{ name: "teacher 26 subject", periods: 1, gradeId: 1 },
	{ name: "teacher 27 subject", periods: 1, gradeId: 1 },
	{ name: "teacher 28 subject", periods: 1, gradeId: 1 },
	{ name: "teacher 29 subject", periods: 6, gradeId: 1 },
	{ name: "teacher 2 subject", periods: 3, gradeId: 2 },
	{ name: "teacher 3 subject", periods: 3, gradeId: 2 },
	{ name: "teacher 9 subject", periods: 2, gradeId: 2 },
	{ name: "teacher 11 subject", periods: 3, gradeId: 2 },
	{ name: "teacher 12 subject", periods: 6, gradeId: 2 },
	{ name: "teacher 13 subject", periods: 4, gradeId: 2 },
	{ name: "teacher 14 subject", periods: 6, gradeId: 2 },
	{ name: "teacher 16 subject", periods: 1, gradeId: 2 },
	{ name: "teacher 18 subject", periods: 3, gradeId: 2 },
	{ name: "teacher 22 subject", periods: 1, gradeId: 2 },
	{ name: "teacher 26 subject", periods: 1, gradeId: 2 },
	{ name: "teacher 27 subject", periods: 1, gradeId: 2 },
	{ name: "teacher 28 subject", periods: 1, gradeId: 2 },
	{ name: "teacher 0 subject", periods: 2, gradeId: 3 },
	{ name: "teacher 2 subject", periods: 3, gradeId: 3 },
	{ name: "teacher 4 subject", periods: 3, gradeId: 3 },
	{ name: "teacher 9 subject", periods: 2, gradeId: 3 },
	{ name: "teacher 10 subject", periods: 6, gradeId: 3 },
	{ name: "teacher 11 subject", periods: 3, gradeId: 3 },
	{ name: "teacher 13 subject", periods: 3, gradeId: 3 },
	{ name: "teacher 16 subject", periods: 1, gradeId: 3 },
	{ name: "teacher 18 subject", periods: 2, gradeId: 3 },
	{ name: "teacher 19 subject", periods: 2, gradeId: 3 },
	{ name: "teacher 22 subject", periods: 2, gradeId: 3 },
	{ name: "teacher 24 subject", periods: 4, gradeId: 3 },
	{ name: "teacher 26 subject", periods: 1, gradeId: 3 },
	{ name: "teacher 27 subject", periods: 1, gradeId: 3 },
	{ name: "teacher 0 subject", periods: 2, gradeId: 4 },
	{ name: "teacher 2 subject", periods: 3, gradeId: 4 },
	{ name: "teacher 4 subject", periods: 2, gradeId: 4 },
	{ name: "teacher 5 subject", periods: 3, gradeId: 4 },
	{ name: "teacher 9 subject", periods: 2, gradeId: 4 },
	{ name: "teacher 13 subject", periods: 3, gradeId: 4 },
	{ name: "teacher 14 subject", periods: 4, gradeId: 4 },
	{ name: "teacher 15 subject", periods: 4, gradeId: 4 },
	{ name: "teacher 16 subject", periods: 1, gradeId: 4 },
	{ name: "teacher 18 subject", periods: 2, gradeId: 4 },
	{ name: "teacher 20 subject", periods: 2, gradeId: 4 },
	{ name: "teacher 21 subject", periods: 3, gradeId: 4 },
	{ name: "teacher 22 subject", periods: 2, gradeId: 4 },
	{ name: "teacher 26 subject", periods: 1, gradeId: 4 },
	{ name: "teacher 27 subject", periods: 1, gradeId: 4 },
	{ name: "teacher 24 subject", periods: 4, gradeId: 4 },
	{ name: "teacher 2 subject", periods: 3, gradeId: 5 },
	{ name: "teacher 5 subject", periods: 4, gradeId: 5 },
	{ name: "teacher 6 subject", periods: 3, gradeId: 5 },
	{ name: "teacher 7 subject", periods: 3, gradeId: 5 },
	{ name: "teacher 8 subject", periods: 4, gradeId: 5 },
	{ name: "teacher 9 subject", periods: 1, gradeId: 5 },
	{ name: "teacher 14 subject", periods: 4, gradeId: 5 },
	{ name: "teacher 15 subject", periods: 5, gradeId: 5 },
	{ name: "teacher 20 subject", periods: 2, gradeId: 5 },
	{ name: "teacher 21 subject", periods: 5, gradeId: 5 },
	{ name: "teacher 22 subject", periods: 1, gradeId: 5 },
];

export default DemoSubjects;
