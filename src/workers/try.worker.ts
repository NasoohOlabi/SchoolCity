export default {} as typeof Worker & { new(): Worker };

// Your code ...
// Respond to message from parent thread
self.onmessage = (ev) => {
	let message: string = ev.data;
	console.log(message);

	for (let word of ['badWords']) {
		message = message.replace(new RegExp(word, "gi"), "*".repeat(word.length));
	}
	self.postMessage(message);
};
