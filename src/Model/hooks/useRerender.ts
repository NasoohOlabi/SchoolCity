import { useState } from "react";

const useRerender = () => {
	const [b, setB] = useState(false)

	return () => {
		setB(!b)
	}
}

export default useRerender;