/**
 * Helper function to generate random data according to a Gaussian distribution
 * This is achieved by using the Box-Muller transform on the uniform distribution from the built-in Math.random() method
 * @param mu - the mean of the distribution
 * @param sigma - the variance of the distribution
 * @return {number}
 */
function Normal(mu = 0, sigma = 1) {
  let u = 0,
    v = 0,
    z1 = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  z1 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z1 * sigma + mu;
}

/**
 * Function to generate data object to use in amcharts4 charts
 * @param timeRange - how many days the data should be displayed for (tail)
 * @param countries - specifies which countries to include if independent is countries
 * @param rules - rules to be applied to entire data set:
 *        - max, sets column with values not to be exceeded, must be a column before 'fitToMax'
 *        - fitToMax, ensures column does not exceed column with rule 'max'
 *        - positive, ensure all data is positive (caps to zero)
 *        - percent, ensures all data is between 0-100 (only on column-3)
 *        - uniform, applies Math.random() to get uniform distribution
 * @param variance_divisor - lower value means the data will vary more
 * @param slope - value between -0.5 and 0.5, the higher the more upward the graph will slope (higher values will also
 * mean less variance)
 * @param isStatic - if set, data will not accumulate
 * @param independent - name for the independent variable
 *        - date, sets x-axis to be a dateSeries
 *        - ID, sets x-axis to be a numerical series
 *        - countries, sets x-axis to be a category axis with countries specified in the countries parameter
 * @param dependent - list of dependent variables with properties
 *        - name, specifies name of variable
 *        - typical, specifies the base value around which the data should vary
 *        - rules, specific rules for this data series
 * @returns {Array}
 */
function generateChartData({
  timeRange = undefined,
  countries = undefined,
  rules = ['positive'],
  variance_divisor = 15,
  slope = 0.1,
  isStatic = false,
  independent = 'date',
  dependent = [
    {
      name: 'column-1',
      typical: 200,
      rules: ['fitting', 'positive']
    },
    {name: 'column-2', typical: 50, rules: ['']}
  ]
} = {}) {
  //Initialising
  let chartData = [];
  let startingDataPoint = {};
  let fittingValue = 0;
  if (independent === 'date') {
    let firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - (timeRange ? timeRange : 100));
    startingDataPoint['date'] = firstDate;
  } else if (independent === 'ID') {
    startingDataPoint['ID'] = 1;
  } else if (independent === 'country') {
    if (countries) {
      startingDataPoint['id'] = countries[0];
    } else {
      throw new Error('Countries parameter needs to be defined');
    }
  }
  //Set initial independent variables around typical
  dependent.forEach((item, index) => {
    startingDataPoint[item.name] = Math.round(
      Normal(item.typical, item.typical / variance_divisor) /
        (timeRange ? (timeRange > 1 ? 1 : 24) : 1)
    );
  });
  let prevDataPoint = startingDataPoint;
  //Loop through time range or 100 data points if unspecified
  for (
    let i = 0;
    i < (countries ? countries.length : timeRange ? (timeRange > 1 ? timeRange : 24) : 100);
    i++
  ) {
    let newDataPoint = {};
    //Add independent variable
    if (independent === 'date' && timeRange !== 1) {
      let newDate = new Date();
      newDate.setDate(startingDataPoint.date.getDate() + i);
      newDataPoint['date'] = newDate;
    } else if (independent === 'date' && timeRange === 1) {
      let newDate = new Date();
      newDate.setHours(startingDataPoint.date.getHours() + i);
      newDataPoint['date'] = newDate;
    } else if (independent === 'ID') {
      newDataPoint['ID'] = startingDataPoint.ID + i;
    } else if (independent === 'country') {
      newDataPoint['id'] = countries[i];
    } else {
      throw new Error('Independent variable not valid');
    }
    //Add dependent variable
    dependent.forEach((item, index) => {
      //Add new random data to previous data point
      newDataPoint[item.name] = isStatic
        ? Math.round(Normal(item.typical, item.typical / variance_divisor))
        : prevDataPoint[item.name] +
          Math.round(
            (Math.random() < 0.5 + slope ? 1 : -1) *
              Normal(item.typical / variance_divisor, item.typical / variance_divisor)
          );
      if (
        (rules.includes('positive') ||
          rules.includes('percent') ||
          item.rules.includes('positive') ||
          item.rules.includes('percent')) &&
        newDataPoint[item.name] < 0
      ) {
        newDataPoint[item.name] = 0;
      }
      if (
        (rules.includes('percent') || item.rules.includes('percent')) &&
        newDataPoint[item.name] > 100
      ) {
        newDataPoint[item.name] = 100;
      }
      if (item.rules.includes('fitsToMax') && newDataPoint[item.name] > fittingValue) {
        newDataPoint[item.name] = fittingValue;
      }
      if (item.rules.includes('max')) {
        fittingValue = newDataPoint[item.name];
      }
      if (item.rules.includes('uniform')) {
        newDataPoint[item.name] = Math.round(
          Math.random() * (6 * (item.typical / variance_divisor)) +
            (item.typical - 3 * (item.typical / variance_divisor))
        );
      }
    });

    prevDataPoint = newDataPoint;
    chartData.push(newDataPoint);
  }
  return chartData;
}

export default generateChartData;
