import { lazy } from "react";

type DynamicRouteElement =
	| "App"
	| "WeekView"
	| "Login"
	| "ObjectHome"
	| "ObjectInfo"
	| "ObjectNew";

const DynamicRoutes = (route: DynamicRouteElement) => {
	switch (route) {
		case "Login":
			return lazy(() => import("../Pages/Login"));
		case "App":
			return lazy(() => import("../App"));
		case "WeekView":
			return lazy(() => import("../Legacy/Components/WeekView"));
		case "ObjectHome":
			return lazy(() => import("../Pages/School/ObjectHome"));
		case "ObjectInfo":
			return lazy(() => import("../Pages/School/ObjectInfo"));
		case "ObjectNew":
			return lazy(() => import("../Pages/School/ObjectNew"));
	}
};

export default DynamicRoutes;

export const DynamicLogin = lazy(() => import("../Pages/Login"));
export const DynamicApp = lazy(() => import("../App"));
export const DynamicWeekView = lazy(
	() => import("../Legacy/Components/WeekView")
);
export const DynamicObjectHome = lazy(
	() => import("../Pages/School/ObjectHome")
);
export const DynamicObjectInfo = lazy(
	() => import("../Pages/School/ObjectInfo")
);
export const DynamicObjectNew = lazy(() => import("../Pages/School/ObjectNew"));
