import type { ITemplate } from "../../../Model/Types";

import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

// const TemplateTile: React.FC<ITemplate> = () => {
// 	return (
// 		// <Link to="./new">
// 		<div className="mb-4 mr-4 w-28 h-36 cursor-pointer shadow-m">
// 			<div className="h-1/2"></div>
// 			<div className="h-1/2">
// 				<img
// 					src=""
// 					alt="template preview"
// 					onError={(evt) => {
// 						evt.currentTarget.style.display = "none";
// 					}}
// 				/>
// 				<h3>{title}</h3>
// 				<h4>{description}</h4>
// 			</div>
// 		</div>
// 		// </Link>
// 	);
// };

const TemplateTile: React.FC<ITemplate> = ({ id, title, description }) => {
	return (
		<Link to="./new">
			<Card className="w-32 h-40 cursor-pointer">
				{/* <CardHeader color="blue" className="relative h-1/2">
			</CardHeader> */}
				<img
					src="/img/blog.jpg"
					alt="img-blur-shadow"
					className="h-1/2 w-full"
				/>
				<CardBody className="p-3 text-center h-1/2">
					<Typography variant="paragraph" className="">
						{title}
					</Typography>
					<Typography variant="small">{description}</Typography>
				</CardBody>
			</Card>
		</Link>
	);
};
export default TemplateTile;
