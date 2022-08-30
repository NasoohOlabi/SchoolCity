export default {} as typeof Worker & { new(): Worker };
import { Transposition } from "../Legacy/Interfaces/Interfaces";
import { fastForward } from "../Legacy/Logic/Logic";

console.log(`worker: Initiated.`)
self.addEventListener('message', (event) => {
	console.log(`worker: request received.`)
	const week = ((week: string) => JSON.parse(week))(event.data);
	const iterativeSolutionPoster = (changes: Transposition) => {
		self.postMessage({ payload: changes, type: "multipleChanges" })
	}

	fastForward(week, iterativeSolutionPoster);

	console.log(`posting Done`)
	self.postMessage({ payload: week, type: "Done" })
})