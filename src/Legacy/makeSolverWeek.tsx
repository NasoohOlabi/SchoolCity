import {
	DirectFlatCoordinatesMapper,
	Grid,
	GridCoordinates,
	LoopOverGrid,
	myCrud,
	SchoolCityIDB,
	Section,
	Subject,
	Teacher,
} from "DB/schema";
import { IndexableType } from "dexie";
import {
	ClassTeacherData,
	IAvailables,
	IClass,
	IClassTeachers,
	ITeacherSchedule,
	lCellObj,
	Solver_Week,
} from "./Interfaces/Interfaces";

export default async function makeSolverWeek(
	db: SchoolCityIDB,
	idList?: number[]
) {
	// idList is a list of sectionIds to solve
	let sections: Section[];
	if (idList) sections = await db.section.where("id").anyOf(idList).toArray();
	else sections = (await myCrud.getAll("section", db)) as Section[];

	const { days, periods } = await GridCoordinates(db);

	const mapper = DirectFlatCoordinatesMapper({ days, periods });

	const teachersIds = [
		...new Set(
			sections.flatMap((section) =>
				section.subjects.map(({ teacherId }) => teacherId)
			)
		),
	];

	const teachersGuild = (await db.teacher
		.where("id")
		.anyOf(teachersIds)
		.toArray()) as Teacher[];
	const teachersIdMp = new Map<IndexableType, Teacher>();

	teachersGuild.forEach((t) => {
		if (t.id) teachersIdMp.set(t.id, t);
	});

	const availables: IAvailables = [];
	teachersGuild.forEach(({ id, availability }) => {
		if (id)
			availables[id] = availability.map((pos) =>
				mapper.inGrid.to1d(pos[0], pos[1])
			);
	});
	const teacherSchedule: ITeacherSchedule = [];
	teachersGuild.forEach(({ id, schedule }) => {
		if (id) teacherSchedule[id] = schedule.flat();
	});
	const NUM_OF_PERIODS_PER_DAY = periods;
	const NUM_OF_DAYS = days;

	const subjects = (await db.subject
		.where("id")
		.anyOf([
			...new Set(
				sections.flatMap((section) =>
					section.subjects.map(({ subjectId }) => subjectId)
				)
			),
		])
		.toArray()) as Subject[];
	const subjectsIdMp = new Map<IndexableType, Subject>();
	subjects.forEach((s) => {
		if (s.id) subjectsIdMp.set(s.id, s);
	});

	const allClasses: IClass[] = sections.map((s) => {
		const l: lCellObj[][] = s.schedule
			? LoopOverGrid(s.schedule, ({ teacherId, pinned }) => {
					return {
						currentTeacher: teacherId,
						isCemented: pinned,
						Options: [],
					} as lCellObj;
			  })
			: LoopOverGrid(Grid(days, periods), () => {
					return {
						currentTeacher: -1,
						isCemented: false,
						Options: [],
					} as lCellObj;
			  });
		const teachers: IClassTeachers = [];
		s.subjects.forEach(({ teacherId, subjectId }) => {
			teachers[teacherId] = {
				Periods: subjectsIdMp.get(subjectId)?.periods,
				emptyAvailables: [],
				periodsHere: [],
				remPeriods: subjectsIdMp.get(subjectId)?.periods,
			} as ClassTeacherData;
		});
		return {
			l: l.flat(),
			Name: s.name,
			teachers,
		};
	});

	return {
		allClasses,
		activateList: [],
		availables,
		currentSolutionNumber: -1,
		NUM_OF_DAYS,
		NUM_OF_PERIODS_PER_DAY,
		Swapping: false,
		teacherSchedule,
		teachersGuild,
		forceUpdate: undefined,
	} as Solver_Week;
}
