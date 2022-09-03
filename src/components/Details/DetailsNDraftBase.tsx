import {
	faArrowUpRightFromSquare,
	faPencil,
} from "@fortawesome/free-solid-svg-icons";
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
import { OM, SchoolCityIDB, SchoolCityIDBTable } from "DB/schema";
import { IndexableType } from "dexie";
import Sheets from "Gapi/Sheets/Sheets";
import { t } from "Language/t";
import React, { useEffect } from "react";
import DBGridMaintainer from "./DBGridMaintainer";
import DetailsSectionSubjects from "./DetailsSectionSubjects";
import GridMaintainer from "./GridMaintainer";
import ManyToOne from "./ManyToOne";
import OneToMany from "./OneToMany";
import SectionSubjects from "./SectionSubjects";

export const myInputFactory: (args: {
	table: SchoolCityIDBTable;
	state: any;
	db: SchoolCityIDB;
	editing: boolean;
	reRender: any;
}) => (key: string) => JSX.Element =
	({ table, state, db, editing, reRender }) =>
	(key: string) => {
		const handler: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
			state[key] = evt.target.value.trim();
			// db && myCrud.update(table, db, state);
		};
		console.log(`myInput rerender`);

		const type = typeof state[key];
		const setLst = (lst: any[]) => {
			console.log(`lst = `, lst);
			state[key] = lst;
			reRender();
			// db && myCrud.update(table, db, state);
		};
		if (table === "mark" && key === "subjectId") {
			return (
				<SectionSubjects
					mark={state}
					disabled={!editing}
					reRender={reRender}
				/>
			);
		}
		switch (key) {
			case "subjects":
				return (
					<DetailsSectionSubjects
						lst={state[key]}
						disabled={!editing}
						sectionId={OM.identifier(state, table)}
					/>
				);
			case "subordinates":
				return (
					<OneToMany
						disabled={!editing}
						lst={state[key]}
						setLst={setLst}
						oneTable={table}
						manyTable="administrator"
					/>
				);
			case "supervisorId":
				if (state[key] === state.id && !editing) {
					return <p>This is a top ranking administrator</p>;
				} else
					return (
						<ManyToOne
							one={table}
							selected={state[key]}
							disabled={!editing}
							setFk={(id: IndexableType) => {
								state[key] = id;
								reRender();
								// db && myCrud.update(table, db, state);
							}}
						/>
					);
			case "schedule":
				if (table === "section") {
					console.log(`state[${key}] = `, state[key]);
					return (
						<DBGridMaintainer
							grid={state[key].map((r: any) =>
								r.map((v: any) => v.teacherId)
							)}
							colorClass={{
								[-1]: "bg-gray-400",
							}}
							idsTable="teacher"
							nullColor="bg-gray-700"
						/>
					);
				} else if (table === "teacher")
					return (
						<DBGridMaintainer
							grid={state[key]}
							idsTable="section"
							nullColor="bg-gray-300"
						/>
					);
			case "availability":
				return (
					<GridMaintainer
						disabled={!editing}
						lst={state[key]}
						setLst={setLst}
					/>
				);
		}
		switch (type) {
			case "string":
				return (
					<div className="w-96">
						<Input
							label={key}
							disabled={!editing}
							onChange={(evt) => {
								state[key] = evt.target.value.trim();
								console.log("state = ", state);
							}}
							defaultValue={state[key]}
						/>
					</div>
				);
			case "object":
				if (key.endsWith("Ids") && Array.isArray(state[key])) {
					const setLst = (lst: any[]) => {
						console.log(`lst = `, lst);
						state[key] = lst;
						reRender();
						// db && myCrud.update(table, db, state);
					};
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
			case "number":
				const IdLess = key.substring(0, key.length - 2);
				const isId = key.substring(key.length - 2) === "Id";
				return isId ? (
					<ManyToOne
						one={
							// @ts-ignore
							IdLess === "vicePrincipal"
								? "administrator"
								: (IdLess as SchoolCityIDBTable)
						}
						selected={state[key]}
						disabled={!editing}
						setFk={(id: IndexableType) => {
							state[key] = id;
							reRender();
							// db && myCrud.update(table, db, state);
						}}
					/>
				) : (
					<Input
						label={key}
						disabled={!editing}
						defaultValue={state[key]}
						onChange={(evt) => {
							if (!isNaN(+evt.target.value.trim())) {
								state[key] = evt.target.value.trim();
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
			default:
				return <p>Unsupported Type</p>;
		}
	};
export interface DetailsNDraftBaseProps {
	title: string;
	editing: boolean;
	setEditing: React.Dispatch<boolean>;
	width: number;
	state: any;
	myInput: any;
	saveHandler: any;
	table: SchoolCityIDBTable;
}
const DetailsNDraftBase: ({}: DetailsNDraftBaseProps) => JSX.Element = ({
	title,
	table,
	editing,
	setEditing,
	width,
	state,
	myInput,
	saveHandler,
}) => {
	console.log(`DetailsNDraftBase rerendered`);
	useEffect(() => {}, [title, editing, width]);
	const storeKeys = Object.keys(state).filter(
		(key) => key !== "sheetId" && key !== "title" && key !== "id"
	);
	return (
		<div className="header-page-center-container">
			<Card className="header-page-center-container-card">
				<div className="flex pl-6 justify-between items-center ">
					<Typography variant="h1">{title}</Typography>
					<span className="flex justify-between items-center">
						{table === "mark" && (
							<Button
								className="md:inline-flex h-fit w-fit rounded mr-4"
								onClick={() => {
									Sheets(state);
								}}
							>
								Go to Sheet
								<FontAwesomeIcon
									className="ml-4"
									icon={faArrowUpRightFromSquare}
								/>
							</Button>
						)}
						<IconButton
							className="md:inline-flex h-20 w-20 rounded "
							onClick={() => setEditing(!editing)}
						>
							{/* <Icon name="menu" size="3xl" /> */}
							<FontAwesomeIcon icon={faPencil} />
						</IconButton>
					</span>
				</div>
				{width > 1024 ? (
					<div className="lg:flex w-full">
						<div className="right lg:w-1/2 lg:h-full">
							{storeKeys
								.filter((_, ind) => ind % 2 === 0)
								.map((key) => (
									<span key={key} className="w-fit relative inline">
										<div className="relative flex m-4  content-center">
											<Typography
												className="flex justify-center items-center mr-4"
												variant="h6"
											>
												{key.endsWith("Id")
													? key.substring(0, key.length - 2)
													: key.endsWith("Ids")
													? key.substring(0, key.length - 3) + "s"
													: key}
											</Typography>
											{myInput(key)}
										</div>
									</span>
								))}
						</div>
						<div className="left lg:w-1/2 lg:h-full">
							{storeKeys
								.filter((_, ind) => ind % 2 !== 0)
								.map((key) => (
									<span key={key} className="w-fit relative inline">
										<div className="relative flex m-4  content-center">
											<Typography
												className="flex justify-center items-center mr-4"
												variant="h6"
											>
												{key.endsWith("Id")
													? key.substring(0, key.length - 2)
													: key.endsWith("Ids")
													? key.substring(0, key.length - 3) + "s"
													: key}
											</Typography>
											{myInput(key)}
										</div>
									</span>
								))}
						</div>
					</div>
				) : (
					storeKeys.map((key) => (
						<span key={key} className="w-fit relative inline">
							<div className="relative flex m-4  content-center">
								<Typography
									className="flex justify-center items-center mr-4"
									variant="h6"
								>
									{key.endsWith("Id")
										? key.substring(0, key.length - 2)
										: key.endsWith("Ids")
										? key.substring(0, key.length - 3) + "s"
										: key}
								</Typography>
								{myInput(key)}
							</div>
						</span>
					))
				)}
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

export default DetailsNDraftBase;
