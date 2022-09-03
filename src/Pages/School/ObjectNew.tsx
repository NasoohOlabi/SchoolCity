import Draft from "components/Details/Draft";
import { Navigate } from "react-router-dom";
import useTableUrl from "./useTableUrl";

interface ObjectNewProps {}

const ObjectNew: (args: ObjectNewProps) => JSX.Element = ({}) => {
	const x = useTableUrl(2);
	console.log(`x = `, x);
	if (x.type === "redirect" || x.id !== "new") return <Navigate to="/" />;

	const table = x.table;

	return <Draft table={table} />;
};

export default ObjectNew;
