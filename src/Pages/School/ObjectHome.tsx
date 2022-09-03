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
import { Navigate, useParams } from "react-router-dom";
import useTableUrl from "./useTableUrl";

interface ObjectHomeProps {}

const ObjectHome: (args: ObjectHomeProps) => JSX.Element = ({}) => {
	const x = useTableUrl();

	if (x.type === "redirect" || x.id !== null) return <Navigate to="/" />;

	const table = x.table;

	const params = useParams();

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
		() =>
			db &&
			((params.schoolName &&
				table !== "teacher" &&
				table !== "settings" &&
				myCrud.getAll(table, db, {
					where: { schoolId: params.schoolName },
				})) ||
				myCrud.getAll(table, db)),
		[table]
	) as { id: number; name: string; description: string; schoolId?: string }[];

	// const w = new Worker(new URL("./workers/try.worker.ts", import.meta.url));
	const displayLst = allRecords.map((x) => {
		if (x.schoolId)
			x.description =
				x.schoolId === "global"
					? "This is a default setting for all schools"
					: "School " + x.schoolId;
		return x;
	});
	// w.postMessage("fart");
	// w.postMessage({ data: "fart" });
	return (
		<div className="App h-full">
			<TemplatesSection table={table} />
			{!expanded && (
				<div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
