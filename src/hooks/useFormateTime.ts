export const useFormateTime = (min: number): string => {
	const hours = Math.floor(min / 60);
	const minutes = min % 60;
	return min > 60 ? `${hours}ч ${minutes}м` : `${minutes} мин`;
};
