import { FC, useState } from 'react';
import BarChart from './BarChart/BarChart';
import './StatisticsPage.scss';
import CustomSelect from './CustomSelect/CustomSelect';
import { DataTasksProps } from '../../types/interface';
import { useFormateTime } from '../../hooks/useFormateTime';

const StatisticsPage: FC<DataTasksProps> = ({ dataTasksArr }) => {
	const [selectedOption, setSelectedOption] = useState('Эта неделя');
	const options = ['Эта неделя', 'Прошедшая неделя', '2 недели назад'];

	const totalPomodoros = dataTasksArr.reduce((acc, task) => {
		return acc + task.pomodoros;
	}, 0);

	const totalTimePomodoros = totalPomodoros * 25;

	const pauseTime = Number(localStorage.getItem('pauseTime') || '0');

	const pauseCount = Number(localStorage.getItem('pause') || '0');

	const focusPercent = (): string => {
		const totalTime = totalTimePomodoros + pauseTime;
		return totalTime > 0
			? Math.round((totalTimePomodoros / totalTime) * 100) + '%'
			: '0%';
	};

	return (
		<div className='statistics statistics__container'>
			<div className='statistics__wrap'>
				<h1 className='statistics__title'>Ваша активность</h1>
				<CustomSelect
					options={options}
					value={selectedOption}
					onChange={setSelectedOption}
				/>
			</div>
			<div className='statistics__all'>
				<div className='statistics__info'>
					<div className='statistics__day statistics__day--time'>
						<h2 className='statistics__day-title'>Понедельник</h2>
						<p className='statistics__day-descr'>
							Вы работали над задачами в течении{' '}
							<span className='statistics__orange'>
								{useFormateTime(totalTimePomodoros)}
							</span>
						</p>
					</div>
					<div className='statistics__pomodoro statistics__pomodoro--quantity'>
						<div className='statistics__pomodoro-wrap'>
							<img
								className='statistics__pomodoro-img'
								src='./tomato.png'
							></img>
							<span className='statistics__pomodoro-number'>
								x {totalPomodoros}
							</span>
						</div>
						<div className='statistics__pomodoro-bottom'>
							<span className='statistics__pomodoro-pieces'>
								{totalPomodoros} помидора
							</span>
						</div>
					</div>
				</div>

				<BarChart dataTasksArr={dataTasksArr} />
			</div>
			<div className='statistics__details-info'>
				<div className='statistics__focus statistics__card'>
					<h3 className='statistics__details-title'>Фокус</h3>
					<span className='statistics__details-descr'>{focusPercent()}</span>
				</div>
				<div className='statistics__pause statistics__card'>
					<h3 className='statistics__details-title'>Время на паузе</h3>
					<span className='statistics__details-descr'>
						{useFormateTime(pauseTime)}
					</span>
				</div>
				<div className='statistics__stop statistics__card'>
					<h3 className='statistics__details-title'>Остановки</h3>
					<span className='statistics__details-descr'>{pauseCount}</span>
				</div>
			</div>
		</div>
	);
};

export default StatisticsPage;
