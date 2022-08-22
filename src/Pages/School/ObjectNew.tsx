import Draft from "components/Draft";
import { Navigate } from "react-router-dom";
import useTableUrl from "./useTableUrl";

interface ObjectNewProps {}

const ObjectNew: React.FC<ObjectNewProps> = ({}) => {
	const x = useTableUrl(2);
	if (x.type === "redirect") return <Navigate to="/" />;

	const table = x.table;

	return <Draft table={table} />;
};

export default ObjectNew;
