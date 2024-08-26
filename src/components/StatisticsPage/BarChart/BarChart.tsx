import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { DataTasksProps } from '../../../types/interface';
import { FC } from 'react';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const BarChart: FC<DataTasksProps> = ({ dataTasksArr }) => {
	const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
	const dayPomodoros = weekDays.map(day => {
		const tasksForDay = dataTasksArr.filter(task => task.day === day);
		const totalPomodoros = tasksForDay.reduce(
			(sum, task) => sum + task.pomodoros,
			0
		);
		return totalPomodoros * 25;
	});

	const data = {
		labels: weekDays,
		datasets: [
			{
				label: 'Время работы',
				data: dayPomodoros,
				backgroundColor: '#DC3E22',
			},
		],
	};

	const yLabels = [
		'25 мин',
		'50 мин',
		'1 ч 15 мин',
		'1 ч 40 мин',
		'2 ч 5 мин',
		'2 ч 30 мин',
	];

	const options: ChartOptions<'bar'> = {
		responsive: true,
		plugins: {},
		scales: {
			y: {
				position: 'right',
				ticks: {
					callback: function (value: any) {
						const index = [25, 50, 75, 100, 125, 150].indexOf(value);
						return yLabels[index];
					},
					stepSize: 25,
				},
				beginAtZero: true,
			},
		},
	};

	return (
		<div className='statistics__bar-chart'>
			<Bar data={data} options={options} />
		</div>
	);
};

export default BarChart;
