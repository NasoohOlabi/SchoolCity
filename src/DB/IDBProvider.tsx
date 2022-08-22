import { useEffect, useRef } from "react";
import { initializeDB } from "./schema";
import SchoolCityDBContext from "./SchoolCityDBContext";

const SchoolCityDBContextProvider: React.FC<{ children: any }> = ({
	children,
}) => {
	const db = useRef(initializeDB());

	useEffect(() => {
		// @ts-ignore
		window["db"] = db;
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
