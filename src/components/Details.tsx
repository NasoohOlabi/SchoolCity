import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Card,
	CardFooter,
	IconButton,
	Input,
	Switch,
	Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import MySwitch from "./MySwitch";

interface DetailsProps {
	title: string;
	[index: string]: any;
}

const Details: React.FC<DetailsProps> = (obj) => {
	const { title } = obj;
	const [editing, setEditing] = useState(false);

	const myInput = (key: string, obj: DetailsProps) => {
		const type = typeof obj[key];
		switch (type) {
			case "string":
				return <Input label={key} disabled={!editing} value={obj[key]} />;
			case "boolean":
				return <MySwitch checked={obj[key]} />;
			default:
				return <p>Unsupported Type</p>;
		}
	};

	return (
		<div className="header-page-center-container">
			<Card className="header-page-center-container-card">
				<div className="flex pl-6 justify-between items-center ">
					<Typography variant="h1">{title}</Typography>
					<IconButton
						className="md:inline-flex h-20 w-20 rounded "
						onClick={() => setEditing(!editing)}
					>
						{/* <Icon name="menu" size="3xl" /> */}
						<FontAwesomeIcon icon={faPencil} />
					</IconButton>
				</div>
				{Object.keys(obj)
					.filter((key) => key !== "title")
					.map((key) => (
						<div className="flex m-4  content-center">
							<Typography
								className="flex justify-center items-center mr-4"
								variant="h6"
							>
								{key}
							</Typography>
							{myInput(key, obj)}
						</div>
					))}
				<CardFooter>
					<div className="flex justify-between items-center flex-row-reverse h-12">
						{editing && <Button>save</Button>}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Details;
