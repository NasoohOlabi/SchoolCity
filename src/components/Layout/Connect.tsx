import { Button } from "@material-tailwind/react";
import { useGoogleLogin } from "@react-oauth/google";
import useStateCtx from "components/hooks/useStateCtx";

export interface ConnectProps {}
const SCOPE =
	"https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/spreadsheets https://mail.google.com/ https://www.googleapis.com/auth/contacts";
const Connect: ({}: ConnectProps) => JSX.Element = ({}) => {
	const [gapiUser, setGapiUser] = useStateCtx("gapiUser", "Connect");

	// console.log(`gapiUser = `, gapiUser);
	const login = useGoogleLogin({
		onSuccess: (response) => {
			console.log(`response = `, response);
			console.log(`gapi = `, gapi);
			setGapiUser(response);
			gapi.load("client", () => {
				console.log(`gapi.client = `, gapi.client);
				gapi.client.setToken({ access_token: response.access_token });
				// @ts-ignore
				window.schoolCityLoginModalOpen(false);
				// @ts-ignore
				window.scheduled.forEach((f) => {
					f();
				});
			});
		},
		scope: SCOPE,
		flow: "implicit",
	});
	return <Button onClick={() => login()}>Connect</Button>;
};

export default Connect;
// console.log(`response = `, response);
// console.log(
// 	// @ts-ignore
// 	`createFile(${response.access_token}) = `,
// 	// @ts-ignore
// 	createFile(response.access_token)
// );
// fetch("https://sheets.googleapis.com/v4/spreadsheets", {
// 	method: "POST",
// 	body: JSON.stringify({
// 		properties: {
// 			title: "fart face",
// 			// spreadsheetTheme: {
// 			//  object (SpreadsheetTheme)
// 			// },
// 		},
// 	}),
// })
// 	.then((res) => {
// 		console.log(`res = `, res);
// 		return res.json();
// 	})
// 	.then((json) => {
// 		console.log(`json = `, json);
// 	});

// discovery urls
// [
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "docs:v1",
// 		name: "docs",
// 		version: "v1",
// 		title: "Google Docs API",
// 		description: "Reads and writes Google Docs documents.",
// 		discoveryRestUrl:
// 			"https://docs.googleapis.com/$discovery/rest?version=v1",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/docs/",
// 		preferred: true,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "drive:v2",
// 		name: "drive",
// 		version: "v2",
// 		title: "Drive API",
// 		description:
// 			"Manages files in Drive including uploading, downloading, searching, detecting changes, and updating sharing permissions.",
// 		discoveryRestUrl:
// 			"https://www.googleapis.com/discovery/v1/apis/drive/v2/rest",
// 		discoveryLink: "./apis/drive/v2/rest",
// 		icons: {
// 			x16: "https://ssl.gstatic.com/docs/doclist/images/drive_icon_16.png",
// 			x32: "https://ssl.gstatic.com/docs/doclist/images/drive_icon_32.png",
// 		},
// 		documentationLink: "https://developers.google.com/drive/",
// 		preferred: false,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "drive:v3",
// 		name: "drive",
// 		version: "v3",
// 		title: "Drive API",
// 		description:
// 			"Manages files in Drive including uploading, downloading, searching, detecting changes, and updating sharing permissions.",
// 		discoveryRestUrl:
// 			"https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
// 		discoveryLink: "./apis/drive/v3/rest",
// 		icons: {
// 			x16: "https://ssl.gstatic.com/docs/doclist/images/drive_icon_16.png",
// 			x32: "https://ssl.gstatic.com/docs/doclist/images/drive_icon_32.png",
// 		},
// 		documentationLink: "https://developers.google.com/drive/",
// 		preferred: true,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "driveactivity:v2",
// 		name: "driveactivity",
// 		version: "v2",
// 		title: "Drive Activity API",
// 		description: "Provides a historical view of activity in Google Drive.",
// 		discoveryRestUrl:
// 			"https://driveactivity.googleapis.com/$discovery/rest?version=v2",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/drive/activity/",
// 		preferred: true,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "drivelabels:v2beta",
// 		name: "drivelabels",
// 		version: "v2beta",
// 		title: "Drive Labels API",
// 		description: "An API for managing Drive Labels",
// 		discoveryRestUrl:
// 			"https://drivelabels.googleapis.com/$discovery/rest?version=v2beta",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/drive/labels",
// 		preferred: false,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "drivelabels:v2",
// 		name: "drivelabels",
// 		version: "v2",
// 		title: "Drive Labels API",
// 		description: "An API for managing Drive Labels",
// 		discoveryRestUrl:
// 			"https://drivelabels.googleapis.com/$discovery/rest?version=v2",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/drive/labels",
// 		preferred: true,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "gmail:v1",
// 		name: "gmail",
// 		version: "v1",
// 		title: "Gmail API",
// 		description:
// 			"The Gmail API lets you view and manage Gmail mailbox data like threads, messages, and labels.",
// 		discoveryRestUrl:
// 			"https://gmail.googleapis.com/$discovery/rest?version=v1",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/gmail/api/",
// 		preferred: true,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "gmailpostmastertools:v1beta1",
// 		name: "gmailpostmastertools",
// 		version: "v1beta1",
// 		title: "Gmail Postmaster Tools API",
// 		description:
// 			"The Postmaster Tools API is a RESTful API that provides programmatic access to email traffic metrics (like spam reports, delivery errors etc) otherwise available through the Gmail Postmaster Tools UI currently.",
// 		discoveryRestUrl:
// 			"https://gmailpostmastertools.googleapis.com/$discovery/rest?version=v1beta1",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/gmail/postmaster",
// 		preferred: false,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "gmailpostmastertools:v1",
// 		name: "gmailpostmastertools",
// 		version: "v1",
// 		title: "Gmail Postmaster Tools API",
// 		description:
// 			"The Postmaster Tools API is a RESTful API that provides programmatic access to email traffic metrics (like spam reports, delivery errors etc) otherwise available through the Gmail Postmaster Tools UI currently.",
// 		discoveryRestUrl:
// 			"https://gmailpostmastertools.googleapis.com/$discovery/rest?version=v1",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/gmail/postmaster",
// 		preferred: true,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "people:v1",
// 		name: "people",
// 		version: "v1",
// 		title: "People API",
// 		description:
// 			"Provides access to information about profiles and contacts.",
// 		discoveryRestUrl:
// 			"https://people.googleapis.com/$discovery/rest?version=v1",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/people/",
// 		preferred: true,
// 	},
// 	{
// 		kind: "discovery#directoryItem",
// 		id: "sheets:v4",
// 		name: "sheets",
// 		version: "v4",
// 		title: "Google Sheets API",
// 		description: "Reads and writes Google Sheets.",
// 		discoveryRestUrl:
// 			"https://sheets.googleapis.com/$discovery/rest?version=v4",
// 		icons: {
// 			x16: "https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png",
// 			x32: "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png",
// 		},
// 		documentationLink: "https://developers.google.com/sheets/",
// 		preferred: true,
// 	},
// ];
