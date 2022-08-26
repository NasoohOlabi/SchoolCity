import { myCrud, SchoolCityIDB } from "./schema";
import { SettingName as Setting } from "./Settings";

const h = async (db: SchoolCityIDB, name: Setting, defaultValue: any) => {
	db.transaction("rw", "settings", async () => {
		let v = await db.settings.where({ name, schoolId: "global" }).first();
		if (v === undefined) myCrud.add("settings", db, defaultValue);
	});
};

const initializeSettings = async (db: SchoolCityIDB) => {
	h(db, "numberOfWorkdays", {
		name: "numberOfWorkdays" as Setting,
		value: 5,
		schoolId: "global",
	});
	h(db, "periodsPerDay", {
		name: "periodsPerDay" as Setting,
		value: 7,
		schoolId: "global",
	});
	h(db, "startWeekDay", {
		name: "startWeekDay" as Setting,
		value: "Sunday",
		schoolId: "global",
	});
	h(db, "withTemplates", {
		name: "withTemplates" as Setting,
		value: true,
		schoolId: "global",
	});
};

export default initializeSettings;
