import useSetting from "components/hooks/useSetting";
import { Section, Teacher } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "Language/t";
import { useContext } from "react";
import { MyImage, MySelectItem } from "./MySelect";

const DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
export interface DBGridMaintainerProps {
	grid: (number | null)[][];
	colorClass?: {
		[value: number]: string;
	};
	nullColor: string;
	idsTable: "teacher" | "section";
}

const DBGridMaintainer: ({}: DBGridMaintainerProps) => JSX.Element = ({
	grid,
	colorClass,
	nullColor,
	idsTable,
}) => {
	const days = [...DAYS];
	const db = useContext(SchoolCityDBContext);
	const firstDayOfTheWeek = useSetting("startWeekDay");
	const numberOfPeriods = useSetting("periodsPerDay");
	const workdays = useSetting("numberOfWorkdays");
	const flatGridIds: number[] = grid
		.flat()
		.filter((i) => typeof i === "number") as number[];

	const teachersOrSections = useLiveQuery(
		() => db[idsTable].where("id").anyOf(flatGridIds).toArray(),
		[...flatGridIds]
	) as (Teacher | Section)[];

	if (!teachersOrSections) return <></>;
	if (!firstDayOfTheWeek || !numberOfPeriods || !workdays) return <></>;
	const periods = new Array(numberOfPeriods)
		.fill(null)
		.map((_, i) => t(`Period`) + " " + i.toString());

	for (let i = 0; i < DAYS.length && days[0] !== firstDayOfTheWeek; i++) {
		const front = days.shift();
		if (front) days.push(front);
		else break;
	}
	while (days.length > workdays && days.length > 0) {
		days.pop();
	}

	const teacherOrSection = new Map<number, MySelectItem>();
	teachersOrSections.forEach((t) => {
		console.log(`{ id: t.id, name: t.name } = `, { id: t.id, name: t.name });
		if (t.id)
			teacherOrSection.set(t.id, { id: t.id, name: t.name } as MySelectItem);
	});

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
							{grid[index].map((v, index) => {
								const item = v && teacherOrSection.get(v);
								return (
									<td
										key={index}
										className={
											(v === null && nullColor) ||
											(colorClass && v && colorClass[v]) ||
											""
										}
									>
										{v && item && idsTable && MyImage(item, idsTable)}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DBGridMaintainer;
