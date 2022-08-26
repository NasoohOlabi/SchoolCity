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
import { myCrud, OM, SchoolCityIDB, SchoolCityIDBTable } from "DB/schema";
import { IndexableType } from "dexie";
import { t } from "Language/t";
import React from "react";
import DetailsSectionSubjects from "./DetailsSectionSubjects";
import ManyToOne from "./ManyToOne";
import OneToMany from "./OneToMany";

export interface DetailsNDraftBaseProps {
	title: string;
	editing: boolean;
	setEditing: React.Dispatch<boolean>;
	width: number;
	state: any;
	myInput: any;
	saveHandler: any;
}

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
			db && myCrud.update(table, db, state);
		};
		const type = typeof state[key];
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
			case "number":
				const IdLess = key.substring(0, key.length - 2);
				const isId = key.substring(key.length - 2) === "Id";
				return isId ? (
					<ManyToOne
						many={table}
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
							db && myCrud.update(table, db, state);
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
			case "object":
				console.log(`key = `, key);
				if (key === "subjects") {
					return (
						<DetailsSectionSubjects
							lst={state[key]}
							disabled={!editing}
							sectionId={OM.identifier(state, table)}
						/>
					);
				} else if (key.endsWith("Ids") && state[key].length !== undefined) {
					const setLst = (lst: any[]) => {
						state[key] = lst;
						reRender();
						db && myCrud.update(table, db, state);
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
			default:
				return <p>Unsupported Type</p>;
		}
	};

const DetailsNDraftBase: ({}: DetailsNDraftBaseProps) => JSX.Element = ({
	title,
	editing,
	setEditing,
	width,
	state,
	myInput,
	saveHandler,
}) => {
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
				{width > 1024 ? (
					<div className="lg:flex w-full">
						<div className="right lg:w-1/2 lg:h-full">
							{Object.keys(state)
								.filter(
									(key, ind) =>
										key !== "title" && key !== "id" && ind % 2 === 0
								)
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
							{Object.keys(state)
								.filter(
									(key, ind) =>
										key !== "title" && key !== "id" && ind % 2 !== 0
								)
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
					Object.keys(state)
						.filter((key, ind) => key !== "title" && key !== "id")
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
