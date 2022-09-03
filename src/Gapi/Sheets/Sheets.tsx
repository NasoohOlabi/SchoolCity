import type { Mark, SchoolCityIDB, Section, Subject } from "DB/schema";

export default async function Sheets(mark: Mark) {
	if (!gapi || !gapi.client) {
		// @ts-ignore
		window.schoolCityLoginModalOpen(true);
		// @ts-ignore
		window.scheduled = (window.scheduled && [
			// @ts-ignore
			...window.scheduled,
			() => Sheets(mark),
		]) || [() => Sheets(mark)];
		return;
	}
	// @ts-ignore
	const db: SchoolCityIDB = window.db;

	if (mark.sheetId !== null) {
		const URL = `https://docs.google.com/spreadsheets/d/${mark.sheetId}/`;
		window.open(URL, "_blank");
	} else {
		const subject = (await db.subject.get(mark.subjectId)) as Subject;
		const section = (await db.section.get(mark.sectionId)) as Section;

		var spreadsheetBody = {
			// TODO: Add desired properties to the request body.
			properties: {
				title: `${section.name}'s ${subject.name} marks`,
			},
		};

		gapi.client.load("sheets", "v4", async () => {
			var request = gapi.client.sheets.spreadsheets.create(
				{},
				spreadsheetBody
			);
			request.then(
				function (response) {
					// TODO: Change code below to process the `response` object:
					// console.log(response.result);
					mark.sheetId = response.result.spreadsheetId;
					db.mark.update(mark.id, {
						sheetId: response.result.spreadsheetId,
					});
					const URL = `https://docs.google.com/spreadsheets/d/${mark.sheetId}/`;
					window.open(URL, "_blank");
				},
				function (reason) {
					console.error("error: " + reason.result.error.message);
				}
			);
		});
	}
}
