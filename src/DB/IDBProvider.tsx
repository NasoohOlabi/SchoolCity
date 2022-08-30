import { useRef } from "react";
import { initializeDB } from "./schema";
import SchoolCityDBContext from "./SchoolCityDBContext";

const SchoolCityDBContextProvider: (args: { children: any }) => JSX.Element = ({
	children,
}) => {
	const db = useRef(initializeDB());
	return (
		<SchoolCityDBContext.Provider value={db.current}>
			{children}
		</SchoolCityDBContext.Provider>
	);
};

export default SchoolCityDBContextProvider;
