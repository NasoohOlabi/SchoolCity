import React from "react";

interface MySwitchProps {
	checked: boolean;
}

const MySwitch: React.FC<MySwitchProps> = ({ checked }) => {
	return (
		// <div className="flex justify-center">
		// 	<div className="form-check form-switch">
		// 		<label className="form-check-label inline-block text-gray-800">
		// 			Default switch checkbox input
		// 		</label>
		<input
			// className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
			className="form-check-input w-4 rounded-full focus:outline-none cursor-pointer shadow-sm"
			type="checkbox"
			// role="switch"
			id="flexSwitchCheckDefault"
		/>
		// 	</div>
		// </div>
	);
};

export default MySwitch;
