import type { IndexableType, Table } from "dexie";
import Dexie from "dexie";
import initializeSettings from "./initializeSettings";
import initializeTemplates from "./initializeTemplates";
import { SettingName } from "./Settings";

const stores = {
	student: "++id,firstName,lastName,fatherName,motherName,schoolId", // section, guardianPhoneNumber, studentPhoneNumber
	grade: "++id,number,name", // description, sectionIds, administrator
	// name is sth like first grade or 'صف أول'
	section: "++id,name,&[number+gradeId],schoolId", // description, studentIds, schedule, teacherIds, sectionSubjectIds
	// grade is foreign key to grade
	// schedule sectionSubjectId[][]
	administrator: "++id,phoneNumber,name,supervisorId,email,schoolId",
	teacher: "++id,phoneNumber,name", // description, email, schedule, availability, sectionSubjectIds
	// id autoIncremented for performance since it'll be used in Z3 is section
	// schedule is section[][]
	// availability is list of day period pairs... [0,2]===[startWeek,second]
	settings: "++id,name,value,schoolId", // description
	// name ex: workdays:6 | periodsPerDay:5
	// startWeek:Sunday
	subject: "++id,name", // description, teacherIds
	sectionSubject: "++id,sectionId,subjectId,teacherId", // periods, full marks, studentIds, teacherIds,
	// you can either just use teachers and say this teacher is in this section 
	// or you can say that this section is having math and it's this teacher teaching it
	mark: "++id,name,[sectionSubjectId+studentId],Mark1,Mark2,Mark3,Mark4,Mark5", // description
	template: "++id,name,type", // value
	school: "++id,&name", // sectionIds,vicePrincipalId , description
	theme: "++id,name,schoolId", // description
};


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
	db.open().catch(function (err) {
		console.error(err.stack || err);
	});

	const mydb = db as SchoolCityIDB;

	initializeTemplates(mydb);
	initializeSettings(mydb);

	return mydb;
};

export abstract class SchoolCityObjectModel {
	id: number | undefined;
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
		data: any
	): Promise<any> => {
		if (data.id === undefined)
			return myCrud.add(table, db, data)
		else
			return db[table].update(data.id, data).catch((e) => {
				console.log(`update ${table} error = `, e);
				throw e;
			});
	},
	delete: async (
		table: SchoolCityIDBTable,
		db: SchoolCityIDB,
		id: number | string
	): Promise<any> => {
		return db[table].delete(id).catch((e) => {
			console.log(`delete ${table} error = `, e);
			throw e;
		});
	},
};


export class Setting extends SchoolCityObjectModel {
	name: string;
	description: string;
	schoolId: number
	value?: any;
	constructor(
		name: string,
		description: string,
		schoolId: number,
		value: any = undefined,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.schoolId = schoolId;
		this.value = value;
	}
}
export class Template extends SchoolCityObjectModel {
	name: string;
	description: string;
	type: SchoolCityIDBTable
	value?: any
	constructor(
		name: string,
		description: string,
		type: SchoolCityIDBTable,
		value: any = undefined,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.type = type;
		this.value = value;
	}
}


export class School extends SchoolCityObjectModel {
	name: string;
	description: string;
	sectionIds: number[];
	vicePrincipalId: number;
	constructor(
		name: string,
		description: string,
		sectionIds: number[],
		vicePrincipalId: number,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.sectionIds = sectionIds;
		this.vicePrincipalId = vicePrincipalId;
	}
}

export class Grade extends SchoolCityObjectModel {
	number: number;
	name: string;
	description: string;
	sectionIds: number[];
	administrator: number;
	constructor(
		number: number,
		name: string,
		sectionIds: number[],
		administrator: number,
		description: string,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.number = number;
		this.name = name;
		this.sectionIds = sectionIds;
		this.administrator = administrator;
		this.description = description;
	}
}
export class Theme extends SchoolCityObjectModel {
	name: string;
	description: string;
	schoolId: number;
	constructor(
		name: string,
		description: string,
		schoolId: number,
		id: undefined | number = undefined
	) {
		super();
		this.name = name;
		this.description = description;
		this.schoolId = schoolId;
	}
}

export class Student extends SchoolCityObjectModel {
	firstName: string;
	lastName: string;
	fatherName: string;
	motherName: string;
	sectionId: number;
	schoolId: number;
	guardianPhoneNumber: string;
	studentPhoneNumber: string;
	constructor(
		firstName: string,
		lastName: string,
		fatherName: string,
		motherName: string,
		sectionId: number,
		guardianPhoneNumber: string,
		studentPhoneNumber: string,
		schoolId: number,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.fatherName = fatherName;
		this.motherName = motherName;
		this.sectionId = sectionId;
		this.guardianPhoneNumber = guardianPhoneNumber;
		this.studentPhoneNumber = studentPhoneNumber;
		this.schoolId = schoolId
	}
}

type SectionScheduleCell = { teacherId: number, isCemented: boolean };
export class Section extends SchoolCityObjectModel {
	name: string;
	number: number;
	gradeId: number;
	schoolId: number;
	description: string;
	studentIds: number[];
	schedule: SectionScheduleCell[][];
	teacherIds: number[];
	sectionSubjectIds: number[];
	constructor(
		name: string,
		studentIds: number[],
		schedule: SectionScheduleCell[][],
		teacherIds: number[],
		sectionSubjectIds: number[],
		number: number,
		gradeId: number,
		schoolId: number,
		description: string,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.name = name;
		this.studentIds = studentIds;
		this.schedule = schedule;
		this.teacherIds = teacherIds;
		this.sectionSubjectIds = sectionSubjectIds;
		this.number = number;
		this.gradeId = gradeId;
		this.schoolId = schoolId;
		this.description = description;
	}
}

export class Administrator extends SchoolCityObjectModel {
	phoneNumber: string;
	name: string;
	supervisorId: number;
	email: string;
	schoolId: number;
	constructor(
		phoneNumber: string,
		name: string,
		supervisorId: number,
		email: string,
		schoolId: number,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.phoneNumber = phoneNumber;
		this.name = name;
		this.supervisorId = supervisorId;
		this.email = email;
		this.schoolId = schoolId;
	}
}
type SectionId = number
type TeacherScheduleCell = SectionId | undefined | null
export class Teacher extends SchoolCityObjectModel {
	phoneNumber: string;
	name: string;
	description: string;
	email: string;
	schedule: TeacherScheduleCell[][];
	availability: number[][];
	sectionSubjectIds: number[];
	constructor(
		phoneNumber: string,
		name: string,
		email: string,
		schedule: TeacherScheduleCell[][],
		availability: number[][],
		sectionSubjectIds: number[],
		description: string,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.description = description;
		this.phoneNumber = phoneNumber;
		this.name = name;
		this.email = email;
		this.schedule = schedule;
		this.availability = availability;
		this.sectionSubjectIds = sectionSubjectIds;
	}
}

export class SectionSubject extends SchoolCityObjectModel {
	sectionId: number;
	subjectId: number;
	teacherId: number;
	periods: number;
	fullMark: number;
	studentIds: number[];
	teacherIds: number[];
	constructor(
		teacherIds: number[],
		studentIds: number[],
		sectionId: number,
		subjectId: number,
		teacherId: number,
		periods: number,
		fullMark: number,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.teacherIds = teacherIds;
		this.studentIds = studentIds;
		this.sectionId = sectionId;
		this.subjectId = subjectId;
		this.teacherId = teacherId;
		this.periods = periods;
		this.fullMark = fullMark;
	}
}

export class Subject extends SchoolCityObjectModel {
	name: string;
	description: string;
	teacherIds: number[];
	constructor(
		name: string,
		description: string,
		teacherIds: number[],
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.name = name;
		this.teacherIds = teacherIds;
		this.description = description;
	}
}

export class Mark extends SchoolCityObjectModel {
	studentId: number;
	sectionSubjectId: number;
	mark1: number;
	mark2: number;
	mark3: number;
	mark4: number;
	mark5: number;
	description: string;
	constructor(
		studentId: number,
		description: string,
		sectionSubjectId: number,
		mark1: number,
		mark2: number,
		mark3: number,
		mark4: number,
		mark5: number,
		id: undefined | number = undefined
	) {
		super();
		this.id = id;
		this.studentId = studentId;
		this.sectionSubjectId = sectionSubjectId;
		this.mark1 = mark1;
		this.mark2 = mark2;
		this.mark3 = mark3;
		this.mark4 = mark4;
		this.mark5 = mark5;
		this.description = description;
	}
}

export function utilGrid(X: number, Y: number) {
	return new Array(X).fill(null).map(() => new Array(Y).fill(null));
}

export async function Grid(db: SchoolCityIDB | null, options: { X: number, Y: number }) {
	let X = (db && await db.settings.get('numberOfWorkdays' as SettingName)) || options.X
	let Y = (db && await db.settings.get('periodsPerDay' as SettingName)) || options.Y
	return utilGrid(X, Y);
}



export const mp: {
	[property in keyof typeof stores]: any
} = {
	mark: () => new Mark(0, '', 0, 0, 0, 0, 0, 0),
	student: () => new Student('', '', '', '', 0, '', '', 0),
	settings: () => new Setting('', '', 0, {}),
	grade: () => new Grade(1, '', [], 0, ''),
	section: () => new Section('', [], [], [], [], 0, 0, 0, ''),
	administrator: () => new Administrator('', '', 0, '', 0),
	teacher: () => new Teacher('', '', '', [], [], [], ''),
	subject: () => new Subject('', '', []),
	sectionSubject: () => new SectionSubject([], [], 0, 0, 0, 0, 0),
	template: () => new Template('', '', 'school', {}),
	school: () => new School('', '', [], 0),
	theme: () => new Theme('', '', 0)
}