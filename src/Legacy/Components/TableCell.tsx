// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import TableCell from "@mui/material/TableCell";
import StrSelect from "components/Details/StrSelect";
import { useForceUpdate } from "Legacy/Logic/Logic";
import React from "react";
// import "../App.css";
import type { ICell, TeacherId } from "../Interfaces/Interfaces";

// const useStyles = makeStyles((theme: any) =>
// 	createStyles({
// 		formControl: {
// 			margin: theme.spacing(1),
// 			minWidth: 120,
// 		},
// 		selectEmpty: {
// 			marginTop: theme.spacing(2),
// 		},
// 		highlighted: {
// 			font: theme.secondary,
// 		},
// 	})
// );

export function UnmemCell(props: ICell): JSX.Element {
	// const classes = useStyles();
	const week = props.WEEK_GLOBAL_Object;
	const { pos, m } = props;
	const cellData = props.WEEK_GLOBAL_Object.allClasses[m].l[pos];
	const refreshCell = useForceUpdate();

	React.useEffect(() => {
		// if (cellData.currentTeacher !== -1)
		// console.log(`cell[${X},${Y}] = `, cellData.currentTeacher);
	}, [cellData.currentTeacher]);

	const optionsTeachers =
		week.teachersGuild.filter(
			(t) => t.id && cellData.Options.includes(t.id)
		) || [];
	if (!optionsTeachers) return <></>;
	const teacher = optionsTeachers.filter(
		(t) => t.id === cellData.currentTeacher
	)[0];

	const cell = (
		D: boolean,
		show: TeacherId,
		highlight = false
	): JSX.Element => {
		const TeacherOptionsDropDown: string[] = optionsTeachers.map(
			(t) => t.name
		);
		// @ts-ignore
		const displayTeacherName = teacher?.name || "";
		return (
			<td align="center">
				<form>
					<label id="demo-simple-select-label"></label>
					<StrSelect
						padding="minimal"
						border="none"
						disabled={D}
						// labelId="demo-simple-select-label"
						// id="demo-simple-select"
						onChange={(evt) => {
							props.handleChange(evt);
							refreshCell();
						}}
						selectedItem={displayTeacherName}
						items={TeacherOptionsDropDown}
						// onMouseOver={ }
					/>
				</form>
			</td>
		);
	};

	// if (cellData.isCemented) {
	// 	return cell(true, cellData.currentTeacher);
	// }

	if (week.Swapping) {
		const i = week.currentSolutionNumber;
		for (
			let j = 0;
			week.activateList[i] && j < week.activateList[i].length;
			j++
		) {
			if (
				(props.pos,
				week.activateList[i][j].pos &&
					props.m === week.activateList[i][j].m)
			) {
				return cell(true, week.activateList[i][j].teacher, true);
			}
		}
		return cell(true, cellData.currentTeacher);
	} else {
		return cell(false, cellData.currentTeacher);
	}
}

// export const Cell = React.memo(UnmemCell);
export const Cell = UnmemCell;
