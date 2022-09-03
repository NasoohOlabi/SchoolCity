import { SchoolCityIDB } from "./schema";
import SchoolCityDBContext from "./SchoolCityDBContext";

const SchoolCityDBContextProvider: (args: { children: any }) => JSX.Element = ({
	children,
}) => {
	return (
		// @ts-ignore
		<SchoolCityDBContext.Provider value={window["db"] as SchoolCityIDB}>
			{children}
		</SchoolCityDBContext.Provider>
	);
};

export default SchoolCityDBContextProvider;
