import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
} from "@material-tailwind/react";
import ConnectionBtn from "components/Layout/ConnectionBtn";
import { Fragment, useEffect, useState } from "react";

export default function Modal() {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(!open);

	useEffect(() => {
		// @ts-ignore
		window.schoolCityLoginModalOpen = setOpen;
	}, [open]);

	return (
		<Fragment>
			<Dialog open={open} handler={handleOpen}>
				<DialogHeader>Its a simple dialog.</DialogHeader>
				<DialogBody divider>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit.
					Accusamus ad reprehenderit omnis perspiciatis aut odit! Unde
					architecto perspiciatis, dolorum dolorem iure quia saepe autem
					accusamus eum praesentium magni corrupti explicabo!
				</DialogBody>
				<DialogFooter>
					<Button
						variant="text"
						color="red"
						onClick={handleOpen}
						className="mr-1"
					>
						<span>Cancel</span>
					</Button>
					<ConnectionBtn />
				</DialogFooter>
			</Dialog>
		</Fragment>
	);
}
