import Details from "components/Details";
import { t } from "Language/t";
import { Navigate } from "react-router-dom";
import useTableUrl from "./useTableUrl";

interface ObjectInfoProps {}

const ObjectInfo: (args: ObjectInfoProps) => JSX.Element = ({}) => {
	const x = useTableUrl(2);

	if (x.type === "redirect" || x.name === undefined)
		return <Navigate to="/" />;

	const table = x.table;

	console.log("table = ", table);
	console.log("t(table)+t(' Info') = ", t(table) + t(" Info"));
	console.log("{ name: x.name } = ", { name: x.name });
	return (
		<Details
			table={table}
			title={t(table) + t(" Info")}
			selector={{ name: x.name }}
		/>
	);
};

export default ObjectInfo;
