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
import { mp, myCrud, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { t } from "Language/t";
import useRerender from "Model/hooks/useRerender";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OneToMany from "./OneToMany";

export interface DraftProps {
	table: SchoolCityIDBTable;
	title?: string;
}

const Draft: ({ table, title }: DraftProps) => JSX.Element = ({
	table,
	title,
}) => {
	const db = useContext(SchoolCityDBContext);
	let state = useRef(mp[table]()).current;
	if (!title) {
		title = t("New ") + t(table);
	}

	const reRender = useRerender();

	const [editing, setEditing] = useState(true);

	const myInput = (key: string) => {
		const handler: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
			const newVal = evt.target.value;
			state[key] = newVal;
			db && myCrud.update(table, db, state);
		};
		const type = typeof state[key];
		switch (type) {
			case "string":
				return (
					<Input
						label={key}
						disabled={!editing}
						onChange={(evt) => {
							state[key] = evt.target.value;
							console.log("state = ", state);
						}}
					/>
				);
			case "number":
				return (
					<Input
						label={key}
						disabled={!editing}
						onChange={(evt) => {
							if (!isNaN(+evt.target.value)) {
								state[key] = evt.target.value;
							} else {
								evt.target.value = state[key];
							}
						}}
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
					const setLst = (lst: any[]) => {
						state[key] = lst;
						reRender();
						db && myCrud.update(table, db, state);
					};
					console.log("lst = ", state[key]);
					console.log("state = ", state);
					console.log("key = ", key);
					return (
						<OneToMany
							disabled={!editing}
							lst={state[key]}
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

	if (state === null || state === undefined) {
		return <p>there is an issue</p>;
	}
	console.log("state = ", state);

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
				{(() => {
					console.log("state = ", state);
					return true;
				})() &&
					Object.keys(state)
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

export default Draft;
