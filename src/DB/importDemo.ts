import { IndexableType } from "dexie";
import { Administrator, Grade, School, SchoolCityIDB, SchoolCityIDBTable, Section, Subject, Teacher } from "./schema";

const importDemo = ({
	school,
	subjects,
	teachers,
	administrators,
	sections,
	grades
}: {
	school: School
	// , sectionTeacher: SectionTeacher
	, subjects: Subject[]
	, teachers: Teacher[]
	, administrators: Administrator[]
	, sections: Section[]
	, grades: Grade[]
}) => (db: SchoolCityIDB) => {
	let last: any = null
	db.transaction('rw', ['template', 'school', 'administrator', 'grade', 'teacher', 'subject', 'section'] as SchoolCityIDBTable[], async (trans) => {
		const db = trans.db as SchoolCityIDB

		// const demoTemplateCnt = await db.template.where({ name: 'Demo', type: 'school' } as Template).count()
		// if (demoTemplateCnt !== 0) {
		// 	return;
		// }

		// const demoTemplate = { name: 'Demo', type: 'school', description: 'Demo Template to jump start your Experience includes high & middle school in Syria' } as Template

		// last = demoTemplate
		// const templateId = await db.template.add(demoTemplate)
		const demoSchoolCnt = await db.school.where({ name: school.name } as School).count()
		if (demoSchoolCnt !== 0) {
			return;
		}

		last = school
		const schoolId = await db.school.add(school)
		console.log('schoolId = ', schoolId);

		const administratorIds: IndexableType[] = []
		for (const administrator of administrators) {
			last = administrator
			const x = await db.administrator.add({ ...administrator, schoolId: schoolId } as Administrator)
			administratorIds.push(x)
		}
		console.log('administratorIds = ', administratorIds);

		last = school
		db.school.update(schoolId, { vicePrincipalId: administratorIds[school.vicePrincipalId] })
		console.log()

		const gradeIds: IndexableType[] = []
		for (const grade of grades) {
			const x = await db.grade.add({ ...grade, administratorId: administratorIds[grade.administratorId], schoolId: schoolId } as Grade)
			gradeIds.push(x)
		}

		const teacherIds: IndexableType[] = []
		for (const teacher of teachers) {
			const x = await db.teacher.add(teacher as Teacher)
			teacherIds.push(x)
		}

		const subjectIds: IndexableType[] = []
		for (const subject of subjects) {
			const x = await db.subject.add({ ...subject, gradeId: gradeIds[subject.gradeId] } as Subject)
			subjectIds.push(x)
		}

		const sectionIds: IndexableType[] = []
		for (const section of sections) {
			const x = await db.section.add({
				...section
				, subjects: section.subjects.map(({ teacherId, subjectId }) => {
					return {
						teacherId: teacherIds[teacherId],
						subjectId: subjectIds[subjectId]
					}
				})
				, gradeId: gradeIds[section.gradeId]
				, schoolId: schoolId
			} as Section)
			sectionIds.push(x)
		}

		db.school.update(schoolId, { sectionIds: sectionIds } as School)

	}).catch(reason => {
		console.log('import transaction failed for this reason ', reason)
		console.log('last = ', last);
	})
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