function getAvgLifeSpan(lifeSpan: string): number {
	const [min, max] = lifeSpan.split(" - ").map(Number);
  
	if (!isNaN(min) && !isNaN(max)) {
	  return (min + max) / 2;
	}
  
	if (!isNaN(min)) {
	  return min;
	}
  
	return 0;
  }


  export default getAvgLifeSpan;