import { Administrator } from "DB/schema";

type FolderTree = { name: string, children: FolderTree[] }


// const tree: FolderTree = {
// 	name: 'working root final'
// 	, children: [
// 		{ name: 'c1', children: [] },
// 		{
// 			name: 'c2', children: [
// 				{ name: 'c22', children: [] }
// 			]
// 		}]
// }
function mkdir({ name, children }: FolderTree, parent?: string) {
	const body: any = {
		// @ts-ignore
		mimeType: "application/vnd.google-apps.folder",
		name,
	}
	if (parent)
		body.parents = [parent]
	// TODO: check if file exist
	gapi.client.drive.files.create(body).then(file => {
		children.forEach((child) => {
			if (file.result.id)
				mkdir(child, file.result.id)
			else
				mkdir(child, parent)
		})
	})
}


let administrationTree: Administrator[] = []

export default function DriveSetup() {
	gapi.client.load('drive', 'v3', async () => {

		const aTf = (a: Administrator): FolderTree => { return { name: a.divisionName || a.name, children: a.subordinates.map(aTf) } }

		// create root folder for owner access
		const tree: FolderTree = {
			name: 'SchoolCity Root'
			, children: [
				{
					// create HR folder for owner access
					name: 'SchoolCity HR'
					, children: [
						{
							name: 'SchoolCity Teachers'
							, children: [

							]
						},
						{
							name: 'SchoolCity Administrators'
							, children: [

							]
						},
						{
							name: 'SchoolCity Staff'
							, children: [

							]
						}
					],
					...administrationTree.map(aTf)
				}
			]
		}

		mkdir(tree)
		// console.log(s)
	})
}

// yarn add -D  @types/gapi.client.sheets@v4 @types/gapi.client.drive@v3  @types/gapi.client.people@v1 @types/gapi.client.gmail@v1 @types/gapi.client.docs@v1