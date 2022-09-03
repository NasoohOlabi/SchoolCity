/* eslint-disable no-throw-literal */
import { useState } from "react";
//import { IBasicTableProps } from "../Components/BasicTable";
import { PosType, TeacherType_nullValue } from "../../Legacy/types";
import {
	IClass,
	Solver_Week,
	TeacherId,
	TranspositionInstruction,
} from "../Interfaces/Interfaces";
import { someHowPutHimAt } from "./CoreAlgo";
import { util, withoutPos } from "./util";
export function fill(week: Solver_Week) {
	const availables = week.availables;
	const allClasses: IClass[] = week.allClasses;
	allClasses.forEach((Class, m) => {
		Class.l.forEach((elem, pos) => {
			Class.teachers.forEach((tData, tID) => {
				if (!tData) return;
				let [periods, PosList] = [tData.remPeriods, tData.emptyAvailables];
				if (availables[tID].includes(pos) && periods > 0) {
					Class.l[pos].Options.push(tID);
					PosList.push(pos);
				}
			});
		});
		CementNoOtherOptionButToPutHere(allClasses, m, week);
	});
}
const noOtherOptionButToPutHere = (m: number, week: Solver_Week) => {
	const Class = week.allClasses[m];
	Class.teachers.forEach((t, teacher) => {
		if (!t) return;
		if (t.remPeriods === t.emptyAvailables.length) {
			t.emptyAvailables.forEach((pos: PosType) => {
				if (
					1 === util.situationInt(util.situation(teacher, pos, m, week))
				) {
					putHimAt(week, m, teacher, pos, "put");
				}
			});
		}
	});
};
const autoFill = function (m: number, week: Solver_Week) {
	const Class = week.allClasses[m];
	for (let pos = 0; pos < Class.l.length; pos++) {
		const RealOptions = actualOptions(pos, m, week);
		if (
			RealOptions.length === 1 &&
			Class.l[pos].currentTeacher === TeacherType_nullValue
		) {
			//do the change
			putHimAt(week, m, RealOptions[0], pos, "put");

			//go back to the start to see if your changes affected what you have already checked
			pos = 0;
		}
	}
};
function comp(c: IClass) {
	let acc = 0;
	c.teachers.forEach((teacherData, tId) => {
		acc += teacherData.emptyAvailables.length;
	});
	return acc;
}
export function randomFiller(week: Solver_Week) {
	const allClasses = week.allClasses;
	const sortedAllClasses = [...allClasses].sort(
		(Class1, Class2) => comp(Class1) - comp(Class2)
	);
	sortedAllClasses.forEach((Class) => {
		const m = allClasses.map((c) => c.Name).indexOf(Class.Name);
		Class.l.forEach((_, pos) => {
			if (
				Class.l[pos].currentTeacher === TeacherType_nullValue &&
				Class.l[pos].Options.length !== 0 &&
				!Class.l[pos].isCemented
			) {
				const aOptions: TeacherId[] = actualOptions(pos, m, week);
				if (aOptions.length > 0) {
					// const teacher =
					// 	aOptions[Math.floor(Math.random() * aOptions.length)];
					const teacher = aOptions[0];
					putHimAt(week, m, teacher, pos, "put");
				}
				sortedAllClasses.forEach((Class, m) => {
					noOtherOptionButToPutHere(m, week);
					autoFill(m, week);
				});
			}
		});
	});
}
export function useForceUpdate() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [value, setValue] = useState(0); // integer state
	return () => setValue((value) => value + 1); // update the state to force render
}
export function actualOptions(
	pos: PosType,
	m: number,
	week: Solver_Week,
	command: "unfiltered" | "filtered" = "unfiltered"
) {
	const options = week.allClasses[m].l[pos].Options;
	const res: TeacherId[] = options.filter((teacher) => {
		return (
			week.teacherSchedule[teacher][pos] === -1 &&
			week.allClasses[m].teachers[teacher].remPeriods > 0
		);
	});
	if (command === "filtered" && res.length === 0) {
		return options;
	}
	return res;
}
export const teacherHasNoMoreemptyAvailables = (
	teacher: TeacherId,
	teachersList: any
): boolean => {
	if (teachersList[teacher] === undefined)
		console.log(`teachersList[${teacher}] = undefined`, teachersList);
	return teachersList[teacher].remPeriods < 1;
};
export const putHimAt = function (
	week: Solver_Week,
	m: number,
	teacher: TeacherId,
	pos: PosType,
	op: "put" | "remove"
) {
	const doit: boolean = op === "put";
	const allClasses = week.allClasses;
	const teachers = allClasses[m].teachers;
	if (doit) {
		if (
			!teacherHasNoMoreemptyAvailables(teacher, teachers) &&
			allClasses[m].l[pos].currentTeacher === TeacherType_nullValue &&
			week.teacherSchedule[teacher][pos] === -1
		) {
			allClasses[m].l[pos].currentTeacher = teacher;
			teachers[teacher].remPeriods--;
			teachers[teacher].periodsHere.push(pos);
			teachers.forEach((tData, t) => {
				if (!tData) return;
				tData.emptyAvailables = withoutPos(tData.emptyAvailables, pos);
			});
			week.teacherSchedule[teacher][pos] = m;
			// if (week.refreshTable !== undefined) {
			// 	week.refreshTable[m][X][Y]();
			// }
		} else {
			console.warn(
				`Illegal put ${teacher} in ${week.allClasses[m].Name} in ${pos}`
			);
			console.log(`
			!teacherHasNoMoreemptyAvailables(teacher, teachers) &&
			allClasses[m].l[pos].currentTeacher === TeacherType_nullValue &&
			week.teacherSchedule[teacher][pos] === -1 ==>

			!teacherHasNoMoreemptyAvailables(
				${teacher},
				${JSON.stringify(teachers)}
			) = ${teacherHasNoMoreemptyAvailables(teacher, teachers)} &&
			allClasses[${m}].l[${pos}].currentTeacher = ${
				allClasses[m].l[pos].currentTeacher
			} === ${TeacherType_nullValue} &&
			week.teacherSchedule[${teacher}][${pos}] = ${
				week.teacherSchedule[teacher][pos]
			} === -1
			`);
			return false;
		}
	} else {
		if (allClasses[m].l[pos].currentTeacher !== TeacherType_nullValue) {
			const theTeacherBeingRemoved = allClasses[m].l[pos].currentTeacher;
			allClasses[m].l[pos].currentTeacher = TeacherType_nullValue;
			teachers[theTeacherBeingRemoved].remPeriods++;
			teachers[theTeacherBeingRemoved].periodsHere = withoutPos(
				teachers[theTeacherBeingRemoved].periodsHere,
				pos
			);
			// allClasses[m].l[pos].Options = removed(allClasses[m].l[pos].Options,teacher);
			teachers.forEach((teacherData, t) => {
				if (teacherData && week.availables[t].includes(pos)) {
					teacherData.emptyAvailables.push(pos);
				}
			});
			week.teacherSchedule[theTeacherBeingRemoved][pos] = -1;
			// if (week.refreshTable !== undefined) {
			// 	week.refreshTable[m][X][Y]();
			// }
		}
	}
	return true;
};
export const CementNoOtherOptionButToPutHere = (
	School: IClass[],
	m: number,
	week: Solver_Week
) => {
	const Class = School[m];
	Class.teachers.forEach((teacherData, t) => {
		if (!teacherData) return;
		let [periods, PosList] = [
			teacherData.remPeriods,
			teacherData.emptyAvailables,
		];
		if (periods === PosList.length) {
			PosList.forEach((pos) => {
				putHimAt(week, m, +t, pos, "put");
				Class.l[pos].isCemented = true;
			});
		}
	});
};
export const fastForward = (
	week: Solver_Week,
	iterativeSolutionPoster?: (changes: TranspositionInstruction[]) => void
) => {
	console.time("fast");
	week.allClasses.forEach((Class: IClass, m: number) => {
		const empties: PosType[] = [];
		Class.l.forEach((cellData, pos) => {
			if (
				cellData.currentTeacher !== TeacherType_nullValue ||
				cellData.isCemented
			)
				return;
			else empties.push(pos);
		});
		console.log(`Class ${Class.Name} empties = `, empties);
		console.log(`Class ${Class.Name} count empties = `, empties.length);
		empties.forEach((pos: PosType) => {
			const teachers = Class.l[pos].Options.sort(
				(a, b) => 0.5 - Math.random()
			);
			let ind = 0;
			while (
				Class.l[pos].currentTeacher === TeacherType_nullValue &&
				ind < teachers.length
			) {
				const teacher = Class.l[pos].Options[ind];
				const s = `iter: ${teacher} in ${Class.Name} in ${pos}`;
				console.time(s);
				someHowPutHimAt(m, teacher, pos, week, iterativeSolutionPoster);
				console.timeEnd(s);
				ind++;
			}
		});
	});
	console.timeEnd("fast");
};

//alert(`here in [${x},${y}] calling with ${School[i].l[x][y].Options[0]}  who ${(teacherHasNoMoreemptyAvailables(School[i].l[x][y].Options[0] ,School[i].teachers)?'has NOOOOO more':'has more')}`);
