/* This example requires Tailwind CSS v2.0+ */
// import { SelectorIcon } from "@heroicons/react/20/solid.SelectorIcon";
import { myCrud, OM, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "Language/t";
import { useContext } from "react";
import MySelect from "./MySelect";

export interface ManyToOneProps {
	many: SchoolCityIDBTable;
	one: SchoolCityIDBTable;
	selected?: IndexableType;
	disabled: boolean;
	setFk: (id: IndexableType) => void;
	filter?: (x: any) => boolean;
	noIcon?: boolean;
}

const ManyToOne: ({}: ManyToOneProps) => JSX.Element = ({
	one,
	disabled,
	many,
	selected: selectedPk,
	noIcon = false,
	setFk,
	filter,
}) => {
	const db = useContext(SchoolCityDBContext);
	if (!db) return <p>{t(`Cann't Connect to Data Base`)}</p>;

	const all = useLiveQuery(() => myCrud.getAll(one, db), []) as any[];
	if (!all) return <p>loading...</p>;
	const f = filter && all.filter(filter);
	const viewAll = f || all || [];
	const selected =
		all.filter((x) => OM.identifier(x, one) === selectedPk)[0] || {};

	return (
		<span className="w-96">
			<MySelect
				defaultValue={selected}
				noIcon={noIcon}
				disabled={disabled}
				kind={one}
				options={viewAll}
				onChange={(evt) => {
					setFk(OM.identifier(evt, one));
				}}
			/>
		</span>
	);
};

export default ManyToOne;
