import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OM, SchoolCityIDBTable } from "DB/schema";
import { IndexableType } from "dexie";
import { Link, useParams } from "react-router-dom";

interface ListMaintainerProps {
	ids: IndexableType[];
	itemsTable: SchoolCityIDBTable;
	setLst: (ids: IndexableType[]) => void;
	disabled?: boolean;
	items?: any[];
}

const ListMaintainer: (args: ListMaintainerProps) => JSX.Element = ({
	ids,
	setLst,
	itemsTable,
	disabled = false,
	items,
}) => {
	const params = useParams();
	const selectedItems = items
		? items.filter((item) => ids.includes(item.id))
		: ids;
	return (
		<div className="shadow-inner m-2 p-2 ">
			{selectedItems.map((x: any, x_ind: number) => (
				<div key={x_ind} className="inline-block">
					<span className="flex justify-between items-center content-center shadow-md m-2 p-2">
						<Link
							to={`/app/school/${
								params.schoolName
							}/${itemsTable}/${OM.identifier(x, itemsTable)}`}
						>
							{OM.str(x)}
						</Link>
						{!disabled && (
							<FontAwesomeIcon
								className="cursor-pointer ml-4"
								icon={faClose}
								onClick={() => {
									if (!disabled)
										setLst(
											ids.filter(
												(y: any) =>
													OM.identifier(x, itemsTable) !== y
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
