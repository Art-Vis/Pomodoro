import { useState, useEffect, useRef, FC } from 'react';
import './CustomSelect.scss'; // Подключение стилей
import { CustomSelectProps, Option } from '../../../types/interface';

const CustomSelect: FC<CustomSelectProps> = ({ options, value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState(value);
	const selectRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleOptionClick = (option: Option) => {
		setSelectedValue(option.value);
		onChange(option.value);
		setIsOpen(false);
	};

	const toggleSelect = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className='custom-select' ref={selectRef}>
			<div className='custom-select__control' onClick={toggleSelect}>
				<div className='custom-select__value'>{selectedValue}</div>
				<div
					className={
						isOpen
							? 'custom-select__arrow custom-select__arrow-up'
							: 'custom-select__arrow'
					}
				></div>
			</div>
			{isOpen && (
				<div className='custom-select__options'>
					{options.map((option, index) => (
						<div
							key={index}
							className='custom-select__option'
							onClick={() => handleOptionClick(option)}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CustomSelect;
