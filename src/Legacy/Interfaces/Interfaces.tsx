import {
	PosType,
	refreshTableType,
	tableFooterRefresherType,
} from "../../Legacy/types";
import { backtrack, takeOneOffTheStack } from "../Logic/CoreAlgo";
import { actionType, util } from "../Logic/util";
import ClassObj, { NUM_OF_DAYS, NUM_OF_PERIODS_PER_DAY } from "./ClassObj";

export type TeacherId = number;
/**
 * obj : {
 * pos: PosType,
 * m: number,
 * teacher: TeacherId}
 */
export type Transposition = TranspositionInstruction[];
export interface TranspositionInstruction {
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
export type callNodeType = {
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
	week: IWEEK_GLOBAL_Object;
	pivots: callNodeType[];
};

export type NodeProcessor = (
	vertex: callNodeType,
	queue: argumentsQueue
) => void;

export class argumentsQueue {
	queue: Queue<callNodeType> = new Queue<callNodeType>();
	_max: number = 500000;
	_accepting: boolean = true;
	// _stats = { preCalls: 0, reCalls: 0, pivotToCalls: 0 };
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
		if (!this._accepting) this._accepting = true;
		// if (this._accepting) console.log(`Max wasn't reached!`);
		// else {
		// 	console.log(`Max was reached ;( `);
		// 	this._accepting = true;
		// }
		// console.log(this);
		// const total =
		// 	this._stats.preCalls + this._stats.reCalls + this._stats.pivotToCalls;
		// const obj = {
		// 	...this._stats,
		// 	total,
		// 	stoped_at: this.queue.length(),
		// 	sched: total + this.queue.length(),
		// };
		// console.log(JSON.stringify(obj));
		// this._stats = { preCalls: 0, reCalls: 0, pivotToCalls: 0 };
	}
	length() {
		return this.queue.length();
	}
	eraseAll() {
		while (this.notEmpty()) {
			this.dequeue();
		}
	}
	callFront(
		re_fn: NodeProcessor,
		pre_fn: NodeProcessor,
		pivot_fn: NodeProcessor
	): void {
		const vertex = this.queue.front();
		if (vertex.callTo === "pull") {
			// this._stats.preCalls++;
			pre_fn(vertex, this);
		} else if (vertex.callTo === "push") {
			if (vertex.action !== undefined) {
				// this._stats.reCalls++;
				re_fn(vertex, this);
			} else
				throw { ...vertex, message: "Action not specified for re call" };
		} else if (vertex.callTo === "pivotTo") {
			if (vertex.pivotArgs !== undefined) {
				// this._stats.pivotToCalls++;
				pivot_fn(vertex, this);
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
export interface IMisc {
	depth?: number;
	actList_Length?: number;
	Pivots?: callNodeType[];
	baseLength?: number;
}
export interface lCellObj {
	currentTeacher: TeacherId;
	isCemented: boolean;
	Options: TeacherId[];
}
export interface IBasicTableProps {
	m: number;
	handleChange: any;
	cellInitializer: any;
	tableFooterInitializer: any;
	headRow: string[];
	headCol: string[];
	WEEK_GLOBAL_Object: IWEEK_GLOBAL_Object;
}
export interface TimeRemainingState {
	whatToSayIndex: number;
	total: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}
export interface ITableFooter {
	m: number;
	tableFooterInitializer: any;
	WEEK_GLOBAL_Object: IWEEK_GLOBAL_Object;
}
export enum Screen {
	ETA,
	TABLE,
	DATAPARSER,
}
export interface INavProps {
	UI: Screen;
	switchToTable: (event: any) => void;
	switchToETA: (event: any) => void;
	switchToDataParser: (event: any) => void;
}
export interface IMyAppBarProps {
	UI: Screen;
	switchToTable: (event: any) => void;
	switchToETA: (event: any) => void;
	switchToDataParser: (event: any) => void;
	toggleTheme: (event: any) => void;
	toggleLang: (event: any) => void;
	darkThemed: boolean;
}
export interface ICell {
	pos: PosType;
	cellInitializer: any;
	m: number;
	handleChange: (event: any) => void;
	WEEK_GLOBAL_Object: IWEEK_GLOBAL_Object;
}
export interface TeachersDictionary<T> {
	[index: TeacherId]: T;
}
export interface ITeacherSchedule {
	[index: TeacherId]: (number | null)[][];
}
export interface IAvailables {
	[index: TeacherId]: PosType[];
}
export interface IClassTeachers {
	[index: TeacherId]: ClassTeacherData;
}
export interface IWEEK_GLOBAL_Object {
	allClasses: ClassObj[];
	teachersGuild: TeacherId[];
	Swapping: boolean;
	currentSolutionNumber: number;
	activateList: TranspositionInstruction[][];
	availables: IAvailables;
	teacherSchedule: ITeacherSchedule;
	refreshTable?: (() => void)[][][];
	tableFooterRefresher?: (() => void)[];
	forceUpdate?: () => void;
}
export class WeekObj implements IWEEK_GLOBAL_Object {
	allClasses: ClassObj[] = [];
	teachersGuild: TeacherId[] = [];
	activateList: TranspositionInstruction[][] = [];
	availables: IAvailables = {};
	refreshTable: refreshTableType = [];
	tableFooterRefresher: tableFooterRefresherType = [];
	teacherSchedule: ITeacherSchedule = {};
	forceUpdate: () => void = () => {};
	Swapping = false;
	currentSolutionNumber = 0;
	constructor(...args: any[]) {
		if (
			args &&
			args.length === 1 &&
			args[0].allClasses &&
			args[0].teachersGuild &&
			args[0].availables
		) {
			const week = args[0];
			this.allClasses = week.allClasses;
			this.teachersGuild = week.teachersGuild;
			this.availables = week.availables;
			if (!week.refreshTable) {
				this.refreshTable = new Array(week.allClasses.length)
					.fill(null)
					.map((_) =>
						Array(NUM_OF_DAYS)
							.fill(null)
							.map(() =>
								Array(NUM_OF_PERIODS_PER_DAY)
									.fill(null)
									.map(() => () => {})
							)
					);
			} else {
				this.refreshTable = week.refreshTable;
			}
		}
	}
	public addClass() {
		const cls = new ClassObj();
		this.allClasses.push(cls);
		this.refreshTable.push(cls.refreshTable());
		this.tableFooterRefresher.push(() => {});
	}
	public addTeacher(
		ind: number,
		m: number,
		teacher: TeacherId,
		Periods: number
	) {
		this.teachersGuild[ind] = teacher;
		this.allClasses[m].addTeacher(teacher, Periods);
	}
	public teacherScheduleInit() {
		this.teachersGuild.forEach((teacher) => {
			this.teacherSchedule[teacher] = [...Array(NUM_OF_DAYS)].map((e) =>
				Array(NUM_OF_PERIODS_PER_DAY).fill(null)
			);
			this.availables[teacher].forEach(([X, Y]: PosType) => {
				this.teacherSchedule[teacher][X][Y] = -1;
			});
		});
	}
}
export interface IClass {
	l: lCellObj[][];
	Name: string;
	teachers: IClassTeachers;
}

export interface ClassTeacherData {
	Periods: number;
	remPeriods: number;
	periodsHere: PosType[];
	emptyAvailables: PosType[];
}
export interface IWeekData {
	allClasses: ClassObj[];
	teachersGuild: TeacherId[];
	Swapping: boolean;
	currentSolutionNumber: number;
	activateList: { pos: PosType; m: number; teacher: TeacherId }[][];
	availables: IAvailables;
	teacherSchedule: ITeacherSchedule;
}
export type ISomeHowPutHimAtWorkerMsg = [
	number,
	TeacherId,
	PosType,
	IWEEK_GLOBAL_Object,
	boolean?
];
