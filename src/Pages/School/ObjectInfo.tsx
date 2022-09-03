import Details from "components/Details/Details";
import { t } from "Language/t";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useTableUrl from "./useTableUrl";

interface ObjectInfoProps {}

const ObjectInfo: (args: ObjectInfoProps) => JSX.Element = ({}) => {
	const x = useTableUrl(2);
	useEffect(() => {
		console.log("reRender ObjectInfo due to changes");
		console.log(`Object info table = `, x.table);
		console.log(`Object info type = `, x.type);
		console.log(`Object info id = `, x.id);
	}, [x.type, x.table, x.id]);
	const properType = (x: any) => (isNaN(+x) ? x : +x);

	console.log(`ObjectInfo render`);

	if (x.type === "redirect" || x.id === null) return <Navigate to="/" />;
	else
		return (
			<Details
				table={x.table}
				title={t(x.table) + t(" Info")}
				selector={properType(x.id)}
			/>
		);
};

export default ObjectInfo;
