export default {} as typeof Worker & { new(): Worker };
import { Transposition, TranspositionInstruction } from "../Legacy/Interfaces/Interfaces";
import { fastForward, randomFiller } from "../Legacy/Logic/Logic";

console.log(`self = `, self);
self.addEventListener('message', (event) => {
	const week = ((week: string) => JSON.parse(week))(event.data);
	console.log(`week = `, week);
	const changeCellPost = (change: TranspositionInstruction) => {
		self.postMessage({ payload: change, type: "oneChange" })
	}
	const iterativeSolutionPoster = (changes: Transposition) => {
		self.postMessage({ payload: changes, type: "multipleChanges" })
	}
	randomFiller(week, changeCellPost);
	fastForward(week, iterativeSolutionPoster);
	// randomFiller(week);
	// fastForward(week);
	console.log(`posting Done`)
	self.postMessage({ payload: week, type: "Done" })
})