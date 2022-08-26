import { Button } from "@material-tailwind/react";
import { googleLogout } from "@react-oauth/google";

export interface DisconnectProps {}

const Disconnect: ({}: DisconnectProps) => JSX.Element = ({}) => {
	const click = () => {
		googleLogout();
		console.log(`Logout worked`);
	};
	return <Button onClick={click}>Disconnect</Button>;
};

export default Disconnect;
