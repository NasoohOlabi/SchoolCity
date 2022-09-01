import { PosType } from "../../Legacy/types";
import { backtrack, takeOneOffTheStack } from "../Logic/CoreAlgo";
import { actionType, util } from "../Logic/util";

type TeacherId = number;
/**
 * obj : {
 * pos: PosType,
 * m: number,
 * teacher: TeacherId}
 */
type Transposition = TranspositionInstruction[];
interface TranspositionInstruction {
	pos: PosType;
	m: number;
	teacher: TeacherId;
}
export class Queue<T> {
	_store: T[] = [];
	Empty(): boolean {
		return this._store.length === 0;
	}
	length(): number {
		return this._store.length;
	}
	notEmpty(): boolean {
		return !this.Empty();
	}
	enqueue(val: T) {
		this._store.push(val);
	}
	dequeue(): void {
		this._store.shift();
	}
	front(): T {
		return this._store[0];
	}
}
/**
 * PivotParent.stackLength is the number of pivots we are waiting to resolve once they do we'll consider this a solution
 * in other word the number of pointers keeping the obj alive!
 */
type callNodeType = {
	teacher: TeacherId;
	pos: PosType;
	m: number;
	callTo: "pull" | "push" | "pivotTo" | "nothing";
	parent: callNodeType | undefined | null;
	pivotArgs?: {
		next_m: number;
		/**
		 * @type callNodeType with Parent preferably undefined
		 */
		AfterReChainNode?: callNodeType;
		beforeReChainNode: callNodeType | null;
	};
	cycleClosingParentName?: TeacherId;
	action?: actionType;
	week: Solver_Week;
	pivots: callNodeType[];
};

type NodeProcessor = (vertex: callNodeType, queue: argumentsQueue) => void;

export class argumentsQueue {
	queue: Queue<callNodeType>;
	// _max: number = 100000;
	_max: number;
	constructor(size: number | undefined) {
		this._max = size || 100000;
		this.queue = new Queue<callNodeType>();
		console.log(`constructed a queue Sized ${this._max}`);
	}
	_accepting: boolean = true;
	_stats = {
		pullCalls: 0,
		nodesFromPull: 0,
		pushCalls: 0,
		nodesFromPush: 0,
		pivotToCalls: 0,
		nodesFromPivot: 0,
	};
	Empty(): boolean {
		return this.queue.Empty();
	}
	notEmpty(): boolean {
		return !this.Empty();
	}
	enqueue(val: callNodeType): boolean {
		if (this._accepting && this.queue.length() < this._max) {
			this.queue.enqueue(val);
			return true;
		}
		this._accepting = false;
		return false;
	}
	dequeue(): void {
		this.queue.dequeue();
	}
	unlock(): void {
		if (this._accepting) console.log(`Max wasn't reached!`);
		else console.log(`Max was reached ;( `);

		this._accepting = true;

		// console.log(this);
		this._stats.nodesFromPivot /= this._stats.pivotToCalls;
		this._stats.nodesFromPull /= this._stats.pullCalls;
		this._stats.nodesFromPush /= this._stats.pushCalls;
		const total =
			this._stats.pullCalls +
			this._stats.pushCalls +
			this._stats.pivotToCalls;
		const obj = {
			...this._stats,
			total,
			size: this._max,
			stoped_at: this.queue.length(),
			sched: total + this.queue.length(),
		};
		console.log(JSON.stringify(obj, null, 2));
		this._stats = {
			pullCalls: 0,
			pushCalls: 0,
			pivotToCalls: 0,
			nodesFromPivot: 0,
			nodesFromPull: 0,
			nodesFromPush: 0,
		};
	}
	length() {
		return this.queue.length();
	}
	eraseAll() {
		while (this.notEmpty()) {
			this.dequeue();
		}
	}
	front() {
		return this.queue.front();
	}
	callFront(
		re_fn: NodeProcessor,
		pre_fn: NodeProcessor,
		pivot_fn: NodeProcessor
	): void {
		const vertex = this.queue.front();
		const pre_processing_length = this.length();
		if (vertex.callTo === "pull") {
			this._stats.pullCalls++;
			pre_fn(vertex, this);
			this._stats.nodesFromPull +=
				this.queue._store.length - pre_processing_length;
		} else if (vertex.callTo === "push") {
			if (vertex.action !== undefined) {
				this._stats.pushCalls++;
				re_fn(vertex, this);
				this._stats.nodesFromPush +=
					this.queue._store.length - pre_processing_length;
			} else
				throw { ...vertex, message: "Action not specified for re call" };
		} else if (vertex.callTo === "pivotTo") {
			if (vertex.pivotArgs !== undefined) {
				this._stats.pivotToCalls++;
				pivot_fn(vertex, this);
				this._stats.nodesFromPivot +=
					this.queue._store.length - pre_processing_length;
			} else {
				throw {
					...vertex,
					message: "callTo pivotTo with missing pivotArgs",
				};
			}
		} else if (vertex.callTo === "nothing") {
			// console.warn(`considering nothing a solution : `, vertex);
			if (vertex.pivots.length !== 0) {
				takeOneOffTheStack(vertex, this);
			} else {
				const solution = backtrack(vertex);
				vertex.week.activateList.push(util.copyInstructions(solution));
			}
		}
	}
}

/**
 * { depth?: number,
 * actList_Length?:number,
 * Pivots?: PivotsCallStack,
 * baseLength? : number}
 */
interface IMisc {
	depth?: number;
	actList_Length?: number;
	Pivots?: callNodeType[];
	baseLength?: number;
}
interface lCellObj {
	currentTeacher: TeacherId;
	isCemented: boolean;
	Options: TeacherId[];
}
interface IBasicTableProps {
	m: number;
	handleChange: any;
	headRow: string[];
	headCol: string[];
	WEEK_GLOBAL_Object: Solver_Week;
}
interface TimeRemainingState {
	whatToSayIndex: number;
	total: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}
interface ITableFooter {
	m: number;
	// tableFooterInitializer: any;
	WEEK_GLOBAL_Object: Solver_Week;
}
interface INavProps {
	switchToTable: (event: any) => void;
	switchToETA: (event: any) => void;
	switchToDataParser: (event: any) => void;
}
interface IMyAppBarProps {
	switchToTable: (event: any) => void;
	switchToETA: (event: any) => void;
	switchToDataParser: (event: any) => void;
	toggleTheme: (event: any) => void;
	toggleLang: (event: any) => void;
	darkThemed: boolean;
}
interface ICell {
	pos: PosType;
	// cellInitializer: any;
	m: number;
	handleChange: (event: any) => void;
	WEEK_GLOBAL_Object: Solver_Week;
}

interface TeachersDictionary<T> {
	[index: TeacherId]: T;
}
type ITeacherSchedule = (number | null)[][][];

type IAvailables = PosType[][];

type IClassTeachers = ClassTeacherData[];

interface Solver_Week {
	allClasses: IClass[];
	teachersGuild: TeacherId[];
	Swapping: boolean;
	currentSolutionNumber: number;
	activateList: TranspositionInstruction[][];
	availables: IAvailables;
	teacherSchedule: ITeacherSchedule;
	NUM_OF_PERIODS_PER_DAY: number;
	NUM_OF_DAYS: number;
	forceUpdate?: () => void;
}
export const Solver_Week_util = {
	addClass(week: Solver_Week) {
		const cls: IClass = {
			l: [],
			Name: "",
			teachers: [],
		};
		week.allClasses.push(cls);
		// this.refreshTable.push(cls.refreshTable());
		// this.tableFooterRefresher.push(() => {});
	},
	removeTeacher: (Class: IClass, teacher: TeacherId) => {
		delete Class.teachers[teacher];
	},
	addTeacher(
		week: Solver_Week,
		ind: number,
		m: number,
		teacher: TeacherId,
		Periods: number
	) {
		week.teachersGuild[ind] = teacher;
		week.allClasses[m].teachers[teacher] = {
			Periods: Periods,
			remPeriods: Periods,
			emptyAvailables: [],
			periodsHere: [],
		};
	},
	teacherScheduleInit(week: Solver_Week) {
		week.teachersGuild.forEach((teacher) => {
			week.teacherSchedule[teacher] = [...Array(week.NUM_OF_DAYS)].map((e) =>
				Array(week.NUM_OF_PERIODS_PER_DAY).fill(null)
			);
			week.availables[teacher].forEach(([X, Y]: PosType) => {
				week.teacherSchedule[teacher][X][Y] = -1;
			});
		});
	},
};
interface IClass {
	l: lCellObj[][];
	Name: string;
	teachers: IClassTeachers;
}

interface ClassTeacherData {
	Periods: number;
	remPeriods: number;
	periodsHere: PosType[];
	emptyAvailables: PosType[];
}

type ISomeHowPutHimAtWorkerMsg = [
	number,
	TeacherId,
	PosType,
	Solver_Week,
	boolean?
];

type SectionId = number;
export type {
	SectionId,
	ICell,
	TeacherId,
	Transposition,
	TranspositionInstruction,
	callNodeType,
	NodeProcessor,
	IMisc,
	lCellObj,
	IBasicTableProps,
	TimeRemainingState,
	ITableFooter,
	INavProps,
	IMyAppBarProps,
	TeachersDictionary,
	ITeacherSchedule,
	IAvailables,
	IClassTeachers,
	Solver_Week,
	IClass,
	ClassTeacherData,
	ISomeHowPutHimAtWorkerMsg,
};
