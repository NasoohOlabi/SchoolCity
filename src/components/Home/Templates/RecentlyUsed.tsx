import { faAngleDown, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import { mp, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "Language/t";
import { ITemplate } from "Model/Types";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expand } from "../../../Model/View/ExpandTemplates";
import Tile from "./Tile";

interface RecentlyUsedProps {
	table: SchoolCityIDBTable;
}

const RecentlyUsed = ({ table }: RecentlyUsedProps): JSX.Element => {
	const dispatch = useDispatch();
	const expanded = useSelector(
		(state: { templatesExpanded: { expanded: boolean } }) =>
			state.templatesExpanded.expanded
	);
	const db = useContext(SchoolCityDBContext);
	if (!db) return <p>Loading</p>;

	const templates = useLiveQuery(() => {
		// console.log(
		// 	"db && myCrud.getAll(table, db) = ",
		// 	db && db.template.where({ type: table })
		// );
		// return db && myCrud.getAll('template', db);
		return db.template.where({ type: table }).toArray() || [];
	}, []) as ITemplate[];

	const blankInstance = mp[table]();

	blankInstance.id = null;
	blankInstance.name = "Blank";
	blankInstance.description = t("This is a blank empty ") + t(table);

	return (
		<>
			<div className="flex justify-between w-full items-center align-middle">
				<div>{t("Recently Used")}</div>
				{!expanded && (
					<div className="flex align-middle items-center">
						<Button
							className=""
							color="gray"
							onClick={() => dispatch(expand())}
						>
							{t("Template Gallery")}
							<FontAwesomeIcon icon={faAngleDown} />
						</Button>
						<FontAwesomeIcon icon={faEllipsisV} />
					</div>
				)}
			</div>
			<section className="recently-item-section flex justify-items-start w-full items-center align-middle">
				<Tile instance={blankInstance} />
				{templates &&
					templates.map((template) => (
						<Tile key={template.id} instance={template} />
					))}
			</section>
		</>
	);
};

export default RecentlyUsed;
