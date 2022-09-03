import useSetting from "components/hooks/useSetting";
import { Grid, LoopOverGrid } from "DB/schema";
import { t } from "Language/t";

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
export interface GridMaintainerProps {
	lst: [number, number][];
	setLst: (newGrid: (number | null)[][]) => void;
	disabled: boolean;
}

const GridMaintainer: ({}: GridMaintainerProps) => JSX.Element = ({
	disabled,
	lst,
	setLst,
}) => {
	const days = [...DAYS];
	const firstDayOfTheWeek = useSetting("startWeekDay");
	const numberOfPeriods = useSetting("periodsPerDay");
	const workdays = useSetting("numberOfWorkdays");
	if (!firstDayOfTheWeek || !numberOfPeriods || !workdays) return <></>;

	const grid = LoopOverGrid(
		Grid(workdays, numberOfPeriods),
		(e, i, j) =>
			(lst && lst.some((e: [number, number]) => e[0] === i && e[1] === j)) ||
			0
	);
	const periods = new Array(numberOfPeriods)
		.fill(null)
		.map((_, i) => t(`Period`) + " " + i.toString());

	while (days[0] !== firstDayOfTheWeek) {
		const front = days.shift();
		if (front) days.push(front);
		else break;
	}
	while (days.length > workdays) {
		days.pop();
	}
	function toggle(x: number, y: number) {
		return () => {
			if (
				!disabled &&
				lst &&
				lst.some((e: [number, number]) => e[0] === x && e[1] === y)
			) {
				//remove
				setLst(lst.filter(([i, j]) => x !== i || y !== j));
			} else if (
				!disabled &&
				lst &&
				!lst.some((e: [number, number]) => e[0] === x && e[1] === y)
			) {
				setLst([...lst, [x, y]]);
			}
		};
	}

	return (
		<div className="w-96">
			<table>
				<thead>
					<tr>
						<td></td>
						{periods.map((period, index) => (
							<td className="text-center align-middle" key={index}>
								{period}
							</td>
						))}
					</tr>
				</thead>
				<tbody>
					{days.map((day, index) => (
						<tr key={index}>
							<td>{day}</td>
							{grid[index].map((v, j_index) => (
								<td
									key={j_index}
									onClick={toggle(index, j_index)}
									className={`availability-cell availability-cell-${
										(v === 0 && "black") || (v ? "green" : "red")
									}
									  ${
											!disabled &&
											`hover-availability-cell-${
												(v === 0 && "black") ||
												(v ? "green" : "red")
											}`
										}`}
								></td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default GridMaintainer;
