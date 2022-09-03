/* This example requires Tailwind CSS v2.0+ */
// import { SelectorIcon } from "@heroicons/react/20/solid.SelectorIcon";
import { myCrud, OM, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext } from "react";
import MySelect from "./MySelect";

export interface ManyToOneProps {
	one: SchoolCityIDBTable;
	selected?: IndexableType;
	disabled: boolean;
	setFk: (id: IndexableType) => void;
	filter?: (x: any) => boolean;
}

const ManyToOne: ({}: ManyToOneProps) => JSX.Element = ({
	one,
	disabled,
	selected: selectedPk,
	setFk,
	filter,
}) => {
	const db = useContext(SchoolCityDBContext);

	const all = useLiveQuery(() => myCrud.getAll(one, db), [one]) as any[];
	if (!all) return <p>loading...</p>;
	const f = filter && all.filter(filter);
	const viewAll = f || all || [];
	const selected =
		all.filter((x) => OM.identifier(x, one) === selectedPk)[0] || {};

	return (
		<span className="w-96">
			<MySelect
				selectedItem={selected}
				disabled={disabled}
				kind={one}
				items={viewAll}
				onChange={(evt) => {
					setFk(OM.identifier(evt, one));
				}}
			/>
		</span>
	);
};

export default ManyToOne;
