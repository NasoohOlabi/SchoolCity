import type { Table } from "dexie";
import Dexie from "dexie";


const stores = {
	student: "++id,firstName,lastName,fatherName,motherName", // section, guardianPhoneNumber, studentPhoneNumber
	//

	grade: "++id,&number", // name, sectionIds, administrator
	// name is sth like first grade or 'صف أول'

	section: "++id,&[number+grade]", // name, studentIds, schedule, teacherIds, sectionSubjectIds
	// grade is foreign key to grade
	// schedule sectionSubjectId[][]

	administrator: "++id,phoneNumber,name,supervisor,email",

	teacher: "++id,phoneNumber,firstName,LastName", // email, schedule, availability, sectionSubjectIds
	// ++id autoIncremented for performance since it'll be used in Z3 is section
	// schedule is section[][]
	// availability is list of day period pairs... [0,2]===[startWeek,second]

	settings: "name,value",
	// name ex: workdays:6 | periodsPerDay:5
	// startWeek:Sunday

	subject: "++id,name",

	sectionSubject: "[sectionId+subjectId]", // periods, full marks, studentIds, teacherIds,

	mark: "[sectionSubjectId+studentId],primaryMark,secondaryMark",
}

type ObjectStores = typeof stores;

type SchoolCityIDBSchema = {
	[Property in keyof ObjectStores]: Table;
};

export type SchoolCityIDB = SchoolCityIDBSchema & Dexie

export const initalizeDB = (): SchoolCityIDB & Dexie => {
	const db = new Dexie("school");
	// data base should contain a year worth of information
	db.version(1).stores(stores);

	const mydb = db as SchoolCityIDB;


	return mydb;
}

