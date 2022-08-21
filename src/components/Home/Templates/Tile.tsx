import { Card, CardBody, Typography } from "@material-tailwind/react";
import { IndexableType } from "dexie";
import { Link } from "react-router-dom";

// const Tile: React.FC<ITemplate> = () => {
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

export interface ITitleInstance {
	id?: IndexableType;
	name: string;
	description: string;
}

export interface ITile {
	instance: ITitleInstance;
	link?: (instance: ITitleInstance) => string;
}

const Tile: ({ instance, link }: ITile) => JSX.Element = ({
	instance,
	link,
}) => {
	const { id, name, description } = instance;
	return (
		<Link to={`./${link ? link(instance) : id}`}>
			<Card className="w-32 h-40 cursor-pointer">
				{/* <CardHeader color="blue" className="relative h-1/2">
			</CardHeader> */}
				<img
					// src={getCurrentUser()?.photoURL || ""}
					alt="img-blur-shadow"
					className="h-1/2 w-full"
				/>
				<CardBody className="p-3 text-center h-1/2">
					<Typography variant="paragraph" className="">
						{name}
					</Typography>
					<Typography variant="small">{description}</Typography>
				</CardBody>
			</Card>
		</Link>
	);
};
export default Tile;
