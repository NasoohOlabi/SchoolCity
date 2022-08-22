import { myCrud, SchoolCityIDB, SchoolCityIDBTable } from "./schema";

// const demoSchool = {
// 	id: 1,
// 	title: "Demo",
// 	description: "This is a demo school for tutorials",
// 	school: new School("Demo", "This is a demo school for tutorials", []),
// };

const blank = {
	name: "Blank",
	description: "This is a blank template",
};

const h = async (
	db: SchoolCityIDB,
	table: SchoolCityIDBTable,
	name: string,
	defaultValue: any
) => {
	db.transaction("rw", table, async () => {
		let v = await db[table].where({ name }).first();
		if (v === undefined) myCrud.add(table, db, defaultValue);
	});
};

const initializeTemplates = async (db: SchoolCityIDB) => {
	h(db, "template", blank.name, blank);
	// if ((await db.settings.get("withTemplates")) === false) return;
	// if (db.schoolTemplates.where({ title: demoSchool.title }) === undefined)
	// 	myCrud.add("schoolTemplates", db, demoSchool);
};

export default initializeTemplates;
