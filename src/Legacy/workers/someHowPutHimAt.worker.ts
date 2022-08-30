declare const self: Worker;
export default {} as typeof Worker & { new(): Worker };
import { ISomeHowPutHimAtWorkerMsg } from "../Interfaces/Interfaces";
// (
//     m: number,
//     teacher: string,
//     pos: PosType,
//     week: Solver_Week,
//     freeze: boolean = true,
//     iterativeSolutionPoster?: (changes: Transposition) => void,
//     justOne: boolean = false
// )
self.addEventListener('message', (event) => {
    const args: ISomeHowPutHimAtWorkerMsg = event.data;

    // someHowPutHimAt(...args)


    console.log(`posting Done`)
    self.postMessage({ payload: args[3], type: "Done" })
})