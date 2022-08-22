import { SchoolCityIDBTable } from "DB/schema";
import { useLocation } from "react-router-dom";

const useTableUrl = (n: number = 1): { type: 'redirect' } | { type: 'table', table: SchoolCityIDBTable, name?: string } => {
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

	return { type: 'table', table, name: (n === 2) ? path[path.length - 1] : undefined }


}

export default useTableUrl