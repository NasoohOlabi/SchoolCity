import { SchoolCityIDBTable } from "DB/schema";
import { IndexableType } from "dexie";
import { useLocation } from "react-router-dom";

const useTableUrl = (n: number = 1): { type: 'redirect' } | { type: 'table', table: SchoolCityIDBTable, id: IndexableType | null } => {
	const path = useLocation().pathname.split("/");
	let rawTable = path[path.length - n];
	if (
		![
			"student",
			"grade",
			"section",
			"administrator",
			"teacher",
			"settings",
			"subject",
			"sectionSubject",
			"mark",
			"template",
			"school",
			"theme",
		].includes(rawTable)
	)
		return {
			type: 'redirect',
		};

	const table = rawTable as SchoolCityIDBTable;

	return { type: 'table', table, id: (n === 2) ? path[path.length - 1] : null }


}

export default useTableUrl