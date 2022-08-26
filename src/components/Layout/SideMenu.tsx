import { Typography } from "@material-tailwind/react";
import useStateCtx from "components/hooks/useStateCtx";
import { Link } from "react-router-dom";
import { getPathParamsOutsideRoutes } from "Routes/util";

interface SideMenuProps {}

const SideMenu: (args: SideMenuProps) => JSX.Element = ({}) => {
	const basePath = "app/school/" + getPathParamsOutsideRoutes()?.schoolName;
	// const r = useRerender();
	const [sidebarExpanded, setSidebarExpanded] = useStateCtx(
		"sidebarExpanded",
		"sidemenu"
	);

	const items = [
		{ text: "Schools", path: "app/school" },
		{ text: "Schedule", path: basePath + "/schedule" },
		{ text: "Grades", path: basePath + "/grade" },
		{ text: "Sections", path: basePath + "/section" },
		{ text: "Marks", path: basePath + "/mark" },
	];

	return (
		sidebarExpanded && (
			<div
				className={`w-screen h-screen absolute top-0 z-50 p-0 ${
					sidebarExpanded ? "block" : "hidden"
				}`}
				onClick={() => {
					console.log("side bar should close");
					setSidebarExpanded(false);
				}}
			>
				<aside className="w-60 h-full shadow-md bg-white m-0 absolute top-0 z-50">
					<div className="m-4">
						<Typography variant="h3">School City</Typography>
						<Typography variant="h5">AlOlabi</Typography>
					</div>
					<ul className="relative">
						{items.map((item, index) => (
							<li className="relative" key={index}>
								<Link
									className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
									to={item.path}
									data-mdb-ripple="true"
									data-mdb-ripple-color="dark"
								>
									{item.text}
								</Link>
							</li>
						))}
					</ul>
				</aside>
			</div>
		)
	);
};

export default SideMenu;
