// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import TableCell from "@mui/material/TableCell";
import MySelect from "components/Details/MySelect";
import React from "react";
// import "../App.css";
import { ICell, TeacherId } from "../Interfaces/Interfaces";
import { useForceUpdate } from "../Logic/Logic";
import { equals } from "../Logic/util";
import { texts } from "./UiText";

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
	const [X, Y] = props.pos;
	const cellData = props.WEEK_GLOBAL_Object.allClasses[props.m].l[X][Y];

	const refreshCell = useForceUpdate();
	React.useEffect(
		() => {
			props.cellInitializer(refreshCell);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const cell = (
		D: boolean,
		show: TeacherId,
		highlight = false
	): JSX.Element => {
		const TeacherOptionsDropDown: string[] = cellData.Options.map(
			(t: TeacherId) => {
				return texts.NameMap[t];
			}
		);
		// @ts-ignore
		const displayTeacherName = texts.NameMap[show] || "";
		return (
			<td align="center">
				<form>
					<label id="demo-simple-select-label"></label>
					<MySelect
						padding="minimal"
						border="none"
						disabled={D}
						// labelId="demo-simple-select-label"
						// id="demo-simple-select"
						defaultValue={displayTeacherName}
						onChange={props.handleChange}
						noIcon={true}
						kind=""
						options={TeacherOptionsDropDown}
						onMouseOver={refreshCell}
						// className={highlight ? classes.highlighted : ""}
						// error={highlight}
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
				equals(props.pos, week.activateList[i][j].pos) &&
				props.m === week.activateList[i][j].m
			) {
				return cell(true, week.activateList[i][j].teacher, true);
			}
		}
		return cell(true, cellData.currentTeacher);
	} else {
		return cell(false, cellData.currentTeacher);
	}
}

export const Cell = React.memo(UnmemCell);
