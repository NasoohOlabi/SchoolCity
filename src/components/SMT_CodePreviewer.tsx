import {
	flatCoordinatesMapperFactory,
	GridCoordinates,
	GridFactory,
	LoopOverGrid,
	myCrud,
	SchoolCityIDB,
	Section,
	Subject,
	Teacher,
} from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useContext, useEffect, useState } from "react";

export interface SMT_CodePreviewerProps {}

async function Convert(db: SchoolCityIDB, idList: number[] = [0, 1, 2, 3]) {
	// idList is a list of sectionIds to solve
	let sections: Section[];
	if (idList) sections = await db.section.where("id").anyOf(idList).toArray();
	else sections = (await myCrud.getAll("section", db)) as Section[];

	const teachers = (await db.teacher
		.where("id")
		.anyOf([
			...new Set(
				sections.flatMap((section) =>
					section.subjects.map(({ teacherId }) => teacherId)
				)
			),
		])
		.toArray()) as Teacher[];
	const teachersIdMp = new Map<IndexableType, Teacher>();
	teachers.forEach((t) => {
		if (t.id) teachersIdMp.set(t.id, t);
	});

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

	// intermediate data structure
	const IDS = sections.map((section) => {
		return section.subjects.map(({ teacherId, subjectId }) => {
			if (!teachersIdMp.get(teacherId) || !subjectsIdMp.get(subjectId)) {
				throw new Error(
					`section with id ${section.id}  has invalid teacherId ${teacherId}`
				);
			}
			return {
				teacher: teachersIdMp.get(teacherId),
				subject: subjectsIdMp.get(subjectId),
			};
		});
	}) as { teacher: Teacher; subject: Subject }[][];

	const gf = await GridFactory(db);

	const isTightScheduleTeacher = (targetTeacher: Teacher) => {
		const step1 = IDS.map((augSubjects) => {
			return augSubjects.map(({ teacher, subject }) =>
				targetTeacher.id === teacher.id ? subject.periods : 0
			);
		});
		const step2 = step1.map(
			(obj) =>
				targetTeacher.availability.length ===
				obj.reduce((acc, elem) => acc + elem, 0)
		);
		const step3 = step2.some((x) => x);
		if (step3) {
			console.log("say hi");
		}
		return step3;
	};
	const tightScheduleTeachersMap = new Map<number, boolean>();
	teachers.forEach((teacher) => {
		tightScheduleTeachersMap.set(
			teacher.id as number,
			isTightScheduleTeacher(teacher)
		);
	});

	const OptionsGrids: number[][][] = IDS.map((data) =>
		LoopOverGrid(gf(), (elem, x1, x2) => {
			const regularOptions = data
				.filter(({ teacher }) => teacher.schedule[x1][x2] === undefined)
				.map(({ teacher }) => teacher.id as number);
			const tightScheduleTeachers = regularOptions.filter((t) =>
				tightScheduleTeachersMap.get(t)
			);
			if (tightScheduleTeachers.length > 1) {
				throw new Error(
					`teachers ${JSON.stringify(
						tightScheduleTeachers
					)} can't share period ${x2} at day ${x1}`
				);
			} else if (tightScheduleTeachers.length === 1)
				return tightScheduleTeachers;
			else return regularOptions;
		}).flat()
	);
	const sectionIndexInOptionsGridsToIds = sections.map((s) => s.id as number);
	const idLimitInSection: Map<number, number>[] = IDS.map((section_in_IDS) => {
		const mp = new Map<number, number>();
		section_in_IDS.forEach(({ teacher, subject }) => {
			mp.set(teacher.id as number, subject.periods);
		});
		return mp;
	});

	const { days, periods } = await GridCoordinates(db);
	const mapper = await flatCoordinatesMapperFactory(db);
	const numberOfSections = sections.length;
	const sectionCells = days * periods;
	const numberOfCells = numberOfSections * sectionCells;
	const range = (n: number) => new Array(n).fill(null).map((e, i) => i);
	let smt = "";

	smt += `(declare-datatypes () ((Pair (PairOf (teacher Int) (periods Int)))))\n`;

	for (let i = 0; i < numberOfCells; i++) {
		smt += `(declare-fun cell${i} () Pair)\n`;
	}

	const sectionIndexes = range(numberOfSections);
	for (let i = 0; i < sectionCells; i++) {
		const cellsAtTheSameTimePeriod = sectionIndexes
			.map((j) => `(teacher cell${i + sectionCells * j})`)
			.join(" ");
		smt += `(assert (distinct ${cellsAtTheSameTimePeriod}))\n`;
	}

	for (let s = 0; s < numberOfSections; s++) {
		const cellsInSection = range(sectionCells).map(
			(x) => `cell${x + sectionCells * s}`
		);
		smt += `(assert (distinct ${cellsInSection.join(" ")}))\n`;
	}

	for (let section = 0; section < numberOfSections; section++) {
		// per section
		const flattenSectionCells = OptionsGrids[section];
		const teachersPeriods = idLimitInSection[section];
		for (
			let flatCellIndex = 0;
			flatCellIndex < flattenSectionCells.length;
			flatCellIndex++
		) {
			// per cell
			const cellOptions = flattenSectionCells[flatCellIndex];
			const cellOptionsPairs = cellOptions.flatMap((teacher) => {
				const limit = teachersPeriods.get(teacher);
				if (!limit) throw new Error(`teacher doesn't have limit`);
				const periodsEnumeration = range(limit).map((periodNumber) => [
					teacher,
					periodNumber,
				]);
				return periodsEnumeration;
			});
			const cellOptionsCondition = cellOptionsPairs
				.map(
					([teacher, periodNumber]) =>
						`(= cell${mapper._general(
							section,
							flatCellIndex,
							sectionCells
						)} (PairOf ${teacher} ${periodNumber}))`
				)
				.join(" ");

			smt += `(assert (or ${cellOptionsCondition} ))\n`;
		}
	}
	smt += `(check-sat)\n`;
	smt += `(get-model)`;

	return smt;
}

const SMT_CodePreviewer: ({}: SMT_CodePreviewerProps) => JSX.Element = ({}) => {
	const [conversion_result, set_conversion_result] = useState<string>("");
	const db = useContext(SchoolCityDBContext);
	if (!db) return <p>waiting for db</p>;

	useEffect(() => {
		// Convert(db).then(([gridCell, idCounts]) => {
		// 	set_conversion_result([gridCell, idCounts]);
		// });
		Convert(db).then((smt) => {
			set_conversion_result(smt);
		});
	}, []);

	return (
		<div>
			SMT_CodePreviewer
			<pre>{conversion_result}</pre>
		</div>
	);
};

export default SMT_CodePreviewer;

async function Convert_old_representation(
	db: SchoolCityIDB,
	idList?: number[]
) {
	// idList is a list of sectionIds to solve
	let sections: Section[];
	if (idList) sections = await db.section.where("id").anyOf(idList).toArray();
	else sections = (await myCrud.getAll("section", db)) as Section[];

	const teachers = (await db.teacher
		.where("id")
		.anyOf([
			...new Set(
				sections.flatMap((section) =>
					section.subjects.map(({ teacherId }) => teacherId)
				)
			),
		])
		.toArray()) as Teacher[];
	const teachersIdMp = new Map<IndexableType, Teacher>();
	teachers.forEach((t) => {
		if (t.id) teachersIdMp.set(t.id, t);
	});

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

	// intermediate data structure
	const IDS = sections.map((section) => {
		return section.subjects.map(({ teacherId, subjectId }) => {
			if (!teachersIdMp.get(teacherId) || !subjectsIdMp.get(subjectId)) {
				throw new Error(
					`section with id ${section.id}  has invalid teacherId ${teacherId}`
				);
			}
			return {
				teacher: teachersIdMp.get(teacherId),
				subject: subjectsIdMp.get(subjectId),
			};
		});
	}) as { teacher: Teacher; subject: Subject }[][];

	const gf = await GridFactory(db);

	const a: number[][][][] = IDS.map((data) =>
		LoopOverGrid(gf(), (elem, x1, x2) => {
			return data
				.filter(({ teacher }) => teacher.schedule[x1][x2] === undefined)
				.map(({ teacher }) => teacher.id as number);
		})
	);
	const OptionsGrids: number[][] = IDS.flatMap((data) =>
		LoopOverGrid(gf(), (elem, x1, x2) => {
			return data
				.filter(({ teacher }) => teacher.schedule[x1][x2] === undefined)
				.map(({ teacher }) => teacher.id as number);
		}).flat()
	);
	const sectionIndexInOptionsGridsToIds = sections.map((s) => s.id as number);
	const idLimitInSection: Map<number, number>[] = IDS.map((section_in_IDS) => {
		const mp = new Map<number, number>();
		section_in_IDS.forEach(({ teacher, subject }) => {
			mp.set(teacher.id as number, subject.periods);
		});
		return mp;
	});

	const { days, periods } = await GridCoordinates(db);
	const mapper = await flatCoordinatesMapperFactory(db);
	const numberOfSections = sections.length;
	const sectionCells = days * periods;
	const numberOfCells = numberOfSections * sectionCells;
	const range = (n: number) => new Array(n).fill(null).map((e, i) => i);
	let smt = "";

	const equ = `(define-fun equ ((x Int) (y Int)) Int (ite (= x y) 1 0))\n`;
	smt += equ;

	for (let i = 0; i < numberOfCells; i++) {
		smt += `(declare-fun cell${i} () Int)\n`;
	}

	const sectionIndexes = range(numberOfSections);
	for (let i = 0; i < sectionCells; i++) {
		const cellsAtTheSameTimePeriod = sectionIndexes
			.map((j) => `cell${i + sectionCells * j}`)
			.join(" ");
		smt += `(assert (distinct ${cellsAtTheSameTimePeriod}))\n`;
	}

	if (numberOfCells !== OptionsGrids.length)
		throw new Error(
			`numberOfCells !== OptionsGrids.length ${numberOfCells} !== ${OptionsGrids.length}`
		);
	for (let i = 0; i < OptionsGrids.length; i++) {
		const cellOptions = OptionsGrids[i];
		let cellOptionsCondition = "";
		for (let j = 0; j < cellOptions.length; j++) {
			cellOptionsCondition += ` (= cell${i} ${cellOptions[j]}) `;
		}
		smt += `(assert (or ${cellOptionsCondition} ))\n`;
	}

	idLimitInSection.forEach((sectionLimitMap, s) => {
		const cellsInSection = range(sectionCells).map(
			(x) => `cell${x + sectionCells * s}`
		);
		sectionLimitMap.forEach((limit, id, mp) => {
			const ones_zeros = cellsInSection
				.map((cell) => `(equ ${id} ${cell})`)
				.join(" ");
			const count = `(+ ${ones_zeros})`;
			const condition = `(assert (= ${count} ${limit}))`;
			smt += condition + "\n";
		});
	});

	return smt;
}
