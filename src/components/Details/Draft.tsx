import { mp, myCrud, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { t } from "Language/t";
import useRerender from "Model/hooks/useRerender";
import { useContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../hooks/useWindowDimensions";
import DetailsNDraftBase, { myInputFactory } from "./DetailsNDraftBase";

export interface DraftProps {
	table: SchoolCityIDBTable;
	title?: string;
}

const Draft: ({ table, title }: DraftProps) => JSX.Element = ({
	table,
	title,
}) => {
	const db = useContext(SchoolCityDBContext);
	if (!db) return <p>loading</p>;
	let state = useRef(mp[table]()).current;
	if (!title) {
		title = t("New ") + t(table);
	}
	const { width } = useWindowDimensions();

	const reRender = useRerender();

	const [editing, setEditing] = useState(true);

	const myInput = myInputFactory({
		table,
		state,
		db,
		editing,
		reRender,
	});
	const navigate = useNavigate();
	const location = useLocation();
	const saveHandler: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
		console.log("evt = ", evt);
		console.log("state = ", state);
		db && myCrud.update(table, db, state);
		console.log(
			"location.pathname.split('/').slice(0,-1).join('/') = ",
			location.pathname.split("/").slice(0, -1).join("/")
		);
		navigate(location.pathname.split("/").slice(0, -1).join("/") + "/");
	};

	return (
		<DetailsNDraftBase
			title={title}
			editing={editing}
			setEditing={setEditing}
			width={width}
			state={state}
			myInput={myInput}
			saveHandler={saveHandler}
		/>
	);
};

export default Draft;
