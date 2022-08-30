import { useEffect } from "react";
import { IBasicTableProps } from "../Interfaces/Interfaces";
import { Cell } from "./TableCell";
import TableFooter from "./TableFooter";

export function BasicTable(props: IBasicTableProps) {
	const week = props.WEEK_GLOBAL_Object;
	useEffect(
		() => {
			// console.log(`useEffect basic table ${props.m} rerendered`);
		},
		week.allClasses[props.m].l.flatMap((row) =>
			row.map((c) => c.currentTeacher)
		)
	);
	// const classes = useStyles();
	return (
		// <div component={Paper}>
		<div>
			<table
				className="w-full table-fixed mt-3 mb-3"
				// aria-label="simple table"
			>
				<thead>
					<tr>
						<th
							onClick={(event) => {
								console.log(week.allClasses[props.m]);
								console.log(week);
							}}
						>
							{" "}
							{week.allClasses[props.m].Name}{" "}
						</th>
						{props.headRow.map((x, c) => {
							return (
								<td key={c} align="center">
									{x}
								</td>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{props.headCol.map((day, index) => {
						return (
							<tr key={index}>
								<td className="w-28"> {day} </td>
								{week.allClasses[props.m].l[index].map((d, jndex) => {
									return (
										<Cell
											key={`${[index, jndex]}`}
											pos={[index, jndex]}
											m={props.m}
											handleChange={props.handleChange(
												[index, jndex],
												props.m
											)}
											WEEK_GLOBAL_Object={week}
										/>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<TableFooter m={props.m} WEEK_GLOBAL_Object={week} />
		</div>
	);
}
