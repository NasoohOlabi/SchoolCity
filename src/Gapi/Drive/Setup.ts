import { Administrator } from "DB/schema"

type FolderTree = { name: string, children: FolderTree[] }

async function fileExists(name: string, parentId?: string): Promise<[boolean, gapi.client.drive.File?]> {
	const body = { q: `name = '${name}'` }
	if (parentId)
		body.q = `'${parentId}' in parents and ` + body.q
	const response = await gapi.client.drive.files.list(
		// { q: "'1c0mnL-kjtxfXkTinXIU0oDvSpXJrJyR_' in parents and name = 'data5'" }
		body
	)
	return [
		(response.result.files && response.result.files.length > 0) || false
		, (response.result.files && response.result.files[0]) || undefined
	]
}


async function InitializeDriveSpace({ name, children }: FolderTree, parent?: string) {
	const body: any = {
		// @ts-ignore
		mimeType: "application/vnd.google-apps.folder",
		name,
	}
	if (parent)
		body.parents = [parent]
	// TODO: check if file exist
	const [exist, file] = await fileExists(name, parent)
	if (exist && file) {
		children.forEach((child) => {
			if (file.id)
				InitializeDriveSpace(child, file.id)
			else
				console.error(`couldn't create file `, { name, children }, ' because ', file)
		})
	}
	else
		gapi.client.drive.files.create(body).then(file => {
			children.forEach((child) => {
				if (file.result.id)
					InitializeDriveSpace(child, file.result.id)
				else
					console.error(`couldn't create file `, { name, children }, ' because ', file)
			})
		})
}

export default function DriveSetup() {
	gapi.client.load('drive', 'v3', async () => {

		const aTf = (a: Administrator): FolderTree => { return { name: a.divisionName || a.name, children: a.subordinates.map(aTf) } }

		// create root folder for owner access
		const tree = {
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
					]
				}
			]
		}

		InitializeDriveSpace(tree)
		// console.log(s)
	})
}
// yarn add -D  @types/gapi.client.sheets@v4 @types/gapi.client.drive@v3  @types/gapi.client.people@v1 @types/gapi.client.gmail@v1 @types/gapi.client.docs@v1
