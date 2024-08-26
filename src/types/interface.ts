export interface TaskInterface {
	id: number;
	changeId: number;
	name: string;
	pomodoros: number;
	day: string;
}

export interface TaskProps {
	changeId: number;
	pomodoros: number;
	taskName: string;
	increase: () => void;
	minus: () => void;
	updateTask: (changeId: number, newTaskName: string) => void;
	removeTask: (changeId: number) => void;
}

export interface TimerProps {
	taskList?: TaskInterface[];
	pomodoros: number;
	taskName: string;
	id: number;
	removeTask: (taskId: number) => void;
}

export interface DataTasksProps {
	dataTasksArr: TaskInterface[];
}

export interface Option {
	label: string;
	value: string | number;
}

export interface CustomSelectProps {
	options: Option[];
	value: string | number;
	onChange: (value: string | number) => void;
}
