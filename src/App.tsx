import { Button } from "@material-tailwind/react";
import Modal from "components/modals/Modal";
import "./App.css";
import DriveSetup from "./Gapi/Drive/Setup";

function App() {
	return (
		<h1>
			<Button
				onClick={async () => {
					// const fileList =
					// 	(await gapi.client.drive) && gapi.client.drive.files.list();
					// console.log(`fileList = `, fileList);
					DriveSetup();
				}}
			>
				log files
			</Button>
			home
			{/* <Modal /> */}
		</h1>
	);
}

export default App;
