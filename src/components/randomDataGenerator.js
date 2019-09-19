import {BoxMuller, InverseTransformSampling} from './utils';

/**
 * Function to generate data object to use in amcharts4 charts
 * @param samples - how many samples should be displayed
 * @param countries - specifies which countries to include if independent is countries
 * @param rules - global rules applied to all data:
 *        - positive, ensure all data is positive (caps to zero)
 * @param slope - value between -0.5 and 0.5, the higher the more upward the graph will slope if isStatic is set to
 *                false (higher values will also mean less variance)
 * @param isStatic - if set, data will not accumulate
 * @param independent - name for the independent variable
 *        - date, sets x-axis to be a dateSeries
 *        - id, sets x-axis to be a numerical series
 *        - countries, sets x-axis to be a category axis with countries specified in the countries parameter (map chart)
 * @param dependent - list of dependent variables with properties
 *        - name, specifies name of variable
 *        - mean, specifies the mean value around which the data should vary
 *        - stDev, specifies standard deviation to indicate variance of data
 *        - rules, specific rules for this data series:
 *                -- positive, ensure all data is positive (caps to zero)
 *                -- uniform, applies Math.random() to get uniform distribution
 *                -- poisson, generated data using Poisson distribution (mean is the value for lambda)
 * @returns {Array}
 */
function generateChartData({
  samples = 100,
  countries = undefined,
  rules = [],
  slope = 0.1,
  isStatic = true,
  independent = 'id',
  dependent = [
    {
      name: 'column-1',
      mean: 200,
      stDev: 20,
      rules: ['']
    },
    {
      name: 'column-2',
      mean: 50,
      stDev: 5,
      rules: ['']
    }
  ]
} = {}) {
  //Initialising
  let chartData = [];
  let startingDataPoint = {};
  //Sets initial date for data charts
  if (independent === 'date') {
    let firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - samples);
    startingDataPoint['date'] = firstDate;
  }
  //Initialised normal x-axis values
  else if (independent === 'id') {
    startingDataPoint['id'] = 1;
  }
  //Sets up country data for map chart
  else if (independent === 'country') {
    if (countries) {
      startingDataPoint['id'] = countries[0];
    } else {
      throw new Error('Countries parameter needs to be defined');
    }
  }
  //Set initial independent variables
  dependent.forEach((item, index) => {
    startingDataPoint[item.name] = Math.round(
      BoxMuller(item.mean, item.stDev)
    );
  });
  let prevDataPoint = startingDataPoint;
  let newDataPoint = {};
  //Loop through time range or 100 data points if unspecified
  for (let i = 0; i < (countries ? countries.length : samples); i++) {
    newDataPoint = {};
    //Add independent variable
    switch(independent) {
      case 'date':
        let newDate = new Date();
        newDate.setDate(startingDataPoint.date.getDate() + i);
        newDataPoint['date'] = newDate;
        break;
      case 'id':
        newDataPoint['id'] = startingDataPoint.id + i;
        break;
      case 'country':
        newDataPoint['id'] = countries[i];
        break;
      default:
        throw new Error('Independent variable not valid');
    }
    //Add dependent variables
    dependent.forEach((item, index) => {
      if (item.rules.includes('uniform')) {
        newDataPoint[item.name] = Math.round(
          Math.random() * (6 * (item.stDev)) +
          (item.mean - 3 * (item.stDev))
        );
      }
      else if (item.rules.includes('poisson')) {
        newDataPoint[item.name] = Math.round(InverseTransformSampling(item.mean));
      }
      else {
        newDataPoint[item.name] = Math.round(BoxMuller(item.mean, item.stDev));
      }
      if ((rules.includes('positive') || item.rules.includes('positive')) &&
          newDataPoint[item.name] < 0) {
        newDataPoint[item.name] = 0;
      }
      if (!isStatic) {
        newDataPoint[item.name] = prevDataPoint[item.name] +
          Math.round((Math.random() < 0.5 + slope ? 1 : -1) * newDataPoint[item.name]);
        prevDataPoint = newDataPoint;
      }
    });
    chartData.push(newDataPoint);
  }
  return chartData;
}

export default generateChartData;
