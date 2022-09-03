import type { IndexableType, Table } from "dexie";
import Dexie from "dexie";
import initializeSettings from "./initializeSettings";
import initializeTemplates from "./initializeTemplates";
import { SettingName } from "./Settings";

const stores = {
	student: "++id,firstName,lastName,fatherName,motherName,schoolId", // section, guardianPhoneNumber, studentPhoneNumber
	grade: "++id,number,name,schoolId", // description, sectionIds, administrator
	// &name is sth like first grade or 'صف أول'
	section: "++id,name,schoolId,number,gradeId", // {subjectId,teacherId}[] , description, studentIds, schedule
	// grade is foreign key to grade
	// schedule sectionSubjectId[][]
	administrator: "++id,phoneNumber,&name,supervisorId,email,schoolId",
	teacher: "++id,phoneNumber,&name", // description, email, schedule, availability, sectionSubjectIds
	// id autoIncremented for performance since it'll be used in Z3 is section
	// schedule is section[][]
	// availability is list of day period pairs... [0,2]===[startWeek,second]
	settings: "++id,[name+schoolId]", // description, value
	// &name ex: workdays:6 | periodsPerDay:5
	// startWeek:Sunday
	subject: "++id,name,gradeId,schoolId", // periods, full Mark,  description, teacherIds, MarkHeader
	// you can either just use teachers and say this teacher is in this section
	// or you can say that this section is having math and it's this teacher teaching it
	mark: "++id,&name,subjectId,sectionId,schoolId", // description
	template: "++id,&name,type,schoolId", // value, description
	school: "name", // sectionIds,vicePrincipalId , description
	theme: "++id,&name,schoolId", // description
	user: "uid" // photo name User
};

export const OM = {
	pk: (table: SchoolCityIDBTable) => table === 'school' ? 'name' : table === 'user' ? 'uid' : 'id',
	str: (item: any): string => (item.name || item.uid || item.id || '') + '',
	identifier: (item: any, table?: SchoolCityIDBTable) => (!table && (item.id || item.name || item.uid)) || (table === 'school' ? item.name : (item.id || item.uid))
}
type ObjectStores = typeof stores;

type SchoolCityIDBSchema = {
	[Property in keyof ObjectStores]: Table;
};

type SchoolCityIDBTable = keyof SchoolCityIDBSchema;

type SchoolCityIDB = SchoolCityIDBSchema & Dexie;

export const initializeDB = (): SchoolCityIDB & Dexie => {
	const db = new Dexie("school");
	// data base should contain a year worth of information
	db.version(4).stores(stores);

	const mydb = db as SchoolCityIDB;

	initializeSettings(mydb);
	initializeTemplates(mydb);

	// @ts-ignore
	window.db = mydb

	return mydb;
};

interface SchoolCityObjectModel {
	id?: number;
}

export const myCrud = {
	getAll: async <T extends SchoolCityObjectModel>(
		table: SchoolCityIDBTable,
		db: SchoolCityIDB,
		options?: {
			where: { [key: string]: any }
		}
	): Promise<T[]> => {
		if (options)
			return db[table].where(options.where).toArray().catch((e) => {
				console.log(`getAll ${table} error = `, e);
				throw e;
			});
		else
			return db[table].toArray().catch((e) => {
				console.log(`getAll ${table} error = `, e);
				throw e;
			});
	},
	get: async (
		table: SchoolCityIDBTable,
		db: SchoolCityIDB,
		id: IndexableType
	): Promise<any> => {
		return db[table].get(id).catch((e) => {
			console.log(`get ${table} error = `, e);
			throw e;
		});
	},
	add: async (
		table: SchoolCityIDBTable,
		db: SchoolCityIDB,
		data: any
	): Promise<any> => {
		return await db.transaction("rw", db[table], async () => {
			if (data.id === undefined) {
				return db[table].add(data);
			}
			const id = data.id;
			delete data.id;
			return db[table].add(data, id).catch((e) => {
				console.log(`add ${table} error = `, e);
				throw e;
			});
		});
	},
	update: async (
		table: SchoolCityIDBTable,
		db: SchoolCityIDB,
		data: any,
		key?: IndexableType
	): Promise<any> => {
		const pk = key || (table === 'school') ? 'name' : (table === 'user') ? 'uid' : 'id'
		if (data[pk] === undefined) return myCrud.add(table, db, data);
		else
			return db[table].update(data[pk], data).catch((e) => {
				console.log(`update ${table} error = `, e);
				throw e;
			});
	},
	delete: async (
		table: SchoolCityIDBTable,
		db: SchoolCityIDB,
		id: IndexableType
	): Promise<any> => {
		return db[table].delete(id).catch((e) => {
			console.log(`delete ${table} error = `, e);
			throw e;
		});
	},
};

interface Setting extends SchoolCityObjectModel {
	name: string;
	description?: string;
	schoolId: string | 'global';
	value?: any;
}
const blankSetting = () => {
	return {
		name: "",
		description: "",
		schoolId: 'global',
		value: undefined as any,
	} as Setting;
};
interface Template extends SchoolCityObjectModel {
	name: string;
	description?: string;
	type: SchoolCityIDBTable;
	value?: any;
	schoolId: string;
}
const blankTemplate = () => {
	return {
		name: "",
		schoolId: "",
		description: "",
		type: "school",
		value: undefined,
	} as Template;
};

interface School {
	name: string;
	vicePrincipalId: number;
	sectionIds: number[];
	description?: string;
}
const blankSchool = () => {
	return {
		name: "",
		vicePrincipalId: 0,
		sectionIds: [],
		description: "",
	} as School;
};

interface Grade extends SchoolCityObjectModel {
	number: number;
	name: string;
	description?: string;
	administratorId: number;
	schoolId: string
}
const blankGrade = () => {
	return {
		number: 0,
		name: "",
		description: "",
		sectionIds: [],
		administratorId: 0,
		schoolId: "",
		id: undefined,
	} as Grade;
};
interface Theme extends SchoolCityObjectModel {
	name: string;
	description?: string;
	schoolId: string;
}
const blankTheme = () => {
	return {
		name: "",
		description: "",
		schoolId: "",
	} as Theme;
};
interface Student extends SchoolCityObjectModel {
	firstName: string;
	lastName: string;
	fatherName: string;
	motherName: string;
	sectionId: number;
	schoolId: string;
	guardianPhoneNumber: string;
	studentPhoneNumber: string;
}
const blankStudent = () => {
	return {
		firstName: "",
		lastName: "",
		fatherName: "",
		motherName: "",
		sectionId: 0,
		schoolId: "",
		guardianPhoneNumber: "",
		studentPhoneNumber: "",
	} as Student;
};

type SectionScheduleCell = { teacherId: number; pinned: boolean }
interface SectionSubject extends SchoolCityObjectModel {
	teacherId: number,
	subjectId: number,
}
interface Section extends SchoolCityObjectModel {
	name: string;
	number: number;
	gradeId: number;
	schoolId: string;
	description?: string;
	studentIds?: number[];
	subjects: SectionSubject[]
	schedule: SectionScheduleCell[][];
}
const blankSection = () => {
	return {
		name: "",
		number: 0,
		gradeId: 0,
		schoolId: "",
		description: "",
		studentIds: [],
		subjects: [],
		schedule: [],
		periods: [],
	} as Section;
};
interface Administrator extends SchoolCityObjectModel {
	phoneNumber: string;
	name: string;
	supervisorId?: number | null;
	email?: string;
	schoolId: string;
	subordinates: Administrator[];
	divisionName?: string
}
const blankAdministrator = () => {
	return {
		phoneNumber: "",
		name: "",
		supervisorId: 0,
		email: "",
		schoolId: "",
	} as Administrator;
};
type SectionId = number;
type TeacherScheduleCell = SectionId | null;

interface Teacher extends SchoolCityObjectModel {
	phoneNumber: string;
	name: string;
	description?: string;
	email?: string;
	schedule: TeacherScheduleCell[][];
	availability: [number, number][];
	subjectIds?: number[];
	schoolIds: string[]
}
const blankTeacher = () => {
	return {
		phoneNumber: "",
		name: "",
		description: "",
		email: "",
		schedule: [],
		availability: [],
		subjectIds: [],
		schoolIds: [],
	} as Teacher;
};
type Average = { type: 'avg', cols: [IndexedMarkCol] }
type WeightedAverage = { type: 'weighted avg', cols: [{ col: IndexedMarkCol, weight: number }] }
type Equation = Average | WeightedAverage
type IndexedMarkCol = 'Mark1' | 'Mark2' | 'Mark3' | 'Mark4' | 'Mark5'
interface MarkHeader extends SchoolCityObjectModel {
	mapping: { [column: number]: IndexedMarkCol | Equation }
}
interface Subject extends SchoolCityObjectModel {
	name: string;
	description?: string;
	gradeId: number;
	schoolId: string;
	periods: number;
	fullMark?: number;
	marks?: MarkHeader;
}
const blankSubject = () => {
	return {
		name: "",
		description: "",
		gradeId: 0,
		schoolId: "",
		teacherId: 0,
		periods: 0,
		fullMark: 0,
	} as Subject;
};

interface Mark extends SchoolCityObjectModel {
	studentId: number;
	subjectId: number;
	schoolId: number
	mark1: number;
	mark2: number;
	mark3: number;
	mark4: number;
	mark5: number;
	description?: string;
}
const blankMark = () => {
	return {
		studentId: 0,
		subjectId: 0,
		schoolId: 0,
		mark1: 0,
		mark2: 0,
		mark3: 0,
		mark4: 0,
		mark5: 0,
		description: "",
	} as Mark;
};

// TODO: change to one call to get X Y to avoid inconsistancy
export function Grid(X: number, Y: number): null[][] {
	return new Array(X).fill(null).map(() => new Array(Y).fill(null));
}
export async function GridFactory(db: SchoolCityIDB) {
	const { days: X, periods: Y } = await GridCoordinates(db)
	return () => Grid(X, Y)
}
export async function GridCoordinates(db: SchoolCityIDB) {
	let X = (await db.settings.where({ name: "numberOfWorkdays" as SettingName }).first() as Setting).value;
	let Y = (await db.settings.where({ name: "periodsPerDay" as SettingName }).first() as Setting).value;
	return { days: X, periods: Y }
}
export async function flatCoordinatesMapperFactory(db: SchoolCityIDB): Promise<CoordinateMapper> {
	return DirectFlatCoordinatesMapper(await GridCoordinates(db))
}
type CoordinateMapper = {
	inGrid: {
		to1d: (day: number, period: number) => number;
		to2d: (c: number) => number[];
	};
	sectionMapper: (numberOfSections: number) => {
		to1d: (section: number, day: number, period: number) => number;
		to3d: (c: number) => number[];
	};
	_general: (x1: number, x2: number, cnt_x2: number) => number;
	_general3: (x1: number, x2: number, cnt_x2: number, x3: number, cnt_x3: number) => number;
}
export function DirectFlatCoordinatesMapper(XY: { days: number, periods: number }): CoordinateMapper {
	const { days: X, periods: Y } = XY
	const _general = (x1: number, x2: number, cnt_x2: number) => x1 * cnt_x2 + x2
	const _cnt = (cnt_x1: number, cnt_x2: number) => cnt_x1 * cnt_x2
	const _general3 = (x1: number, x2: number, cnt_x2: number, x3: number, cnt_x3: number) => _general(x1, _general(x2, x3, cnt_x3), _cnt(cnt_x2, cnt_x3))
	const break_dimension = (c: number, cnt_x2: number) => [Math.floor(c / cnt_x2), c % cnt_x2]
	const sectionMapper = (numberOfSections: number) => {
		return {
			to1d: (section: number, day: number, period: number) => _general3(section, day, X, period, Y)
			, to3d: (c: number) => {
				const [section, inGridIndex] = break_dimension(c, X)
				const [day, period] = break_dimension(inGridIndex, Y)
				return [section, day, period]
			}
		}
	}
	return {
		inGrid: {
			to1d: (day: number, period: number) => _general(day, period, Y)
			, to2d: (c: number) => break_dimension(c, Y)
		}
		, sectionMapper
		, _general
		, _general3
	}
}


export function LoopOverGrid<T, U>(g: T[][], f: (element: T, x1: number, x2: number) => U): U[][] {
	return g.map((row, x1) => row.map((elem, x2) => f(elem, x1, x2)))
}


const name = "";

export const mp: {
	[property in keyof typeof stores]: any;
} = {
	settings: blankSetting,
	template: blankTemplate,
	school: blankSchool,
	student: blankStudent,
	mark: blankMark,
	grade: blankGrade,
	section: blankSection,
	administrator: blankAdministrator,
	teacher: blankTeacher,
	subject: blankSubject,
	theme: blankTheme,
	user: {}
};
export type {
	SchoolCityObjectModel,
	Setting,
	Template,
	School,
	Grade,
	Theme,
	Student,
	SectionSubject,
	Section,
	Administrator,
	Teacher,
	MarkHeader,
	Subject,
	Mark,
	SchoolCityIDBTable,
	SchoolCityIDB,
	CoordinateMapper

};

