//import { Card, Typography } from "@material-ui/core";
import { useContext, useEffect } from "react";
import {
	TeacherId,
	Transposition,
	TranspositionInstruction,
	WeekObj,
} from "../Interfaces/Interfaces";
import { fill, useForceUpdate } from "../Logic/Logic";
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
	const forceUpdate = useForceUpdate();

	let WEEK_GLOBAL_Object: WeekObj = useContext(weekContext).week;
	WEEK_GLOBAL_Object.forceUpdate = forceUpdate;

	const handleChange = (Pos: PosType, m: number) => {
		return (value: string | MySelectItem) => {
			let teacher: TeacherId = +texts.NameMap[value as string];
			console.clear();
			someHowPutHimAt(m, teacher, Pos, WEEK_GLOBAL_Object);
			WEEK_GLOBAL_Object.allClasses[m].l[Pos[0]][Pos[1]].isCemented = true;
		};
	};
	const initCell = (m: number) => {
		return (Pos: PosType) => {
			return (cellRefresher: any) => {
				if (WEEK_GLOBAL_Object.refreshTable !== undefined)
					WEEK_GLOBAL_Object.refreshTable[m][Pos[0]][Pos[1]] =
						cellRefresher;
			};
		};
	};
	const initTableFooter = (m: number) => {
		return (tableFooterfn: any) => {
			if (WEEK_GLOBAL_Object.tableFooterRefresher !== undefined)
				WEEK_GLOBAL_Object.tableFooterRefresher[m] = tableFooterfn;
		};
	};
	useEffect(
		() => {
			console.clear();
			WEEK_GLOBAL_Object.teacherScheduleInit();
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
		const data: any = JSON.stringify({
			...WEEK_GLOBAL_Object,
			refreshTable: undefined,
			forceUpdate: undefined,
			tableFooterRefresher: undefined,
		});
		console.log(`data = `, data);
		const worker: Worker = new solveWorker();
		worker.postMessage(data);
		worker.onmessage = (event) => {
			const msg = event.data;
			try {
				if (msg.type === "oneChange") {
					const payload = msg.payload as TranspositionInstruction;
					const [x, y] = payload.pos;
					const m = payload.m;
					WEEK_GLOBAL_Object.allClasses[m].l[x][y].currentTeacher =
						payload.teacher;
					WEEK_GLOBAL_Object.refreshTable[m][x][y]();
				} else if (msg.type === "multipleChanges") {
					for (let i = 0; i < event.data.payload.length; i++) {
						const payload = msg.payload as Transposition;
						const [x, y] = payload[i].pos;
						const m = payload[i].m;
						WEEK_GLOBAL_Object.allClasses[m].l[x][y].currentTeacher =
							payload[i].teacher;
						WEEK_GLOBAL_Object.refreshTable[m][x][y]();
					}
				} else {
					console.log("Final post msg.payload = ", msg.payload);
					WEEK_GLOBAL_Object.allClasses = msg.payload.allClasses;
					WEEK_GLOBAL_Object.teacherSchedule = msg.payload.teacherSchedule;
					worker.terminate();
					forceUpdate();
				}
			} catch (error) {
				console.log(`error = `, error);
				console.log(`We suspect it's`);
				console.log(`unknown message error`, msg);
			}
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
								cellInitializer={initCell(i)}
								tableFooterInitializer={initTableFooter(i)}
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
