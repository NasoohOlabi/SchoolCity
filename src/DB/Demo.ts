import DemoSections from "./DemoSections";
import DemoSubjects from "./DemoSubject";
import demoTeachers from "./DemoTeachers";
import { Administrator, Grade, School, Section, Subject, Teacher } from "./schema";

const demoAdministrators: Administrator[] = [
	{
		phoneNumber: "555",
		name: "mary",
		supervisorId: null,
		email: "",
		schoolId: "Demo",
		subordinates: []
	},
];

const demoGrades: Grade[] = [
	{ number: 7, name: "Demo grade 7", administratorId: 0, schoolId: "Demo" },
	{ number: 8, name: "Demo grade 8", administratorId: 0, schoolId: "Demo" },
	{ number: 9, name: "Demo grade 9", administratorId: 0, schoolId: "Demo" },
	{ number: 10, name: "Demo grade 10", administratorId: 0, schoolId: "Demo" },
	{ number: 11, name: "Demo grade 11", administratorId: 0, schoolId: "Demo" },
	{ number: 12, name: "Demo grade 12", administratorId: 0, schoolId: "Demo" },
];

const demoSchool = {
	name: "Demo",
	description: "This is a demo school for tutorials",
	sectionIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	vicePrincipalId: 0,
};

const demo: {
	school: School
	, subjects: Subject[]
	, teachers: Teacher[]
	, administrators: Administrator[]
	, sections: Section[]
	, grades: Grade[]
} = {
	school: demoSchool,
	administrators: demoAdministrators,
	grades: demoGrades,
	teachers: demoTeachers,
	sections: DemoSections,
	subjects: DemoSubjects,
};

export default demo;
