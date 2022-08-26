import useStateCtx from "components/hooks/useStateCtx";
import Connect from "./Connect";
import Disconnect from "./Disconnect";

export interface ConnectionBtnProps {}

const ConnectionBtn: ({}: ConnectionBtnProps) => JSX.Element = ({}) => {
	const [gapiUser, _] = useStateCtx("gapiUser", "ConnectionBtn");
	console.log(`gapiUser = `, gapiUser);
	return !!gapiUser ? <Disconnect /> : <Connect />;
};

export default ConnectionBtn;
