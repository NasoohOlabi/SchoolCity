/* eslint-disable no-throw-literal */
import { useState } from "react";
//import { IBasicTableProps } from "../Components/BasicTable";
import { PosType, TeacherType_nullValue } from "../../Legacy/types";
import {
	IClass,
	IWEEK_GLOBAL_Object,
	TeacherId,
	TranspositionInstruction,
} from "../Interfaces/Interfaces";
import { someHowPutHimAt } from "./CoreAlgo";
import { contains, loopOverClass, withoutPos } from "./util";
export function fill(week: IWEEK_GLOBAL_Object) {
	const availables = week.availables;
	const allClasses: IClass[] = week.allClasses;
	allClasses.forEach((Class, m) => {
		loopOverClass((x, y) => {
			// scanning the teachers in the class
			Object.keys(Class.teachers).forEach((tID) => {
				const tData = Class.teachers[+tID];
				let [periods, PosList] = [tData.remPeriods, tData.emptyAvailables];
				if (contains(availables[+tID], [x, y]) && periods > 0) {
					Class.l[x][y].Options.push(+tID);
					PosList.push([x, y]);
				}
			});
		});
		CementNoOtherOptionButToPutHere(allClasses, m, week);
	});
}
// const noOtherOptionButToPutHere = (m: number, week: IWEEK_GLOBAL_Object, changeCellPost: (change: TranspositionInstruction) => void) => {
// 	const Class = week.allClasses[m];
// 	Object.keys(Class.teachers).forEach((teacher) => {
// 		const t = Class.teachers[teacher]
// 		if (t !== undefined &&
// 			t.remPeriods === t.emptyAvailables.length) {
// 			t.emptyAvailables.forEach((Pos: PosType) => {
// 				if (1 === util.situationInt(util.situation(teacher, Pos, m, week))) {
// 					changeCellPost({ teacher, m, Pos })
// 					putHimAt(week, m, teacher, Pos, "put");
// 				}
// 			});
// 		}
// 	});
// };
// const autoFill = function (
// 	m: number,
// 	week: IWEEK_GLOBAL_Object,
// 	changeCellPost: (change: TranspositionInstruction) => void
// ) {
// 	let xxx = 0;
// 	const Class = week.allClasses[m]
// 	for (let x = 0; x < Class.l.length; x++) {
// 		for (let y = 0; y < Class.l[x].length; y++) {
// 			const RealOptions = actualOptions([x, y], m, week)
// 			if (RealOptions.length === 1 && Class.l[x][y].currentTeacher === '') {
// 				//do the change
// 				changeCellPost({ teacher: RealOptions[0], m, Pos: [x, y] })
// 				putHimAt(week, m, RealOptions[0], [x, y], "put")

// 				//go back to the start to see if your changes affected what you have already checked
// 				if (xxx < 100) {
// 					x = 0; y = 0;
// 					xxx++;
// 				}
// 				else {
// 					alert(`OK here is the deal infinite loop \n Again `);
// 				}
// 			}
// 		}
// 	}
// }

export function randomFiller(
	week: IWEEK_GLOBAL_Object,
	changeCellPost?: (change: TranspositionInstruction) => void
) {
	const allClasses = week.allClasses;
	for (let m = 0; m < allClasses.length; m++) {
		const Class = allClasses[m];
		loopOverClass((i: number, j: number) => {
			if (
				Class.l[i][j].currentTeacher === TeacherType_nullValue &&
				Class.l[i][j].Options.length !== 0 &&
				!Class.l[i][j].isCemented
			) {
				const aOptions: TeacherId[] = actualOptions([i, j], m, week);
				if (aOptions.length > 0) {
					const teacher =
						aOptions[Math.floor(Math.random() * aOptions.length)];
					changeCellPost && changeCellPost({ pos: [i, j], teacher, m });
					putHimAt(week, m, teacher, [i, j], "put");
					// noOtherOptionButToPutHere(m, week, changeCellPost)
					// autoFill(m, week, changeCellPost)
				}
			}
		});
	}
}
export function useForceUpdate() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [value, setValue] = useState(0); // integer state
	return () => setValue((value) => value + 1); // update the state to force render
}
export function actualOptions(
	Pos: PosType,
	m: number,
	week: IWEEK_GLOBAL_Object,
	command: "unfiltered" | "filtered" = "unfiltered"
) {
	const [X, Y] = Pos;
	const options = week.allClasses[m].l[X][Y].Options;
	const res: TeacherId[] = options.filter((teacher) => {
		return (
			week.teacherSchedule[teacher][X][Y] === -1 &&
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
	week: IWEEK_GLOBAL_Object,
	m: number,
	teacher: TeacherId,
	Pos: PosType,
	op: "put" | "remove"
) {
	const doit: boolean = op === "put";
	const allClasses = week.allClasses;
	const [X, Y] = Pos;
	const teachers = allClasses[m].teachers;
	if (doit) {
		if (
			!teacherHasNoMoreemptyAvailables(teacher, teachers) &&
			allClasses[m].l[X][Y].currentTeacher === TeacherType_nullValue &&
			week.teacherSchedule[teacher][X][Y] === -1
		) {
			allClasses[m].l[X][Y].currentTeacher = teacher;
			teachers[teacher].remPeriods--;
			teachers[teacher].periodsHere.push(Pos);
			Object.keys(teachers).forEach((t) => {
				const tData = teachers[+t];
				tData.emptyAvailables = withoutPos(tData.emptyAvailables, Pos);
			});
			week.teacherSchedule[teacher][X][Y] = m;
			if (week.refreshTable !== undefined) {
				week.refreshTable[m][X][Y]();
			}
		} else {
			console.warn(
				`Illegal put ${teacher} in ${week.allClasses[m].Name} in [${Pos[0]},${Pos[1]}]`
			);
		}
	} else {
		if (allClasses[m].l[X][Y].currentTeacher !== TeacherType_nullValue) {
			const theTeacherBeingRemoved = allClasses[m].l[X][Y].currentTeacher;
			allClasses[m].l[X][Y].currentTeacher = TeacherType_nullValue;
			teachers[theTeacherBeingRemoved].remPeriods++;
			teachers[theTeacherBeingRemoved].periodsHere = withoutPos(
				teachers[theTeacherBeingRemoved].periodsHere,
				Pos
			);
			// allClasses[m].l[X][Y].Options = removed(allClasses[m].l[X][Y].Options,teacher);
			Object.keys(teachers).forEach((t) => {
				const teacherData = teachers[+t];
				if (contains(week.availables[+t], Pos)) {
					teacherData.emptyAvailables.push(Pos);
				}
			});
			week.teacherSchedule[theTeacherBeingRemoved][X][Y] = -1;
			if (week.refreshTable !== undefined) {
				week.refreshTable[m][X][Y]();
			}
		}
	}
};
export const CementNoOtherOptionButToPutHere = (
	School: IClass[],
	m: number,
	week: IWEEK_GLOBAL_Object
) => {
	const Class = School[m];
	Object.keys(Class.teachers).forEach((t) => {
		const teacherData = Class.teachers[+t];
		let [periods, PosList] = [
			teacherData.remPeriods,
			teacherData.emptyAvailables,
		];
		if (periods === PosList.length) {
			PosList.forEach((Pos) => {
				putHimAt(week, m, +t, Pos, "put");
				Class.l[Pos[0]][Pos[1]].isCemented = true;
			});
		}
	});
};
export const fastForward = (
	week: IWEEK_GLOBAL_Object,
	iterativeSolutionPoster?: (changes: TranspositionInstruction[]) => void
) => {
	console.time("fast");
	week.allClasses.forEach((Class: IClass, m: number) => {
		const empties: PosType[] = [];
		loopOverClass((u: number, v: number) => {
			if (
				Class.l[u][v].currentTeacher !== TeacherType_nullValue ||
				Class.l[u][v].isCemented
			)
				return;
			else empties.push([u, v]);
		});
		empties.forEach((Pos: PosType) => {
			const [u, v] = Pos;
			const teachers = Class.l[u][v].Options.sort(
				(a, b) => 0.5 - Math.random()
			);
			let ind = 0;
			while (
				Class.l[u][v].currentTeacher === TeacherType_nullValue &&
				ind < teachers.length
			) {
				const teacher = Class.l[u][v].Options[ind];
				const s = `iter: ${teacher} in ${Class.Name} in [${u},${v}]`;
				console.time(s);
				someHowPutHimAt(
					m,
					teacher,
					[u, v],
					week,
					false,
					iterativeSolutionPoster,
					true
				);
				console.timeEnd(s);
				ind++;
			}
		});
	});
	console.timeEnd("fast");
};

//alert(`here in [${x},${y}] calling with ${School[i].l[x][y].Options[0]}  who ${(teacherHasNoMoreemptyAvailables(School[i].l[x][y].Options[0] ,School[i].teachers)?'has NOOOOO more':'has more')}`);
