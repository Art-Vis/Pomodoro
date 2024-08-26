export const useGetDayOfWeek = () => {
	const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
	const currentDate = new Date();
	const dayOfWeek = currentDate.getDay();
	return daysOfWeek[dayOfWeek];
};
