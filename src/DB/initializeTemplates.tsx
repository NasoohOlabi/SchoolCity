import demo from "./Demo";
import importDemo from "./importDemo";
import { SchoolCityIDB, Setting } from "./schema";

const initializeTemplates = async (db: SchoolCityIDB) => {
	try {
		const withTemplatesSettings: Setting[] = await db.settings
			.where({
				name: "withTemplates",
				schoolId: "global",
			})
			.toArray();
		const withTemplatesSetting = withTemplatesSettings[0] || { value: true };
		try {
			if (withTemplatesSetting.value === true) {
				importDemo(demo)(db);
			}
		} catch (error) {
			console.log("caught this in initializeTemplates import branch", error);
		}
	} catch (error) {
		console.log("caught this in initializeTemplates", error);
	}
};

export default initializeTemplates;
