import { myCrud } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useLiveQuery } from "dexie-react-hooks";
import useTitle from "Model/View/Layout/useTitle";
import { useContext, useEffect, useState } from "react";

interface GradeNewProps {}

const GradeNew: React.FC<GradeNewProps> = ({}) => {
	useTitle("New Grade");
	const db = useContext(SchoolCityDBContext);
	let [lst, setLst] = useState([] as any);
	useLiveQuery(async () => {
		if (db) setLst(await myCrud.getAll("grade", db));
	}, []);
	useEffect(() => {
		// db && myCrud.add(["grade"], db, new Grade(1, "class 1", [], 1));
		// db && myCrud.delete(["grade"], db, 2);
	}, []);
	// return <Details title="Add a New Grade" />;
	return (
		<ul>
			{lst.map((x: any) => (
				<li key={x.id}>{JSON.stringify(x)}</li>
			))}
		</ul>
	);
};

export default GradeNew;
