import { Button } from "@material-tailwind/react";
import React from "react";
import {
	ITableFooter,
	TranspositionInstruction,
} from "../Interfaces/Interfaces";
import { Done } from "../Logic/CoreAlgo";

export default function TableFooter(props: ITableFooter): JSX.Element {
	const week = props.WEEK_GLOBAL_Object;
	const ms: number[] = [];
	if (week.activateList[week.currentSolutionNumber])
		week.activateList[week.currentSolutionNumber].forEach((step) => {
			let in_ms = false;
			for (let i = 0; i < ms.length; i++) {
				if (ms[i] === step.m) {
					in_ms = true;
					break;
				}
			}
			if (!in_ms) {
				ms.push(step.m);
			}
		});
	// console.log(`footer ${props.m} rendered `);
	React.useEffect(
		() => {
			// console.log(`footer ${props.m} week.Swapping = `, week.Swapping);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[week.Swapping, week.activateList, week.currentSolutionNumber]
	);

	if (!week.Swapping) {
		return <></>;
	}
	if (week.Swapping && week.activateList.length <= 0) {
		return (
			<p>
				No Solutions! <Button onClick={Done(week)}>OK</Button>
			</p>
		);
	}
	return (
		<div>
			{week.Swapping && ms.includes(props.m) && (
				<table>
					<tr>
						<td>
							<Button
								onClick={(e: any) => {
									if (week.currentSolutionNumber > 0) {
										week.currentSolutionNumber--;
										// week.forceUpdate();
										const sol1 =
											week.activateList[
												week.currentSolutionNumber + 1
											];
										const sol2 =
											week.activateList[week.currentSolutionNumber];
										if (sol1)
											sol1.forEach(
												(step: TranspositionInstruction) => {
													// if (week.refreshTable !== undefined)
													// 	week.refreshTable[step.m][
													// 		step.pos[0]
													// 	][step.pos[1]]();
												}
											);
										if (sol2)
											sol2.forEach(
												(step: TranspositionInstruction) => {
													// if (week.refreshTable !== undefined)
													// 	week.refreshTable[step.m][
													// 		step.pos[0]
													// 	][step.pos[1]]();
												}
											);
										// if (week.tableFooterRefresher !== undefined)
										// 	week.tableFooterRefresher.forEach(
										// 		(tfr: any) => {
										// 			tfr();
										// 		}
										// 	);
									}
								}}
							>
								{"<"}
							</Button>
						</td>
						<td>
							{week.currentSolutionNumber + 1}/{week.activateList.length}
						</td>
						<td>
							<Button
								onClick={(e: any) => {
									if (
										week.currentSolutionNumber <
										week.activateList.length - 1
									) {
										week.currentSolutionNumber++;
										const sol1 =
											week.activateList[
												week.currentSolutionNumber - 1
											];
										const sol2 =
											week.activateList[week.currentSolutionNumber];
										if (sol1)
											sol1.forEach(
												(step: TranspositionInstruction) => {
													// if (week.refreshTable !== undefined)
													// 	week.refreshTable[step.m][
													// 		step.pos[0]
													// 	][step.pos[1]]();
												}
											);
										if (sol2)
											sol2.forEach(
												(step: TranspositionInstruction) => {
													// if (week.refreshTable !== undefined)
													// 	week.refreshTable[step.m][
													// 		step.pos[0]
													// 	][step.pos[1]]();
												}
											);
										// if (week.tableFooterRefresher !== undefined)
										// 	week.tableFooterRefresher.forEach(
										// 		(tfr: any) => {
										// 			tfr();
										// 		}
										// 	);
									}
								}}
							>
								{">"}
							</Button>
						</td>
						<td>
							<Button onClick={Done(week)}>Done</Button>
						</td>
						<td>
							Effected Classes :{" "}
							{week.activateList[week.currentSolutionNumber].reduce(
								(acc, item) => {
									if (
										!acc.includes("" + week.allClasses[item.m].Name)
									) {
										return acc + `${week.allClasses[item.m].Name} `;
									} else return acc + "";
								},
								""
							)}
						</td>
					</tr>
				</table>
			)}
		</div>
	);
}
