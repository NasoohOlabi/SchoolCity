import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Card,
	CardFooter,
	IconButton,
	Input,
	Switch,
	Typography,
} from "@material-tailwind/react";
import { myCrud, SchoolCityIDBTable, SchoolCityObjectModel } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "Language/t";
import React, { useCallback, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OneToMany from "./OneToMany";

interface DetailsProps {
	title: string;
	table: SchoolCityIDBTable;
	selector: IndexableType | { type: "new"; instance: SchoolCityObjectModel };
	query?: any;
	initalEditingState?: boolean;
}

const Details: React.FC<DetailsProps> = ({
	title,
	table,
	selector,
	initalEditingState = false,
}) => {
	const db = useContext(SchoolCityDBContext);
	let state = useRef({} as any).current;
	if (
		typeof selector === "object" &&
		Object.keys(selector).length === 2 &&
		Object.keys(selector).includes("instance") &&
		Object.keys(selector).includes("type")
	) {
		state = (selector as { type: "new"; instance: SchoolCityObjectModel })
			.instance;
		initalEditingState = true;
	} else {
		const id = selector as IndexableType;
		state = useLiveQuery(() => db && myCrud.get(table, db, id), [id]);
	}

	const [editing, setEditing] = useState(initalEditingState);

	const myInput = (key: string) => {
		const handler: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
			const newVal = evt.target.value;
			state[key] = newVal;
			db && myCrud.update(table, db, state);
		};
		const type = typeof state[key];
		switch (type) {
			case "string":
				const valWrapper = useRef(state);
				return (
					<Input
						label={key}
						disabled={!editing}
						onChange={(evt) => {
							valWrapper.current[key] = evt.target.value;
							console.log("state = ", state);
						}}
						defaultValue={valWrapper.current.key}
					/>
				);
			case "number":
				return (
					<Input
						label={key}
						disabled={!editing}
						value={state[key]}
						onChange={(evt) => !isNaN(+evt.target.value)}
					/>
				);
			case "boolean":
				return (
					<Switch
						disabled={!editing}
						checked={state[key]}
						onChange={handler}
						className="-ml-4"
					/>
				);
			case "object":
				if (state[key].length !== undefined) {
					let [lst, setLst] = useState(state[key]);
					setLst = useCallback((lst: any[]) => {
						setLst(lst);
						state[key] = lst;
						db && myCrud.update(table, db, state);
					}, []);
					console.log("lst = ", lst);
					console.log("state = ", state);
					console.log("key = ", key);
					return (
						<OneToMany
							disabled={!editing}
							lst={lst}
							setLst={setLst}
							oneTable={table}
							manyTable={
								key.substring(0, key.length - 3) as SchoolCityIDBTable
							}
						/>
					);
				} else return <p>Unsupported Type</p>;
			default:
				return <p>Unsupported Type</p>;
		}
	};
	const navigate = useNavigate();
	const saveHandler: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
		console.log("evt = ", evt);
		console.log("state = ", state);
		db && myCrud.update(table, db, state);
		navigate("../");
	};

	return (
		<div className="header-page-center-container">
			<Card className="header-page-center-container-card">
				<div className="flex pl-6 justify-between items-center ">
					<Typography variant="h1">{title}</Typography>
					<IconButton
						className="md:inline-flex h-20 w-20 rounded "
						onClick={() => setEditing(!editing)}
					>
						{/* <Icon name="menu" size="3xl" /> */}
						<FontAwesomeIcon icon={faPencil} />
					</IconButton>
				</div>
				{Object.keys(state)
					.filter((key) => key !== "title" && key !== "id")
					.map((key) => (
						<div key={key} className="flex m-4  content-center">
							<Typography
								className="flex justify-center items-center mr-4"
								variant="h6"
							>
								{key}
							</Typography>
							{myInput(key)}
						</div>
					))}
				<CardFooter>
					<div className="flex justify-between items-center flex-row-reverse h-12">
						{editing && (
							<Button onClick={saveHandler}>{t("save")}</Button>
						)}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Details;
