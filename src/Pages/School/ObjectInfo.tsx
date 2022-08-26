import Details from "components/Details/Details";
import { t } from "Language/t";
import { Navigate } from "react-router-dom";
import useTableUrl from "./useTableUrl";

interface ObjectInfoProps {}

const ObjectInfo: (args: ObjectInfoProps) => JSX.Element = ({}) => {
	const x = useTableUrl(2);
	if (x.type === "redirect" || x.id === null) return <Navigate to="/" />;
	const { table } = x;
	const properType = (x: any) => (isNaN(+x) ? x : +x);
	return (
		<Details
			table={table}
			title={t(table) + t(" Info")}
			selector={properType(x.id)}
		/>
	);
};

export default ObjectInfo;
