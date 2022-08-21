import { faAngleDown, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import { myCrud, SchoolCityIDBTemplate } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "Language/t";
import { ITemplate } from "Model/Types";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expand } from "../../../Model/View/ExpandTemplates";
import Tile, { ITitleInstance } from "./Tile";

interface RecentlyUsedProps {
	table: SchoolCityIDBTemplate;
}

const RecentlyUsed = ({ table }: RecentlyUsedProps): JSX.Element => {
	const dispatch = useDispatch();
	const expanded = useSelector(
		(state: { templatesExpanded: { expanded: boolean } }) =>
			state.templatesExpanded.expanded
	);
	const db = useContext(SchoolCityDBContext);
	const templates = useLiveQuery(() => {
		console.log(
			"db && myCrud.getAll(table, db) = ",
			db && myCrud.getAll(table, db)
		);
		return db && myCrud.getAll(table, db);
	}, []) as ITemplate[];

	const linkFn = (t: ITitleInstance) => {
		return table === "schoolTemplates"
			? t.name === "Blank"
				? "new"
				: t.name
			: t.id?.toString() || "";
	};

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
				{(() => {
					console.log("templates = ", templates);
					return true;
				})() &&
					templates &&
					templates.map((template) => (
						<Tile key={template.id} instance={template} link={linkFn} />
					))}
			</section>
		</>
	);
};

export default RecentlyUsed;
