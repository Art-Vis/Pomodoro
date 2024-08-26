import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import { Suspense, lazy, useEffect, useState } from 'react';
import HeaderPage from './components/HeaderPage/HeaderPage';
import { TaskInterface } from './types/interface';

const LazyMainPage = lazy(() => import('./components/MainPage/MainPage'));
const LazyStatisticsPage = lazy(
	() => import('./components/StatisticsPage/StatisticsPage')
);

function App() {
	const [dataTasksArr, setDataTasksArr] = useState<TaskInterface[]>(() => {
		const savedTasksArr = localStorage.getItem('dataTasks');
		return savedTasksArr ? JSON.parse(savedTasksArr) : [];
	});

	useEffect(() => {
		localStorage.getItem('dataTasks');
	}, [dataTasksArr]);

	const addTaskChart = (task: TaskInterface) => {
		setDataTasksArr(prevTasks => [...prevTasks, task]);
	};

	const removeTaskChart = (taskId: number) => {
		const newTasks = dataTasksArr.filter(task => task.id !== taskId);
		setDataTasksArr(newTasks);
	};

	return (
		<BrowserRouter>
			<Suspense>
				<HeaderPage />

				<Routes>
					<Route
						path='/'
						element={
							<LazyMainPage
								addTaskChart={addTaskChart}
								removeTaskChart={removeTaskChart}
							/>
						}
					/>
					<Route
						path='/statistics'
						element={<LazyStatisticsPage dataTasksArr={dataTasksArr} />}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
