import DemoSections from "./DemoSections"
import DemoSectionSubjectTeacher from "./DemoSectionTeacher"
import demoTeachers from "./DemoTeachers"

const demoAdminstrators = [{ "phoneNumber": "555", "name": "mary", "supervisor": 1, "email": "", "schoolId": 1 }]

const demoGrades = [
	{ "number": 7, "sectionIds": [1, 2], "adminstrator": 1 }, { "number": 8, "sectionIds": [3, 4], "adminstrator": 1 }, { "number": 9, "sectionIds": [5, 6], "adminstrator": 1 }, { "number": 10, "sectionIds": [7, 8], "adminstrator": 1 }, { "number": 11, "sectionIds": [9, 10], "adminstrator": 1 }, { "number": 12, "sectionIds": [11], "adminstrator": 1 }]

const demoSubjects = [{ "name": "math" }]

const demoSchool = { name: "Demo", description: "This is a demo school for tutorials", sectionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], vicePrincipalId: [1] }

const demo = {
	administrator: demoAdminstrators,
	grade: demoGrades,
	school: demoSchool,
	subject: demoSubjects,
	teacher: demoTeachers,
	section: DemoSections,
	sectionSubjectTeacher: DemoSectionSubjectTeacher
}

export default demo