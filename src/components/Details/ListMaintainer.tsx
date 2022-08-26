import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ListMaintainerProps {
	lst: any[];
	setLst: (lst: any[]) => void;
	disabled?: boolean;
	items?: any[];
}

const ListMaintainer: (args: ListMaintainerProps) => JSX.Element = ({
	lst,
	setLst,
	disabled = false,
	items,
}) => {
	const selectedItems = items
		? items.filter((item) => lst.includes(item.id))
		: lst;
	return (
		<div className="shadow-inner m-2 p-2 ">
			{selectedItems.map((x: any, x_ind: number) => (
				<div key={x_ind} className="inline-block">
					<span className="flex justify-between items-center content-center shadow-md m-2 p-2">
						{x.name || x.id || JSON.stringify(x)}
						{!disabled && (
							<FontAwesomeIcon
								className="cursor-pointer ml-4"
								icon={faClose}
								onClick={() => {
									if (!disabled)
										setLst(
											lst.filter(
												(x: any, ind: number) => ind !== x_ind
											)
										);
								}}
							/>
						)}
					</span>
				</div>
			))}
		</div>
	);
};

export default ListMaintainer;
