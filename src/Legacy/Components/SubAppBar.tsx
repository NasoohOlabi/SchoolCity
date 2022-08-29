// import Card from "@mui/material/Card";
// import Card from "@mui/material/Card";
// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@material-tailwind/react";
import { texts } from "./UiText";

//import { Banner, StaticBanner } from 'material-ui-banner';
/*
export function InstallBanner() : JSX.Element {
    return (
        <StaticBanner/>
    );
}
*/

// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		root: {
// 			flexGrow: 1,
// 		},
// 		menuButton: {
// 			marginRight: theme.spacing(0),
// 		},
// 		menuIcon: {
// 			marginRight: theme.spacing(0),
// 		},
// 		title: {
// 			marginLeft: theme.spacing(-1),
// 			flexGrow: 1,
// 		},
// 	})
// );

export default function MyCard(props: { Solve: () => void }): JSX.Element {
	// const classes = useStyles();

	return (
		<div className="flex flex-row p-3 justify-between  items-center px-4 py-2 z-30 shadow-md bg-blue-50">
			<IconButton className="inline">
				<FontAwesomeIcon icon={faArrowLeft} />
			</IconButton>

			<Button
				onClick={props.Solve}
				// color="inherit"
				className="w-fit  inline"
			>
				{texts.Solve}
			</Button>
		</div>
	);
}
//<Brightness5Icon />
