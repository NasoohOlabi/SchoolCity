export default {} as typeof Worker & { new(): Worker };
import { Transposition } from "../Legacy/Interfaces/Interfaces";
import { fastForward } from "../Legacy/Logic/Logic";

console.log(`worker: Initiated.`)
self.addEventListener('message', (event) => {
	console.log(`worker: request received.`)
	const week = ((week: string) => JSON.parse(week))(event.data);
	// const changeCellPost = (change: TranspositionInstruction) => {
	// 	console.log(`posting one change `, change)
	// 	self.postMessage({ payload: change, type: "oneChange" })
	// }
	const iterativeSolutionPoster = (changes: Transposition) => {
		console.log(`posting multiple changes `, changes)
		self.postMessage({ payload: changes, type: "multipleChanges" })
	}
	// randomFiller(week, changeCellPost);

	console.log(`worker: going in iterativeSolutionPoster.`)
	fastForward(week, iterativeSolutionPoster);
	console.log(`worker: going out iterativeSolutionPoster.`)
	// randomFiller(week);
	// fastForward(week);
	console.log(`posting...`)
	self.postMessage({ payload: week, type: "Done" })
	console.log(`posting Done`)
})