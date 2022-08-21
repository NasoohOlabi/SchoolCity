import demo from "./Demo";
import { Administrator, Grade, School, SchoolCityIDB, Section, Subject, Teacher } from "./schema";
const {
	administrator
	, grade
	, school
	, subject
	, teacher
	, section
	, sectionSubjectTeacher
} = demo
const importableDemo = (
	demoSchool: typeof school
	, demoSectionSubjectTeacher: typeof sectionSubjectTeacher
	, demoSubjects: typeof subject
	, demoTeachers: typeof teacher
	, demoAdministrators: typeof administrator
	, demoSections: typeof section
	, demoGrades: typeof grade
) => {
	try {
		return {
			// school: new School(demoSchool.name, demoSchool.description, demoSchool.sectionIds, demoSchool.vicePrincipalId)
			// , sectionSubjectTeacher: new SectionSubject(demoSectionSubjectTeacher.name, demoSectionSubjectTeacher.teacherIds)
			// subject: Subject.fromJSONArray(demoSubjects)
			// , teacher: Teacher.fromJSONArray(demoTeachers)
			// , administrator: Administrator.fromJSONArray(demoAdministrators)
			// , section: Section.fromJSONArray(demoSections)
			// , grade: Grade.fromJSONArray(demoGrades)
		}
	} catch (error) {
		console.log(error)
	}

}
const importDemo = async ({
	school,
	// sectionTeacher,
	subject,
	teacher,
	administrator,
	section,
	grade }: {
		school: School
		// , sectionTeacher: SectionTeacher
		, subject: Subject
		, teacher: Teacher
		, administrator: Administrator
		, section: Section
		, grade: Grade
	}) => async (db: SchoolCityIDB) => {
		const schoolId = await db.school.add(school)
	}




export default importDemo;


/*

let ans = {};
let e = (l1,l2)=>{
	 if (l1.length !== l2.length)return false
	 else for(let i = 0 ;i<l1.length;i++){
		  if (l1[i] !== l2[i])
				return false
	 }
	 return true
}

ans.teachers = week.teachersGuild.map((t)=>{
	 return {name:t,availables:week.availables[t],schedule:log(g(),(x,y,ttt)=>{
		  return week.availables[t].some(elem => e(elem,[x,y]))?-1:null
	 })}
})
ans.sections = week.allClasses.map(Class=>{
	 return {schedule:log(Class.l,(x,y,ttt)=>{
		  return { isCemented: ttt.isCemented, teacherId: undefined}
	 }),name:Class.Name,grade: +Class.Name[5],grade: +Class.Name[12]||+Class.Name[11]}
})
ans.sectionTeachers = week.allClasses.map(Class=>{
	 return Object.keys(Class.teachers).map((k,ind)=> {
		  return {sectionId:ind,teacherId:week.teachersGuild.indexOf(k),periods:Class.teachers[k].Periods}
	 })
})

ans.adminstrators = [{phoneNumber:'555',name:'mary',supervisor:1,email:'',schoolId:1}]

ans.grades = [7,8,9,10,11,12].map(x=>{
	 return {number:x,sectionIds:[x-6,x-5],adminstrator:1}
})

ans.subjects = [{name:"math"}]

// console.log(ans)
console.log(JSON.stringify(ans))


*/