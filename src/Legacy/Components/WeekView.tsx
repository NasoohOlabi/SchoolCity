//import { Card, Typography } from "@material-ui/core";
import { useCallback, useContext, useEffect } from "react";
import {
	Solver_Week_util,
	TeacherId,
	Transposition,
	TranspositionInstruction,
} from "../Interfaces/Interfaces";
import { fill, randomFiller, useForceUpdate } from "../Logic/Logic";
import { BasicTable } from "./BasicTable";
// import { allClasses } from "./Data";
import { MySelectItem } from "components/Details/MySelect";
import solveWorker from "../../workers/solve.worker?worker";
import { someHowPutHimAt } from "../Logic/CoreAlgo";
import { PosType } from "../types";
import { weekContext } from "./DataViewComponents/DataViewModel";
import SubAppBar from "./SubAppBar";
import { texts } from "./UiText";

export function WeekView(theme: any): JSX.Element {
	let WEEK_GLOBAL_Object = useContext(weekContext).week;

	const handleChange = useCallback((pos: PosType, m: number) => {
		return (value: string | MySelectItem) => {
			let teacher: TeacherId = +texts.NameMap[value as string];
			console.clear();
			someHowPutHimAt(m, teacher, pos, WEEK_GLOBAL_Object);
			WEEK_GLOBAL_Object.allClasses[m].l[pos[0]][pos[1]].isCemented = true;
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
	const forceUpdate = useForceUpdate();
	WEEK_GLOBAL_Object.forceUpdate = forceUpdate;
	useEffect(
		() => {
			console.clear();
			Solver_Week_util.teacherScheduleInit(WEEK_GLOBAL_Object);
			fill(WEEK_GLOBAL_Object);
			forceUpdate();
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
			const [x, y] = payload.pos;
			const m = payload.m;
			// WEEK_GLOBAL_Object.refreshTable[m][x][y]();
		};

		randomFiller(WEEK_GLOBAL_Object, changeCellPost);
		forceUpdate();

		const data: any = JSON.stringify(WEEK_GLOBAL_Object);
		const worker: Worker = new solveWorker();
		worker.postMessage(data);
		worker.onmessage = (event) => {
			const msg = event.data;
			console.log(`msg = `, msg);

			if (msg.type === "multipleChanges") {
				for (let i = 0; i < event.data.payload.length; i++) {
					const payload = msg.payload as Transposition;
					const [x, y] = payload[i].pos;
					const m = payload[i].m;
					WEEK_GLOBAL_Object.allClasses[m].l[x][y].currentTeacher =
						payload[i].teacher;
				}
			} else if (msg.type === "Done") {
				console.log("Final post msg.payload = ", msg.payload);
				WEEK_GLOBAL_Object.allClasses = msg.payload.allClasses;
				WEEK_GLOBAL_Object.teacherSchedule = msg.payload.teacherSchedule;
				worker.terminate();
			} else {
				console.log(`We suspect it's`);
				console.log(`unknown message error`, msg);
				return;
			}
			forceUpdate();
		};
	};
	return (
		<div className="flex flex-col">
			<SubAppBar Solve={Solve} />
			<div className="bg-white m-0">
				{WEEK_GLOBAL_Object.allClasses.map((Class, i) => {
					return (
						<div key={i}>
							<BasicTable
								// theme = {props.theme}
								m={i}
								headCol={texts.headCol}
								headRow={texts.headRow}
								handleChange={handleChange}
								WEEK_GLOBAL_Object={WEEK_GLOBAL_Object}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
