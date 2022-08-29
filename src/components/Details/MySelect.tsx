import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import TextAnimate from "components/TextAnimate";
import { OM } from "DB/schema";
import { IndexableType } from "dexie";
import { t } from "Language/t";
import { Fragment, useEffect, useState } from "react";

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}
export type MySelectItem = { id: IndexableType; name: string; avatar: string };
export interface MySelectProps {
	onChange: (evt: string | MySelectItem) => void;
	defaultValue: MySelectItem | string;
	disabled: boolean;
	noIcon: boolean;
	kind: string;
	options: MySelectItem[] | string[];
	onMouseOver?: (evt: any) => void;
	padding?: "minimal" | "normal";
	border?: "normal" | "none";
}

const MySelect: ({}: MySelectProps) => JSX.Element = ({
	disabled,
	onChange,
	defaultValue,
	noIcon,
	kind,
	options,
	onMouseOver,
	padding = "normal",
	border = "normal",
}) => {
	const [usedValue, setUsedValue] = useState(defaultValue);
	const pClass = padding === "minimal" ? "py-1 pr-5 " : "";
	const bClass =
		border === "none" ? "border-b" : "border border-gray-300 shadow-sm";
	if (typeof options[0] === "string")
		options = [...new Set<string>(options as string[])];
	useEffect(() => {
		setUsedValue(defaultValue);
	}, [usedValue, defaultValue]);
	return (
		<Listbox
			value={usedValue}
			onChange={(evt) => {
				setUsedValue(evt);
				onChange(evt);
			}}
			disabled={disabled}
		>
			{({ open }) => (
				<div className="w-full h-10" onMouseOver={onMouseOver}>
					<div className="mt- relative h-full">
						<Listbox.Button
							disabled={disabled}
							className={`${pClass} relative w-full bg-white ${bClass} rounded-md  text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-full`}
						>
							<span className="flex items-center">
								{!noIcon &&
									typeof usedValue !== "string" &&
									(usedValue.avatar || usedValue.name) &&
									(usedValue.avatar ? (
										<img
											src={usedValue.avatar}
											alt=""
											className="flex-shrink-0 h-6 w-6 rounded-full"
										/>
									) : (
										<div className="flex-shrink-0 h-6 w-6 rounded-full">
											<TextAnimate
												text={
													(OM.str(usedValue) !== undefined &&
														OM.str(usedValue).substring(0, 1)) ||
													""
												}
											/>
										</div>
									))}
								<span className="ml-1.5  md:ml-3 block truncate">
									{typeof usedValue === "string"
										? usedValue
										: usedValue.name || t(kind)}
								</span>
							</span>
							<span className="ml-1.5  md:ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
								{typeof options[0] === "string"
									? (options as string[]).map(
											(item: string, index) => (
												<Listbox.Option
													key={index}
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
																<span
																	className={classNames(
																		selected
																			? "font-semibold"
																			: "font-normal",
																		"ml-1.5  md:ml-3 block truncate"
																	)}
																>
																	{item}
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
											)
									  )
									: (options as MySelectItem[]).map((item, index) => (
											<Listbox.Option
												key={
													typeof item.id === "number"
														? item.id
														: index
												}
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
															{!noIcon && item.avatar ? (
																<img
																	src={item.avatar}
																	alt=""
																	className="flex-shrink-0 h-6 w-6 rounded-full"
																/>
															) : (
																<div className="flex-shrink-0 h-6 w-6 rounded-full">
																	<TextAnimate
																		text={OM.str(
																			item
																		).substring(0, 1)}
																	/>
																</div>
															)}
															<span
																className={classNames(
																	selected
																		? "font-semibold"
																		: "font-normal",
																	"ml-1.5  md:ml-3 block truncate"
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

export default MySelect;
