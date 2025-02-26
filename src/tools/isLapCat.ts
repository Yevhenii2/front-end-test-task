const isLapCat = (affectionLevel: number, energy_level: number): boolean => {
	return affectionLevel >= 4 && energy_level < 4;
};

export default isLapCat;