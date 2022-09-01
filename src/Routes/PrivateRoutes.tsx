import type { School } from "DB/schema";
import { myCrud } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

interface IPrivateRoutes {
	redirectPath: string;
	isAllowed: boolean | (() => boolean);
	checkSchoolName?: boolean;
}

// TODO: consult https://medium.com/front-end-weekly/how-to-create-private-route-with-react-router-v6-fa4b9d74cb55

const PrivateRoutes: (args: IPrivateRoutes) => JSX.Element = ({
	isAllowed,
	redirectPath,
	checkSchoolName = false,
}) => {
	const db = useContext(SchoolCityDBContext);
	const params = useParams();
	const [schoolRedirect, setSchoolRedirect] = useState<boolean>(false);
	const [schoolRedirectLoading, setSchoolRedirectLoading] =
		useState<boolean>(true);

	useEffect(() => {
		// declare the data fetching function
		const fetchData = async () => {
			if (params["schoolName"]) {
				const school =
					db &&
					((await myCrud.get(
						"school",
						db,
						params["schoolName"]
					)) as School);
				if (school && school.name) {
					setSchoolRedirectLoading(false);
					setSchoolRedirect(false);
					return;
				}
			}
			setSchoolRedirectLoading(false);
			setSchoolRedirect(true);
		};

		if (checkSchoolName) {
			// call the function
			fetchData()
				// make sure to catch any error
				.catch(console.error);
		}
	}, [schoolRedirect, schoolRedirectLoading]);
	// if (!db) return <p>Loading...</p>;
	
	const isAuthenticated =
		(typeof isAllowed === "boolean" && isAllowed === true) ||
		(typeof isAllowed === "function" && isAllowed() === true);

	if (isAuthenticated && checkSchoolName) {
		if (schoolRedirectLoading) return <p>loading...</p>;
		else {
			if (schoolRedirect) return <Navigate to={redirectPath} />;
			else return <Outlet />;
		}
	}

	return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default PrivateRoutes;
