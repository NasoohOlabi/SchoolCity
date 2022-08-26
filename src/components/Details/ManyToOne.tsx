/* This example requires Tailwind CSS v2.0+ */
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
// import { SelectorIcon } from "@heroicons/react/20/solid.SelectorIcon";
import { myCrud, OM, SchoolCityIDBTable } from "DB/schema";
import SchoolCityDBContext from "DB/SchoolCityDBContext";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "Language/t";
import { Fragment, useContext } from "react";
import TextAnimate from "../TextAnimate";

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export interface ManyToOneProps {
	many: SchoolCityIDBTable;
	one: SchoolCityIDBTable;
	selected?: IndexableType;
	disabled: boolean;
	setFk: (id: IndexableType) => void;
	filter?: (x: any) => boolean;
}

const ManyToOne: ({}: ManyToOneProps) => JSX.Element = ({
	one,
	disabled,
	many,
	selected: selectedPk,
	setFk,
	filter,
}) => {
	const db = useContext(SchoolCityDBContext);
	if (!db) return <p>{t(`Cann't Connect to Data Base`)}</p>;

	const all = useLiveQuery(() => myCrud.getAll(one, db), []) as any[];
	if (!all) return <p>loading...</p>;
	const f = filter && all.filter(filter);
	const viewAll = f || all || [];
	const selected =
		all.filter((x) => OM.identifier(x, one) === selectedPk)[0] || {};

	return (
		<Listbox
			value={selected}
			onChange={(evt) => {
				setFk(OM.identifier(evt, one));
			}}
			disabled={disabled}
		>
			{({ open }) => (
				<div className="w-96">
					<div className="mt-1 relative">
						<Listbox.Button
							disabled={disabled}
							className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						>
							<span className="flex items-center">
								{(selected.avatar || selected.name) &&
									(selected.avatar ? (
										<img
											src={selected.avatar}
											alt=""
											className="flex-shrink-0 h-6 w-6 rounded-full"
										/>
									) : (
										<div className="flex-shrink-0 h-6 w-6 rounded-full">
											<TextAnimate
												text={
													(OM.str(selected) !== undefined &&
														OM.str(selected).substring(0, 1)) ||
													""
												}
											/>
										</div>
									))}
								<span className="ml-3 block truncate">
									{selected.name || t(one)}
								</span>
							</span>
							<span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								{!disabled && <FontAwesomeIcon icon={faCaretDown} />}
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
								{viewAll.map((item) => (
									<Listbox.Option
										key={item.id}
										className={({ active }) =>
											classNames(
												active
													? "text-white bg-indigo-600"
													: "text-gray-900",
												"cursor-default select-none relative py-2 pl-3 pr-9"
											)
										}
										value={item}
									>
										{({ selected, active }) => (
											<>
												<div className="flex items-center">
													{item.avatar ? (
														<img
															src={item.avatar}
															alt=""
															className="flex-shrink-0 h-6 w-6 rounded-full"
														/>
													) : (
														<div className="flex-shrink-0 h-6 w-6 rounded-full">
															<TextAnimate
																text={OM.str(item).substring(
																	0,
																	1
																)}
															/>
														</div>
													)}
													<span
														className={classNames(
															selected
																? "font-semibold"
																: "font-normal",
															"ml-3 block truncate"
														)}
													>
														{item.name}
													</span>
												</div>

												{selected ? (
													<span
														className={classNames(
															active
																? "text-white"
																: "text-indigo-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<CheckIcon
															className="h-5 w-5"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</div>
			)}
		</Listbox>
	);
};

export default ManyToOne;
