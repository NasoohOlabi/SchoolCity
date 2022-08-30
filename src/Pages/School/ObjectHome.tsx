import TemplatesSection from "components/Home/Templates/TemplatesSection";
import Tile from "components/Home/Templates/Tile";
import { myCrud } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "Language/t";
import { IStore } from "Model/Store";
import { collapse } from "Model/View/ExpandTemplates";
import useTitle from "Model/View/Layout/useTitle";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useTableUrl from "./useTableUrl";

interface ObjectHomeProps {}

const ObjectHome: (args: ObjectHomeProps) => JSX.Element = ({}) => {
	const x = useTableUrl();

	if (x.type === "redirect" || x.id !== null) return <Navigate to="/" />;

	const table = x.table;

	useTitle(t(table.toString()) + t(" Home"));

	const db = useContext(SchoolCityDBContext);

	const expanded = useSelector(
		(state: IStore) => state.templatesExpanded.expanded
	);
	const dispatch = useDispatch();

	useEffect(() => {
		return () => {
			dispatch(collapse());
		};
	}, []);

	const allRecords = useLiveQuery(
		() => db && myCrud.getAll(table, db),
		[]
	) as { id: number; name: string; description: string }[];

	// const w = new Worker(new URL("./workers/try.worker.ts", import.meta.url));

	// w.postMessage("fart");
	// w.postMessage({ data: "fart" });
	return (
		<div className="App h-full">
			<TemplatesSection table={table} />
			{!expanded && (
				<div className="p-8 ">
					{allRecords &&
						allRecords.map((item) => (
							<div
								key={item.id || item.name}
								className="inline-block m-7"
							>
								<Tile instance={item} size="l" table={table} />
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default ObjectHome;