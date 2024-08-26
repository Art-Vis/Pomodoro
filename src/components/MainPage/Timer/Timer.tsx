import { useEffect, useState } from 'react';
import './Timer.scss';
import { TimerProps } from '../../../types/interface';
import { useMinInSec } from '../../../hooks/useMinInSec';

const Timer = ({
	taskList = [],
	pomodoros,
	taskName,
	id,
	removeTask,
}: TimerProps) => {
	const [time, setTime] = useState(0);
	const [pauseCount, setPauseCount] = useState(0);
	const [timerRunning, setTimerRunning] = useState(false);
	const [isBreak, setIsBreak] = useState(false);
	const [isBreakCompleted, setIsBreakCompleted] = useState(false);
	const [workMin, setWorkMin] = useState(25);
	const [currentTime, setCurrentTime] = useState(`${workMin}:00`);
	const [audio] = useState(new Audio('./public/gong.mp3'));
	const [audioPlaying, setAudioPlaying] = useState(false);
	const [pomodoroCount, setPomodoroCount] = useState(0);

	const SHORT_BREAK_MIN = 5;
	const LONG_BREAK_MIN = 15;
	const MAX_POMODOROS_REPEAT = 4;

	useEffect(() => {
		let timer: number;
		if (timerRunning) {
			timer = setInterval(() => {
				if (time > 0) {
					setTime(prevValue => prevValue - 1);
					const minutes = Math.floor(time / 60);
					const seconds = time % 60;
					setCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
				} else {
					clearInterval(timer);
					setTimerRunning(false);
					setAudioPlaying(true);
					if (!isBreak) {
						if ((pomodoroCount + 1) % MAX_POMODOROS_REPEAT === 0) {
							startBreak(LONG_BREAK_MIN);
						} else {
							startBreak(SHORT_BREAK_MIN);
						}
					} else {
						setIsBreakCompleted(true);
						setIsBreak(false);
						resetTimer();
					}
				}
			}, 1000);
		}

		return () => clearInterval(timer);
	}, [timerRunning, time, pomodoroCount, isBreak]);

	useEffect(() => {
		if (audioPlaying) {
			audio.currentTime = 0;
			audio.play();
			setAudioPlaying(false);
		}
	}, [audioPlaying, audio]);

	const startBreak = (breakMin: number) => {
		setIsBreak(true);
		setIsBreakCompleted(false);
		setTime(breakMin * 60);
		setPomodoroCount(prevCount => prevCount + 1);
	};

	const handleStartStop = () => {
		if (timerRunning) {
			setTimerRunning(false);
			setPauseCount(pauseCount + 1);

			const pauseCountString = JSON.stringify(pauseCount);
			localStorage.setItem('pause', pauseCountString);

			const pauseDuration = workMin * 60 - time;
			localStorage.setItem('pauseTime', JSON.stringify(pauseDuration));
		} else {
			if (time === 0) {
				setTime(workMin * 60);
			}
			setTimerRunning(true);
			setIsBreak(false);
			setIsBreakCompleted(false);
		}
	};

	const handleStop = () => {
		setTimerRunning(false);
		removeTask(id);
		resetTimer();
	};

	const resetTimer = () => {
		setTime(workMin * 60);
		setCurrentTime(`${workMin}:00`);

		if (pomodoroCount === pomodoros) {
			removeTask(id);
		}
	};

	const handleStartBreak = () => {
		setTimerRunning(true);
		setIsBreakCompleted(false);
		setIsBreak(true);
	};

	const plusTime = () => {
		const newMin = workMin + 5;
		if (newMin <= 60 && !timerRunning) {
			setWorkMin(newMin);
			useMinInSec(newMin * 60);
			setTime(newMin * 60);
			const minutes = Math.floor(newMin);
			setCurrentTime(`${minutes}:00`);
		} else {
			return;
		}
	};

	const minusTime = () => {
		const newMin = workMin - 5;
		if (newMin >= 5 && !timerRunning) {
			setWorkMin(newMin);
			useMinInSec(newMin);
			setTime(newMin * 60);
			const minutes = Math.floor(newMin);
			setCurrentTime(`${minutes}:00`);
		} else {
			return;
		}
	};

	return (
		<>
			<div className={`pomodoro-top ${timerRunning ? 'red' : ''}`}>
				{taskList.length >= 1 ? <h3>{taskName}</h3> : <h3>Название задачи</h3>}
				{taskList.length >= 1 ? (
					<span>Помидор {pomodoros}</span>
				) : (
					<span>Помидор</span>
				)}
			</div>
			<div className='pomodoro'>
				<span className={`pomodoro__timer ${timerRunning ? 'red-timer' : ''}`}>
					{currentTime}
				</span>
				<div>
					{taskList.length >= 1 ? (
						<div>
							Пройдено помодоров {pomodoroCount} / {pomodoros}
						</div>
					) : (
						''
					)}
				</div>
				<button
					className='pomodoro__plus'
					onClick={plusTime}
					disabled={taskList.length >= 1 ? false : true}
				>
					<svg width='50' height='50'>
						<use xlinkHref='/public/icons.svg#timer-plus'></use>
					</svg>
				</button>
				<button
					className='pomodoro__minus'
					onClick={minusTime}
					disabled={taskList.length >= 1 ? false : true}
				>
					<svg width='50' height='50'>
						<use xlinkHref='/public/icons.svg#timer-minus'></use>
					</svg>
				</button>
				{taskList.length >= 1 ? (
					<p className='pomodoro__descr'>
						Задача {id} - <span>{taskName}</span>
					</p>
				) : (
					''
				)}
				<div className='pomodoro__btns'>
					{isBreak && !isBreakCompleted ? (
						<>
							<button
								className='pomodoro__btn-start btn btn-green'
								onClick={handleStartBreak}
							>
								Начать перерыв
							</button>
							<button
								className='pomodoro__btn-stop btn btn-red'
								onClick={handleStop}
								disabled={taskList.length === 0}
							>
								Стоп
							</button>
						</>
					) : (
						<>
							<button
								className='pomodoro__btn-start btn btn-green'
								onClick={handleStartStop}
								disabled={taskList.length === 0}
							>
								{timerRunning ? 'Пауза' : 'Старт'}
							</button>
							<button
								className='pomodoro__btn-stop btn btn-red'
								onClick={handleStop}
								disabled={taskList.length === 0}
							>
								Стоп
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Timer;
