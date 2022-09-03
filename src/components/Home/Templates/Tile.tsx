import { Card, CardBody, Typography } from "@material-tailwind/react";
import TextAnimate from "components/TextAnimate";
import { OM, SchoolCityIDBTable } from "DB/schema";
import { IndexableType } from "dexie";
import { Link } from "react-router-dom";

export interface ITitleInstance {
	id?: IndexableType;
	name: string;
	description: string;
	photo?: any;
}

export interface ITile {
	instance: ITitleInstance;
	table?: SchoolCityIDBTable;
	size?: "l" | "m" | "s";
	blank?: boolean;
}

const Tile: ({ instance }: ITile) => JSX.Element = ({
	instance,
	table,
	size = "m",
	blank = false,
}) => {
	const { id, name, description, photo } = instance;
	const sizeClasses =
		size === "l"
			? " w-48 h-60 "
			: size === "m"
			? " w-32 h-40 "
			: " w-16 h-20 ";
	//   document.getElementById("container").style.background = gradient;
	return (
		<Link to={`./${blank ? "new" : OM.identifier(instance, table)}`}>
			<Card className={sizeClasses + " cursor-pointer overflow-hidden"}>
				{/* <CardHeader color="blue" className="relative h-1/2">
			</CardHeader> */}
				{photo ? (
					<img
						// src={getCurrentUser()?.photoURL || ""}
						alt="img-blur-shadow"
						className="h-1/2 w-full"
					/>
				) : (
					<div className="h-1/2 w-full">
						<TextAnimate text={name} />
					</div>
				)}
				<CardBody className="p-3 text-center h-1/2">
					<Typography variant="paragraph" className="">
						{name || ""}
					</Typography>
					<Typography variant="small">{description || ""}</Typography>
				</CardBody>
			</Card>
		</Link>
	);
};
export default Tile;
