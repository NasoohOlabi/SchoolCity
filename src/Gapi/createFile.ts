import { random } from "lodash";
export default function createFile(token: any) {
	const accessToken = token;
	// const accessToken = getCurrentUser()?.refreshToken
	const title = "hi " + random(100);
	fetch("https://docs.googleapis.com/v1/documents?title=" + title, {
		method: "POST",
		headers: new Headers({
			Authorization: "Bearer " + accessToken,
		}),
	})
		.then((response) => response.json())
		.then((val) => {
			console.log(`val = `, val);
			window.open(
				"https://docs.google.com/document/d/" + val.documentId + "/edit",
				"_blank"
			);
		});

	gapi.client.load("sheets", "v4", async () => {
		const ans = await gapi.client.sheets.spreadsheets.create({
			// @ts-ignore
			properties: {
				title: "hi 22",
			},
		});
		console.log(ans);
	});
}
