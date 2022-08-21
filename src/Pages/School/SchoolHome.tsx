import TemplatesSection from "components/Home/Templates/TemplatesSection";
import Tile from "components/Home/Templates/Tile";
import { myCrud, School } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useLiveQuery } from "dexie-react-hooks";
import { IStore } from "Model/Store";
import { collapse } from "Model/View/ExpandTemplates";
import useTitle from "Model/View/Layout/useTitle";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SchoolHomeProps {}

const SchoolHome: ({}: SchoolHomeProps) => JSX.Element = ({}) => {
	useTitle("School Home");

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

	const allSchools = useLiveQuery(
		() => db && myCrud.getAll("school", db),
		[]
	) as School[];

	// const w = new Worker(new URL("./workers/try.worker.ts", import.meta.url));

	// w.postMessage("fart");
	// w.postMessage({ data: "fart" });
	return (
		<div className="App h-full">
			<TemplatesSection table="schoolTemplates" />
			{!expanded && (
				<div className="grid grid-cols-3">
					{allSchools &&
						allSchools.map((school) => (
							<Tile key={school.id} instance={school} />
						))}
				</div>
			)}
		</div>
	);
};

export default SchoolHome;
