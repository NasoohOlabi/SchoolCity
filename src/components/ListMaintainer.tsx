import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ListMaintainerProps {
	lst: any[];
	setLst: (lst: any[]) => void;
	disabled?: boolean;
}

const ListMaintainer: React.FC<ListMaintainerProps> = ({
	lst,
	setLst,
	disabled = false,
}) => {
	return (
		<div className="shadow-inner m-2 p-2 grid grid-cols-3">
			{lst.map((x: any, x_ind: number) => (
				<span
					key={x_ind}
					className="flex justify-between items-center content-center shadow-md m-2 p-2"
				>
					{JSON.stringify(x)}
					{!disabled && (
						<FontAwesomeIcon
							className="cursor-pointer ml-4"
							icon={faClose}
							onClick={() => {
								if (!disabled)
									setLst(
										lst.filter((x: any, ind: number) => ind !== x_ind)
									);
							}}
						/>
					)}
				</span>
			))}
		</div>
	);
};

export default ListMaintainer;
