import { Option, Select } from "@material-tailwind/react";
import { myCrud, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useContext } from "react";
import ListMaintainer from "./ListMaintainer";

interface OneToManyProps {
	oneTable: SchoolCityIDBTable;
	lst: any[];
	setLst: (lst: any[]) => void;
	manyTable: SchoolCityIDBTable;
	disabled?: boolean;
}

const OneToMany: React.FC<OneToManyProps> = ({
	lst,
	setLst,
	manyTable,
	oneTable,
	disabled = false,
}) => {
	const db = useContext(SchoolCityDBContext);

	const selected: any[] = lst;

	const all = useLiveQuery(
		() => (db && myCrud.getAll(manyTable, db)) || [],
		[]
	) as any[];

	console.log("all = ", all);

	console.log("manyTable = ", manyTable);
	console.log("shouldbe", "section" as SchoolCityIDBTable);

	return (
		<div className="flex items-center justify-between ">
			<span style={{ maxWidth: "20rem" }}>
				<Select disabled={disabled} label={manyTable}>
					{((() => {
						console.log("all = ", all, !!all);
						return true;
					})() &&
						all &&
						all
							.filter((x) => !lst.includes(x))
							.map((k: any, ind: number) => (
								<Option key={ind}>{k}</Option>
							))) ||
						""}
				</Select>
			</span>
			<ListMaintainer lst={lst} disabled={disabled} setLst={setLst} />
		</div>
	);
};

export default React.memo(OneToMany);
