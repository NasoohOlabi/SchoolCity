import type { IndexableType, Table } from "dexie";
import Dexie from "dexie";
import initializeSettings from "./initializeSettings";
import initializeTemplates from "./initializeTemplates";
import { SettingName } from "./Settings";

const stores = {
	student: "++id,firstName,lastName,fatherName,motherName,schoolId", // section, guardianPhoneNumber, studentPhoneNumber
	grade: "++id,number,&[name+schoolId]", // description, sectionIds, administrator
	// &name is sth like first grade or 'صف أول'
	section: "++id,&[name+schoolId],&[number+gradeId]", // {subjectId,teacherId}[] , description, studentIds, schedule
	// grade is foreign key to grade
	// schedule sectionSubjectId[][]
	administrator: "++id,phoneNumber,&name,supervisorId,email,schoolId",
	teacher: "++id,phoneNumber,&name", // description, email, schedule, availability, sectionSubjectIds
	// id autoIncremented for performance since it'll be used in Z3 is section
	// schedule is section[][]
	// availability is list of day period pairs... [0,2]===[startWeek,second]
	settings: "++id,&[name+schoolId]", // description, value
	// &name ex: workdays:6 | periodsPerDay:5
	// startWeek:Sunday
	subject: "++id,name,gradeId", // periods, full Mark,  description, teacherIds, MarkHeader
	// you can either just use teachers and say this teacher is in this section
	// or you can say that this section is having math and it's this teacher teaching it
	mark: "++id,&name,[subjectId+studentId],Mark1,Mark2,Mark3,Mark4,Mark5", // description
	template: "++id,&name,type", // value, description
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

export type SchoolCityIDBTable = keyof SchoolCityIDBSchema;

export type SchoolCityIDB = SchoolCityIDBSchema & Dexie;

export const initializeDB = (): SchoolCityIDB & Dexie => {
	const db = new Dexie("school");
	// data base should contain a year worth of information
	db.version(4).stores(stores);

	const mydb = db as SchoolCityIDB;

	initializeSettings(mydb);
	initializeTemplates(mydb);

	return mydb;
};

export interface SchoolCityObjectModel {
	id?: number;
}

export const myCrud = {
	getAll: async <T extends SchoolCityObjectModel>(
		table: SchoolCityIDBTable,
		db: SchoolCityIDB
	): Promise<T[]> => {
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

export interface Setting extends SchoolCityObjectModel {
	name: string;
	description?: string;
	schoolId: number | 'global';
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
export interface Template extends SchoolCityObjectModel {
	name: string;
	description?: string;
	type: SchoolCityIDBTable;
	value?: any;
}
const blankTemplate = () => {
	return {
		name: "",
		description: "",
		type: "school",
		value: undefined,
	} as Template;
};

export interface School extends SchoolCityObjectModel {
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

export interface Grade extends SchoolCityObjectModel {
	number: number;
	name: string;
	description?: string;
	administratorId: number;
	schoolId: number
}
const blankGrade = () => {
	return {
		number: 0,
		name: "",
		description: "",
		sectionIds: [],
		administratorId: 0,
		schoolId: 0,
		id: undefined,
	} as Grade;
};
export interface Theme {
	name: string;
	description?: string;
	schoolId: number;
}
const blankTheme = () => {
	return {
		name: "",
		description: "",
		schoolId: 0,
	} as Theme;
};
export interface Student {
	firstName: string;
	lastName: string;
	fatherName: string;
	motherName: string;
	sectionId: number;
	schoolId: number;
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
		schoolId: 0,
		guardianPhoneNumber: "",
		studentPhoneNumber: "",
	} as Student;
};

type SectionScheduleCell =
	| { teacherId?: number; pinned: false }
	| { teacherId: undefined; pinned: true };
export interface SectionSubject {
	teacherId: number,
	subjectId: number,
}
export interface Section {
	name: string;
	number: number;
	gradeId: number;
	schoolId: number;
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
		schoolId: 0,
		description: "",
		studentIds: [],
		subjects: [],
		schedule: [],
		periods: [],
	} as Section;
};
export interface Administrator {
	phoneNumber: string;
	name: string;
	supervisorId?: number | null;
	email?: string;
	schoolId: number;
	subordinates: Administrator[];
	divisionName?: string
}
const blankAdministrator = () => {
	return {
		phoneNumber: "",
		name: "",
		supervisorId: 0,
		email: "",
		schoolId: 0,
	} as Administrator;
};
type SectionId = number;
type TeacherScheduleCell = SectionId | undefined | null;

export interface Teacher {
	phoneNumber: string;
	name: string;
	description?: string;
	email?: string;
	schedule: TeacherScheduleCell[][];
	availability: number[][];
	subjectIds?: number[];
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
	} as Teacher;
};
type Average = { type: 'avg', cols: [IndexedMarkCol] }
type WeightedAverage = { type: 'weighted avg', cols: [{ col: IndexedMarkCol, weight: number }] }
type Equation = Average | WeightedAverage
type IndexedMarkCol = 'Mark1' | 'Mark2' | 'Mark3' | 'Mark4' | 'Mark5'
export interface MarkHeader {
	mapping: { [column: number]: IndexedMarkCol | Equation }
}
export interface Subject {
	name: string;
	description?: string;
	gradeId: number;
	periods: number;
	fullMark?: number;
	marks?: MarkHeader;
}
const blankSubject = () => {
	return {
		name: "",
		description: "",
		gradeId: 0,
		teacherId: 0,
		periods: 0,
		fullMark: 0,
	} as Subject;
};

export interface Mark {
	studentId: number;
	subjectId: number;
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
		mark1: 0,
		mark2: 0,
		mark3: 0,
		mark4: 0,
		mark5: 0,
		description: "",
	} as Mark;
};

export function utilGrid(X: number, Y: number) {
	return new Array(X).fill(null).map(() => new Array(Y).fill(null));
}

export async function Grid(
	db: SchoolCityIDB | null,
	options: { X: number; Y: number }
) {
	let X =
		(db && (await db.settings.where({ name: "numberOfWorkdays" as SettingName }).first())) ||
		options.X;
	let Y =
		(db && (await db.settings.where({ name: "periodsPerDay" as SettingName }).first())) ||
		options.Y;
	return utilGrid(X, Y);
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
