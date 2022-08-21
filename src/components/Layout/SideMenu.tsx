import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getPathParamsOutsideRoutes } from "Routes/util";
import ctx from "../../ViewModel/ViewModelStore";

interface SideMenuProps {}

const SideMenu: React.FC<SideMenuProps> = ({}) => {
	const basePath = "school/" + getPathParamsOutsideRoutes()?.schoolName;
	const [SidebarExpanded, setSidebarExpanded] =
		useContext(ctx).sidebarExpanded;
	const dispatch = useDispatch();
	const items = [
		{ text: "Schedule", path: basePath + "/schedule" },
		{ text: "Grades", path: basePath + "/grade" },
		{ text: "Sections", path: basePath + "/section" },
		{ text: "Marks", path: basePath + "/mark" },
	];

	return (
		<div
			className={`w-screen h-screen absolute top-0 z-50 p-0 ${
				SidebarExpanded ? "block" : "hidden"
			}`}
			onClick={() => {
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
	);
};

export default SideMenu;
