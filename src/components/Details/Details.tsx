import { myCrud, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import useRerender from "Model/hooks/useRerender";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useWindowDimensions from "../hooks/useWindowDimensions";
import DetailsNDraftBase, { myInputFactory } from "./DetailsNDraftBase";

interface DetailsProps {
	title: string;
	table: SchoolCityIDBTable;
	selector: IndexableType;
	query?: any;
}

const Details: (obj: DetailsProps) => JSX.Element = ({
	title,
	table,
	selector,
}) => {
	console.log(`Details rerender`);
	useEffect(() => {}, [title, table, selector]);
	const { width } = useWindowDimensions();
	const params = useParams();
	const db = useContext(SchoolCityDBContext);
	const navigate = useNavigate();
	const reRender = useRerender();
	const [editing, setEditing] = useState(false);
	const state = useLiveQuery(() => myCrud.get(table, db, selector), []);

	// if (!state) {
	// 	console.log(`state = `, state);
	// 	console.log("Details selector = ", selector);
	// 	console.log(`table = `, table);
	// 	console.log(`db = `, db);
	// 	console.log(`myCrud = `, myCrud);
	// 	console.log(`params.schoolName = `, params.schoolName);
	// 	return <p>there is an issue</p>;
	// }

	const myInput = myInputFactory({
		table,
		state,
		db,
		editing,
		reRender,
	});
	const saveHandler: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
		db && myCrud.update(table, db, state);
		navigate("../");
	};
	return (
		state && (
			<DetailsNDraftBase
				title={title}
				editing={editing}
				setEditing={setEditing}
				width={width}
				state={state}
				myInput={myInput}
				saveHandler={saveHandler}
			/>
		)
	);
};

export default Details;
