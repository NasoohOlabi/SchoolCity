import {
	PosType,
	TeacherType_nullValue,
	TeacherType_WildCard,
} from "../../Legacy/types";
import {
	IClass,
	Solver_Week,
	TeacherId,
	TranspositionInstruction,
} from "../Interfaces/Interfaces";

// testing git here


export const withoutPos = (lst: PosType[], pos: PosType) => {
	return lst.filter((p) => pos !== p);
};
export const removed = <T extends unknown>(S: T[], s: T) => {
	return S.slice(0, S.indexOf(s)).concat(S.slice(S.indexOf(s) + 1));
};
export const stringGuard = (arg: unknown): string => {
	if (typeof arg === "string") {
		return arg;
	} else {
		return "";
		//do sth
	}
};
const getHisActPeriods = (Class: IClass, teacher: TeacherId): PosType[] => {
	let result: PosType[] = [];
	Class.l.forEach((pos,ind) => {
		if (pos.currentTeacher === teacher) {
			result.push(ind);
		}		
	})
	return result;
};


const copyInstruction = (
	obj: TranspositionInstruction
): { pos: PosType; m: number; teacher: TeacherId } => {
	const res = Object();
	res.pos = obj.pos;
	res.m = obj.m;
	res.teacher = obj.teacher;
	return res;
};
const copyInstructions = (
	objects: TranspositionInstruction[]
): { pos: PosType; m: number; teacher: TeacherId }[] => {
	const res: any = [];
	objects.forEach((object) => {
		res.push(copyInstruction(object));
	});
	return res;
};
const pickAction = (
	teacher: TeacherId,
	m: number,
	week: Solver_Week
): actionType => {
	try {
		if (week.allClasses[m].teachers[teacher].remPeriods > 0) {
			return "shift";
		} else {
			return "cycle";
		}
	} catch {
		alert(`week.allClasses[${m}].teachers[${teacher}] is undefined`);
		// eslint-disable-next-line no-throw-literal
		throw "undefined teacher";
	}
};
const situation = (
	teacher: TeacherId,
	pos: PosType,
	m: number,
	week: Solver_Week
): { currTeacher: TeacherId; action: actionType; r: number } => {
	const ot = week.allClasses[m].l[pos].currentTeacher;
	const a = pickAction(teacher, m, week);
	const tmp = week.teacherSchedule[teacher][pos];
	if (typeof tmp === "number") {
		const r: number = tmp;
		return { currTeacher: ot, action: a, r };
	} else {
		throw {
			teacher,
			pos,
			m,
			week,
			message:
				"Trying to get the situation for an imposible case of teacher not in the school in the first case his schedule reads null! ",
		};
	}
};
function situationInt(s: {
	currTeacher: TeacherId;
	action: actionType;
	r: number;
}) {
	const { currTeacher: t, action: a, r } = s;
	if (t === TeacherType_nullValue) {
		if (a === "shift") {
			if (r === -1) {
				return 1;
			} else {
				return 2;
			}
		} else {
			if (r === -1) {
				return 3;
			} else {
				return 4;
			}
		}
	} else {
		if (a === "shift") {
			if (r === -1) {
				return 5;
			} else {
				return 6;
			}
		} else {
			if (r === -1) {
				return 7;
			} else {
				return 8;
			}
		}
	}
}

function ruffleShuffle(
	arr: { pos: PosType; m: number; teacher: TeacherId }[][],
	pivot: number
): { pos: PosType; m: number; teacher: TeacherId }[][] {
	// a = [0,1,2,3,4,5,6]
	// b = [0,1,2,3,4,5,6]
	if (pivot > arr.length || pivot < 0) {
		alert("Fuck!! went wrong. ruffleShuffle returned empty list");
	}
	const res = [];
	for (let i = 0; i < pivot; i++) {
		for (let j = pivot; j < arr.length; j++) {
			res.push(arr[i].concat(arr[j]));
		}
	}
	return res;
}
export type actionType = "shift" | "cycle";

export const util = {
	copyInstructions,
	copyInstruction,
	pickAction,
	situation,
	situationInt,
	ruffleShuffle,
	getHisActPeriods,
	removed,
};
