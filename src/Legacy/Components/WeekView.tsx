//import { Card, Typography } from "@material-ui/core";
import { useCallback, useContext, useEffect, useRef } from "react";
import {
	Solver_Week,
	Solver_Week_util,
	TeacherId,
	Transposition,
	TranspositionInstruction,
} from "../Interfaces/Interfaces";
import { fill, randomFiller, useForceUpdate } from "../Logic/Logic";
import { BasicTable } from "./BasicTable";
// import { allClasses } from "./Data";
import { MySelectItem } from "components/Details/MySelect";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import makeSolverWeek from "Legacy/makeSolverWeek";
import solveWorker from "../../workers/solve.worker?worker";
import { someHowPutHimAt } from "../Logic/CoreAlgo";
import { PosType } from "../types";
import SubAppBar from "./SubAppBar";
import { texts } from "./UiText";

export default function WeekView(theme: any): JSX.Element {
	const WEEK_GLOBAL_Object_Ref = useRef<Solver_Week | undefined>(undefined);

	const handleChange = useCallback((pos: PosType, m: number) => {
		return (value: string | MySelectItem) => {
			let teacher: TeacherId = +texts.NameMap[value as string];
			console.clear();
			if (WEEK_GLOBAL_Object_Ref.current) {
				someHowPutHimAt(m, teacher, pos, WEEK_GLOBAL_Object_Ref.current);
				WEEK_GLOBAL_Object_Ref.current.allClasses[m].l[pos].isCemented =
					true;
			}
		};
	}, []);
	// const initCell = (m: number) => {
	// 	return (pos: PosType) => {
	// 		return (cellRefresher?: any) => {
	// 			// if (WEEK_GLOBAL_Object.refreshTable !== undefined)
	// 			// WEEK_GLOBAL_Object.refreshTable[m][pos[0]][pos[1]] =
	// 			// 	cellRefresher;
	// 		};
	// 	};
	// };
	// const initTableFooter = (m: number) => {
	// 	return (tableFooterfn: any) => {
	// 		if (WEEK_GLOBAL_Object.tableFooterRefresher !== undefined)
	// 			WEEK_GLOBAL_Object.tableFooterRefresher[m] = tableFooterfn;
	// 	};
	// };
	const db = useContext(SchoolCityDBContext);
	const forceUpdate = useForceUpdate();
	useEffect(
		() => {
			console.clear();
			db &&
				makeSolverWeek(db).then((week) => {
					WEEK_GLOBAL_Object_Ref.current = week;
					Solver_Week_util.teacherScheduleInit(
						WEEK_GLOBAL_Object_Ref.current
					);
					fill(WEEK_GLOBAL_Object_Ref.current);
					WEEK_GLOBAL_Object_Ref.current.forceUpdate = forceUpdate;
					forceUpdate();
				});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	const Solve = () => {
		if (!window.Worker) {
			console.log("Your browser doesn't support web workers.");
			return;
		}
		const changeCellPost = (payload: TranspositionInstruction) => {
			const { m, pos } = payload;
			// WEEK_GLOBAL_Object.refreshTable[m][x][y]();
		};
		if (!WEEK_GLOBAL_Object_Ref.current) return;
		randomFiller(WEEK_GLOBAL_Object_Ref.current);
		forceUpdate();

		const data: any = JSON.stringify(WEEK_GLOBAL_Object_Ref.current);
		const worker: Worker = new solveWorker();
		worker.postMessage(data);
		worker.onmessage = (event) => {
			const msg = event.data;
			console.log(`msg = `, msg);

			if (msg.type === "multipleChanges") {
				for (let i = 0; i < event.data.payload.length; i++) {
					const payload = msg.payload as Transposition;
					const { m, pos } = payload[i];
					if (WEEK_GLOBAL_Object_Ref.current)
						WEEK_GLOBAL_Object_Ref.current.allClasses[m].l[
							pos
						].currentTeacher = payload[i].teacher;
				}
			} else if (msg.type === "Done") {
				console.log("Final post msg.payload = ", msg.payload);
				if (WEEK_GLOBAL_Object_Ref.current) {
					WEEK_GLOBAL_Object_Ref.current.allClasses =
						msg.payload.allClasses;
					WEEK_GLOBAL_Object_Ref.current.teacherSchedule =
						msg.payload.teacherSchedule;
				}
				// worker.terminate();
			} else {
				console.log(`We suspect it's`);
				console.log(`unknown message error`, msg);
				return;
			}
			forceUpdate();
		};
	};
	if (!WEEK_GLOBAL_Object_Ref.current) return <p>Loading...</p>;
	else
		return (
			<div className="flex flex-col">
				<SubAppBar Solve={Solve} />
				<div className="bg-white m-0">
					{WEEK_GLOBAL_Object_Ref.current.allClasses.map((Class, i) => {
						return (
							<div key={i}>
								<BasicTable
									// theme = {props.theme}
									m={i}
									headCol={texts.headCol}
									headRow={texts.headRow}
									handleChange={handleChange}
									WEEK_GLOBAL_Object={
										WEEK_GLOBAL_Object_Ref.current as Solver_Week
									}
								/>
							</div>
						);
					})}
				</div>
			</div>
		);
}
