import React from "react";

export interface TextAnimateProps {
	text: string;
}

function generate() {
	var hexValues = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"a",
		"b",
		"c",
		"d",
		"e",
	];

	function populate(a: any) {
		for (var i = 0; i < 6; i++) {
			var x = Math.round(Math.random() * 14);
			var y = hexValues[x];
			a += y;
		}
		return a;
	}

	var newColor1 = populate("#");
	var newColor2 = populate("#");
	var angle = Math.round(Math.random() * 360);

	return (
		"linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")"
	);
}

const TextAnimate: ({ text }: TextAnimateProps) => JSX.Element = ({ text }) => {
	const bg = generate();
	return (
		<div
			style={{ background: bg }}
			className="h-full w-full flex content-center justify-center items-center text-lime-100"
		>
			{text}
		</div>
	);
};

export default React.memo(TextAnimate, (p, np) => p.text === np.text);
