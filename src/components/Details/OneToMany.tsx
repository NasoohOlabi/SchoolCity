import { myCrud, OM, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useLiveQuery } from "dexie-react-hooks";
import useRerender from "Model/hooks/useRerender";
import { useCallback, useContext } from "react";
import ListMaintainer from "./ListMaintainer";
import ManyToOne from "./ManyToOne";

interface OneToManyProps {
	oneTable: SchoolCityIDBTable;
	lst: any[];
	setLst: (lst: any[]) => void;
	manyTable: SchoolCityIDBTable;
	disabled?: boolean;
}

const OneToMany: (args: OneToManyProps) => JSX.Element = ({
	lst,
	setLst,
	manyTable,
	oneTable,
	disabled = false,
}) => {
	const db = useContext(SchoolCityDBContext);

	const selected: any[] = lst;
	const reRender = useRerender();
	console.log(`manyTable = `, manyTable);
	const all = useLiveQuery(
		() => (db && myCrud.getAll(manyTable, db)) || [],
		[]
	) as any[];

	const changeHandler = (value: any) => {
		setLst([...lst, +value]);
		reRender();
	};

	const selectedFromAll =
		(all && all.filter((x) => !lst.includes(OM.identifier(manyTable, x)))) ||
		[];

	const filter = useCallback(
		(x: any) => !lst.includes(OM.identifier(x, manyTable)),
		[lst, manyTable]
	);
	// TODO: handle Select onChange event
	return (
		<span className="w-96">
			<span>
				<ListMaintainer
					lst={lst}
					items={all}
					disabled={disabled}
					setLst={setLst}
				/>
			</span>
			{selectedFromAll.length > 0 && !disabled && (
				<span>
					<ManyToOne
						disabled={disabled}
						many={oneTable}
						one={manyTable}
						setFk={changeHandler}
						filter={filter}
					/>
				</span>
			)}
		</span>
	);
};

// export default React.memo(OneToMany);
export default OneToMany;
