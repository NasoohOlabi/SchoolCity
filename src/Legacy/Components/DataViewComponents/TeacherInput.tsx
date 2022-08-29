// import {
// 	Button,
// 	Checkbox,
// 	DialogActions,
// 	DialogContent,
// 	DialogTitle,
// 	FormControlLabel,
// 	IconButton,
// 	makeStyles,
// 	MenuItem,
// 	Select,
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	TextField,
// 	Theme,
// 	Typography,
// } from "material-ui";

// import RemoveIcon from "@material-ui/icons/Remove";
// import ScheduleIcon from "@material-ui/icons/Schedule";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { NUM_OF_DAYS, NUM_OF_PERIODS_PER_DAY } from "../../Interfaces/ClassObj";
// import { TeacherType } from "../../Interfaces/Interfaces";
// import { equals } from "../../Logic/util";
// import { PosType } from "../../types";
// import { texts } from "../UiText";
// import {
// 	MAX_NUMBER_OF_PERIODS_TEACHER_CAN_TEACH,
// 	weekContext,
// } from "./DataViewModel";
// import { Topic } from "./Topic";

// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		root: {
// 			flexGrow: 1,
// 		},
// 		paper: {
// 			padding: theme.spacing(2),
// 			textAlign: "center",
// 			color: theme.palette.text.secondary,
// 		},
// 		pCard: {
// 			display: "inline-block",
// 			width: "100%",
// 		},
// 		childCard: {
// 			display: "inline-block",
// 			// maxWidth: 400,
// 		},
// 		cell: {
// 			textAlign: "inherit",
// 		},
// 		table: {
// 			textAlign: texts.LangDirection === "ltr" ? "left" : "right",
// 			fontSize: "0.5rem",
// 			// width: "100%",
// 			// minWidth: 650,
// 			alignContent: "center",
// 		},
// 		th: {},
// 		TableContainer: {
// 			alignItems: "center",
// 		},
// 		smallFont: {
// 			fontSize: "0.5rem",
// 		},
// 		paddingless: {
// 			padding: 0,
// 		},
// 	})
// );

// function parseModel(mat: boolean[][]) {
// 	const Result: PosType[] = [];
// 	mat.forEach((row, i) => {
// 		row.forEach((col, j) => {
// 			if (col && i !== 0 && j !== 0) {
// 				Result.push([i - 1, j - 1]);
// 			}
// 		});
// 	});
// 	return Result;
// }

// export function TeacherSelector(props: {
// 	defaultId?: TeacherType;
// 	onChange: (id: TeacherType) => void;
// }) {
// 	const { defaultId: id, onChange } = props;
// 	const { week } = useContext(weekContext);
// 	const [name, setName] = useState(
// 		(id && texts.NameMap[id]) || texts.NameMap[week.teachersGuild[0]]
// 	);
// 	const [teachersCount, setTeachersCount] = useState(
// 		week.teachersGuild.length
// 	);

// 	const fetchList = () => {
// 		if (week.teachersGuild.length !== teachersCount) {
// 			setTeachersCount(week.teachersGuild.length);
// 		}
// 	};
// 	const mapEventToString = (event: any) => {
// 		const v: TeacherType = +event.target.value;
// 		setName(event.target.value);
// 		onChange(v);
// 	};

// 	return (
// 		<Select
// 			value={name}
// 			label="Teacher"
// 			onChange={mapEventToString}
// 			onFocus={fetchList}
// 			defaultValue={name}
// 			placeholder={name}
// 		>
// 			{week.teachersGuild.map((t, i) => (
// 				<MenuItem key={i} value={texts.NameMap[t]}>
// 					{texts.NameMap[t]}
// 				</MenuItem>
// 			))}
// 		</Select>
// 	);
// }

// function TeacherSchedulePorter(props: {
// 	model: boolean[][];
// 	lastValue: PosType[];
// }) {
// 	const classes = useStyles();
// 	const Model = props.model;
// 	const allSelected = new Topic<boolean>(false);
// 	const rowTopics = new Array(NUM_OF_DAYS + 1)
// 		.fill(null)
// 		.map(() => new Topic<boolean>(false));
// 	const colTopics = new Array(NUM_OF_PERIODS_PER_DAY + 1)
// 		.fill(null)
// 		.map(() => new Topic<boolean>(false));
// 	const lastValue = props.lastValue;
// 	function ControlledCheckbox(props: { Pos: PosType; label?: string }) {
// 		const classes = useStyles();
// 		const [x, y] = props.Pos;
// 		const [checked, setChecked] = useState(
// 			lastValue.some((v) => equals(v, [x - 1, y - 1]))
// 		);
// 		Model[x][y] = checked;
// 		useEffect(() => {
// 			if (x === 0 || y === 0) {
// 				//nothing for now
// 				// console.log("Mat Zero")
// 			} else {
// 				// console.log('Subscribing props.Pos = ', props.Pos);
// 				allSelected.Subscribe(setChecked);
// 				rowTopics[x].Subscribe(setChecked);
// 				colTopics[y].Subscribe(setChecked);
// 			}
// 			return () => {
// 				if (x === 0 || y === 0) {
// 					//nothing for now
// 				} else {
// 					allSelected.Unsubscribe(setChecked);
// 					rowTopics[x].Unsubscribe(setChecked);
// 					colTopics[y].Unsubscribe(setChecked);
// 				}
// 			};
// 			// eslint-disable-next-line react-hooks/exhaustive-deps
// 		}, []);

// 		const changeHandler = (event: any) => {
// 			const newVal: boolean = event.target.checked;
// 			setChecked(newVal);
// 			if (x === 0 || y === 0) {
// 				if (x === 0 && y === 0) allSelected.Publish(newVal);
// 				else if (x === 0) colTopics[y].Publish(newVal);
// 				else if (y === 0) rowTopics[x].Publish(newVal);
// 			}
// 		};

// 		return props.label === undefined ? (
// 			<Checkbox
// 				checked={checked}
// 				onChange={changeHandler}
// 				inputProps={{ "aria-label": "controlled" }}
// 				size="small"
// 			/>
// 		) : (
// 			<FormControlLabel
// 				className={classes.smallFont}
// 				control={
// 					<Checkbox
// 						checked={checked}
// 						onChange={changeHandler}
// 						inputProps={{ "aria-label": "controlled" }}
// 						size="small"
// 					/>
// 				}
// 				label={props.label}
// 			/>
// 		);
// 	}

// 	return (
// 		<TableContainer>
// 			<Table>
// 				<TableHead></TableHead>
// 				<TableBody>
// 					{Array(NUM_OF_DAYS + 1)
// 						.fill(Array(NUM_OF_PERIODS_PER_DAY + 1).fill(0))
// 						.map((dayArr: number[], index) => {
// 							return (
// 								<TableRow key={index}>
// 									{dayArr.map((Period, jndex) => {
// 										let label = undefined;
// 										if (index === 0 && jndex === 0) {
// 											label = "Select all";
// 										} else if (index === 0) {
// 											label = texts.headRow[jndex - 1];
// 										} else if (jndex === 0) {
// 											label = texts.headCol[index - 1];
// 										}
// 										return (
// 											<TableCell
// 												className={classes.paddingless}
// 												key={`${index},${jndex}`}
// 											>
// 												<ControlledCheckbox
// 													Pos={[index, jndex]}
// 													label={label}
// 												/>
// 											</TableCell>
// 										);
// 									})}
// 								</TableRow>
// 							);
// 						})}
// 				</TableBody>
// 			</Table>
// 		</TableContainer>
// 	);
// }

// export function ClassTeacherInputTableRows(props: {
// 	m: number;
// 	id: TeacherType;
// 	key: number;
// }) {
// 	const classes = useStyles();
// 	const [availabilityPromptOn, setAvailabilityPromptOn] = useState(false);
// 	const { week } = useContext(weekContext);

// 	const onTeacherPeriodsChange = (event: any) => {
// 		const n = event.target.value;
// 		week.allClasses[props.m].teachers[props.id].Periods = n;
// 		week.allClasses[props.m].teachers[props.id].remPeriods = n;
// 	};
// 	const onAvailabilitySubmission = (availability: PosType[]) => {
// 		week.availables[props.id] = availability;
// 		setOpen(false);
// 	};

// 	const [open, setOpen] = React.useState(false);
// 	const handleClickOpen = () => {
// 		setOpen(true);
// 	};
// 	const handleClose = () => {
// 		setOpen(false);
// 	};

// 	const onTeacherNameChange = (event: any) => {
// 		const v: TeacherType = +event.target.value;
// 		// texts.NameMap[props.id] = v; //sketchy
// 		// setName(v);
// 		// week.allClasses[props.m].teachers[props.id]
// 	};

// 	return (
// 		<TableRow>
// 			<TableCell>
// 				<IconButton
// 					color="inherit"
// 					onClick={(e) => {
// 						setAvailabilityPromptOn(!availabilityPromptOn);
// 					}}
// 				>
// 					<RemoveIcon />
// 				</IconButton>
// 			</TableCell>
// 			<TableCell className={classes.cell}>{texts.teacherName} :</TableCell>
// 			<TableCell className={classes.cell} align="center">
// 				<Typography>{texts.NameMap[props.id]}</Typography>
// 			</TableCell>
// 			<TableCell>
// 				<TextField
// 					required
// 					type="number"
// 					id="standard-required"
// 					onChange={onTeacherPeriodsChange}
// 					defaultValue={
// 						week.allClasses[props.m].teachers[props.id].Periods
// 					}
// 					InputProps={{
// 						inputProps: {
// 							min: 0,
// 							max: MAX_NUMBER_OF_PERIODS_TEACHER_CAN_TEACH,
// 						},
// 					}}
// 				/>
// 			</TableCell>
// 			<TableCell>
// 				<IconButton color="inherit" onClick={handleClickOpen}>
// 					<ScheduleIcon />
// 				</IconButton>
// 				<FormDialog
// 					id={props.id}
// 					open={open}
// 					onAvailabilitySubmission={onAvailabilitySubmission}
// 					onClose={handleClose}
// 				/>
// 			</TableCell>
// 		</TableRow>
// 	);
// }

// const FormDialog = (props: {
// 	id: TeacherType;
// 	open: boolean;
// 	onAvailabilitySubmission: any;
// 	onClose: any;
// }) => {
// 	const { week } = useContext(weekContext);
// 	const { open, id, onAvailabilitySubmission, onClose } = props;
// 	const model: boolean[][] = useRef(
// 		Array(NUM_OF_DAYS + 1)
// 			.fill(null)
// 			.map(() => Array(NUM_OF_PERIODS_PER_DAY + 1).fill(false))
// 	).current;
// 	const Avail_terminator = () => {
// 		const parsedModel = parseModel(model);
// 		onAvailabilitySubmission(parsedModel);
// 	};
// 	return (
// 		<div>
// 			<Dialog
// 				fullWidth={true}
// 				maxWidth="xl"
// 				open={open}
// 				onClose={onAvailabilitySubmission}
// 			>
// 				<DialogTitle>Edit</DialogTitle>
// 				<DialogContent>
// 					<TeacherSchedulePorter
// 						lastValue={week.availables[id] || []}
// 						model={model}
// 					/>
// 				</DialogContent>
// 				<DialogActions>
// 					<Button onClick={onClose}>Cancel</Button>
// 					<Button onClick={Avail_terminator}>Save</Button>
// 				</DialogActions>
// 			</Dialog>
// 		</div>
// 	);
// };

export {};
