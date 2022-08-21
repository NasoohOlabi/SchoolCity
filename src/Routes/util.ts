import { matchPath, useLocation } from "react-router-dom";

export const getPathParamsOutsideRoutes = () => {
	return matchPath(
		{ path: "/school/:schoolName/*" },
		useLocation().pathname
	)?.params;
}