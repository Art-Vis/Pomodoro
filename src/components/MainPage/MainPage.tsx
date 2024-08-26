import './MainPage.scss';
import Timer from './Timer/Timer';
import Task from './Task/Task';
import { useEffect, useState } from 'react';
import { useFormateTime } from '../../hooks/useFormateTime';
import { TaskInterface } from '../../types/interface';
import { useGetDayOfWeek } from '../../hooks/useGetDayOfWeek';

const MainPage = ({
	addTaskChart,
	removeTaskChart,
}: {
	addTaskChart: (task: TaskInterface) => void;
	removeTaskChart: (taskId: number) => void;
}) => {
	const [tasksArr, setTasksArr] = useState<TaskInterface[]>(() => {
		const savedTasksArr = localStorage.getItem('dataTasks');
		return savedTasksArr ? JSON.parse(savedTasksArr) : [];
	});
	const [taskTime, setTaskTime] = useState(0);
	const [taskNumber] = useState(1);
	const [taskName, setTaskName] = useState('');
	const [name] = useState('');
	const [currentTask, setCurrentTask] = useState<TaskInterface | null>(null);

	useEffect(() => {
		localStorage.setItem('dataTasks', JSON.stringify(tasksArr));
	}, [tasksArr]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTaskName(event.target.value);
	};

	const addNewTask = () => {
		if (!taskName) {
			return;
		}
		const newTask = {
			id: tasksArr.length + 1,
			changeId: tasksArr.length + 1,
			name: taskName,
			pomodoros: 1,
			day: useGetDayOfWeek(),
		};
		const newTasks = [newTask, ...tasksArr];

		setTasksArr(newTasks);
		setTaskTime(taskTime + 25);
		setTaskName('');
		setCurrentTask(newTask);
		addTaskChart(newTask);
	};

	const increaseTaskPomodoros = (taskId: number): void => {
		const updatedTasksArr = tasksArr.map(task => {
			if (task.id === taskId) {
				return { ...task, pomodoros: task.pomodoros + 1 };
			}
			return task;
		});
		setTasksArr(updatedTasksArr);
	};

	const decreaseTaskPomodoros = (taskId: number): void => {
		const updatedTasksArr = tasksArr.map(task => {
			if (task.id === taskId && task.pomodoros > 1) {
				return { ...task, pomodoros: task.pomodoros - 1 };
			}
			return task;
		});
		setTasksArr(updatedTasksArr);
	};

	const updateTaskName = (taskId: number, newName: string) => {
		const updatedTasksArr = tasksArr.map(task => {
			if (task.id === taskId) {
				return { ...task, name: newName };
			}
			return task;
		});
		setTasksArr(updatedTasksArr);
	};

	const removeTask = (taskId: number): void => {
		const updatedTasksArr = tasksArr.filter(task => task.id !== taskId);
		setTasksArr(updatedTasksArr);
		removeTaskChart(taskId);
		if (currentTask && currentTask.id === taskId) {
			nextTask();
		}
	};

	const nextTask = () => {
		const nextTask = tasksArr.find(
			task => task.id !== (currentTask ? currentTask.id : null)
		);
		setCurrentTask(nextTask || null);
	};

	const timeTasksAll = tasksArr.map(({ pomodoros }) => pomodoros * 25);
	const totalTime = timeTasksAll.reduce((acc, curr) => acc + curr, 0);

	return (
		<main className='main'>
			<div className='container main__container'>
				<div className='main__wrap'>
					<h2 className='main__title'>Ура! Теперь можно начать работать:</h2>
					<ul className='main__list'>
						<li className='main__item'>
							Выберите категорию и напишите название текущей задачи
						</li>
						<li className='main__item'>Запустите таймер («помидор»)</li>
						<li className='main__item'>
							Работайте пока «помидор» не прозвонит
						</li>
						<li className='main__item'>
							Сделайте короткий перерыв (3-5 минут)
						</li>
						<li className='main__item'>
							Продолжайте работать «помидор» за «помидором», пока задача не
							будет выполнена. Каждые 4 «помидора» делайте длинный перерыв
							(15-30 минут).
						</li>
					</ul>
					<div className='main__wrap-bottom'>
						<input
							className='main__input'
							type='text'
							placeholder='Название задачи'
							value={taskName}
							onChange={handleInputChange}
						/>
						<button className='main__btn btn btn-green' onClick={addNewTask}>
							Добавить
						</button>
					</div>
					<div className='main__tasks'>
						{tasksArr.map(task => (
							<div key={task.id} onClick={() => setCurrentTask(task)}>
								<Task
									key={task.id}
									changeId={task.changeId}
									taskName={task.name}
									pomodoros={task.pomodoros}
									increase={() => increaseTaskPomodoros(task.id)}
									minus={() => decreaseTaskPomodoros(task.id)}
									removeTask={removeTask}
									updateTask={(taskId: number, newName: string) =>
										updateTaskName(taskId, newName)
									}
								/>
							</div>
						))}
					</div>
					{tasksArr.length >= 1 ? (
						<div className='main__times'>{useFormateTime(totalTime)}</div>
					) : (
						''
					)}
				</div>

				<div className='main__pomodoro'>
					{currentTask ? (
						<Timer
							key={tasksArr.length}
							taskList={tasksArr}
							pomodoros={currentTask.pomodoros}
							taskName={currentTask.name}
							id={currentTask.id}
							removeTask={removeTask}
						/>
					) : (
						<Timer
							pomodoros={taskNumber}
							taskName={name}
							id={0}
							removeTask={removeTask}
						/>
					)}
				</div>
			</div>
		</main>
	);
};

export default MainPage;
