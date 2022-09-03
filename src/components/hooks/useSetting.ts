import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { SettingName } from "DB/Settings";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export default function useSetting(settingName: SettingName): any | undefined {
	const db = useContext(SchoolCityDBContext)
	if (!db) return undefined;
	const schoolName = useParams().schoolName;
	if (!schoolName) return undefined;
	const globalSetting = useLiveQuery(
		() =>
			db.settings.where("[name+schoolId]").equals([settingName, 'global']).or("[name+schoolId]").equals([settingName, schoolName]).toArray(),
		[]
	);
	;
	return globalSetting && globalSetting[0] && globalSetting[0].value
}