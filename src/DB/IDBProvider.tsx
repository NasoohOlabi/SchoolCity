import { useEffect, useRef } from "react";
import { initalizeDB } from "./schema";
import SchoolCityDBContext from "./SchoolCityDBContext";

const SchoolCityDBContextProvider: React.FC<{ children: any }> = ({
	children,
}) => {
	const db = useRef(initalizeDB());

	useEffect(() => {
		return () => {
			db.current.close();
		};
	}, []);

	return (
		<SchoolCityDBContext.Provider value={db.current}>
			{children}
		</SchoolCityDBContext.Provider>
	);
};

export default SchoolCityDBContextProvider;
