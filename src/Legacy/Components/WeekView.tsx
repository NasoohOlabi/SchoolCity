//import { Card, Typography } from "@material-ui/core";
import { useCallback, useContext, useEffect, useRef } from "react";
import {
	Solver_Week,
	Solver_Week_util,
	TeacherId,
	Transposition,
} from "../Interfaces/Interfaces";
import { fill, randomFiller, useForceUpdate } from "../Logic/Logic";
import { BasicTable } from "./BasicTable";
// import { allClasses } from "./Data";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import makeSolverWeek from "Legacy/makeSolverWeek";
import solveWorker from "../../workers/solve.worker?worker";
import { PosType } from "../types";
import SubAppBar from "./SubAppBar";
import { texts } from "./UiText";

export default function WeekView(theme: any): JSX.Element {
	const WEEK_GLOBAL_Object_Ref = useRef<Solver_Week | undefined>(undefined);
	const WORKER_Ref = useRef<Worker | undefined>(undefined);

	const handleChange = useCallback((pos: PosType, m: number) => {
		return (value: string) => {
			if (!WEEK_GLOBAL_Object_Ref.current) return;
			let teacher: TeacherId =
				WEEK_GLOBAL_Object_Ref.current.teachersGuild.filter(
					(x) => x.name === value
				)[0].id || 0;
			if (!WORKER_Ref.current) WORKER_Ref.current = new solveWorker();
			WORKER_Ref.current.postMessage({
				m,
				teacher,
				pos,
				type: "put",
				week: JSON.stringify(
					Solver_Week_util.compress(WEEK_GLOBAL_Object_Ref.current)
				),
			});
			forceUpdate();
		};
	}, []);

	const db = useContext(SchoolCityDBContext);
	const forceUpdate = useForceUpdate();
	useEffect(
		() => {
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
		if (!WEEK_GLOBAL_Object_Ref.current) return;
		randomFiller(WEEK_GLOBAL_Object_Ref.current);
		forceUpdate();

		const data: any = JSON.stringify(
			Solver_Week_util.compress(WEEK_GLOBAL_Object_Ref.current)
		);
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
