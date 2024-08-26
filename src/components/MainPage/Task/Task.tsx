import { TaskProps } from '../../../types/interface';
import './Task.scss';
import { useEffect, useRef, useState } from 'react';

const Task = ({
	changeId,
	pomodoros,
	taskName,
	increase,
	minus,
	updateTask,
	removeTask,
}: TaskProps) => {
	const [isDeleteVisible, setIsDeleteVisible] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isDel] = useState(false);
	const [newTaskName, setNewTaskName] = useState(taskName);
	const menuRef = useRef<HTMLDivElement>(null);
	const deleteRef = useRef<HTMLDivElement>(null);

	const handleMenuClick = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleEditClick = () => {
		setIsMenuOpen(true);
		setIsEditing(true);
	};

	const handleDeleteClick = () => {
		setIsDeleteVisible(true);
		setIsMenuOpen(false);
	};

	const handleConfirmDelete = () => {
		setIsDeleteVisible(false);
		setIsMenuOpen(false);
		removeTask(changeId);
	};

	const handleCancelDelete = () => {
		setIsDeleteVisible(false);
	};

	const handleSaveClick = () => {
		setIsMenuOpen(false);
		setIsEditing(false);
		setNewTaskName(newTaskName);
		updateTask(changeId, newTaskName);
	};

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewTaskName(event.target.value);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				(menuRef.current && !menuRef.current.contains(event.target as Node)) ||
				(deleteRef.current && !deleteRef.current.contains(event.target as Node))
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<>
			{isDeleteVisible && (
				<div className='delete'>
					<div className='delete-confirmation' ref={deleteRef}>
						<p className='delete-title'>Удалить задачу?</p>
						<button className='delete-btn' onClick={handleConfirmDelete}>
							Удалить
						</button>
						<button className='delete-cancel-btn' onClick={handleCancelDelete}>
							Отмена
						</button>
					</div>
				</div>
			)}
			{!isDel ? (
				<div className={`task`}>
					<div className='task__wrap'>
						<span className='task__number'>{pomodoros}</span>
						{isMenuOpen && isEditing ? (
							<input
								type='text'
								value={newTaskName}
								onChange={handleChangeName}
								autoFocus
							/>
						) : (
							<span className='task__name'>{newTaskName}</span>
						)}
					</div>
					<div className='task__menu' onClick={handleMenuClick}>
						<svg width='26' height='6'>
							<use xlinkHref='/public/icons.svg#svg-dots'></use>
						</svg>
					</div>
					{isMenuOpen && (
						<div className='task__menu-options' ref={menuRef}>
							<button onClick={increase}>
								<svg width='18' height='18'>
									<use xlinkHref='/public/icons.svg#menu-plus'></use>
								</svg>
								Увеличить
							</button>
							<button onClick={minus}>
								<svg width='18' height='18'>
									<use xlinkHref='/public/icons.svg#menu-minus'></use>
								</svg>
								Уменьшить
							</button>
							{isEditing ? (
								<button onClick={handleSaveClick}>
									<svg width='18' height='18'>
										<use xlinkHref='/public/icons.svg#menu-edit'></use>
									</svg>
									Сохранить
								</button>
							) : (
								<button onClick={handleEditClick}>
									<svg width='18' height='18'>
										<use xlinkHref='/public/icons.svg#menu-edit'></use>
									</svg>
									Редактировать
								</button>
							)}
							<button onClick={handleDeleteClick}>
								<svg width='18' height='18'>
									<use xlinkHref='/public/icons.svg#menu-delete'></use>
								</svg>
								Удалить
							</button>
						</div>
					)}
				</div>
			) : (
				''
			)}
		</>
	);
};

export default Task;
