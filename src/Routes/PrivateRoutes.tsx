import { Navigate, Outlet } from "react-router-dom";

interface IPrivateRoutes {
	redirectPath: string;
	isAllowed: boolean | (() => boolean);
}

// TODO: consult https://medium.com/front-end-weekly/how-to-create-private-route-with-react-router-v6-fa4b9d74cb55

const PrivateRoutes: (args: IPrivateRoutes) => JSX.Element = ({
	isAllowed,
	redirectPath,
}) => {
	const isAuthenticated =
		(typeof isAllowed === "boolean" && isAllowed === true) ||
		(typeof isAllowed === "function" && isAllowed() === true);
	return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default PrivateRoutes;
