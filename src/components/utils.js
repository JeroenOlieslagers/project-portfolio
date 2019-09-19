/**
 * Analytically calculates the Normal distribution
 * @return {number}
 */
export function Gaussian(mu, sigma, x) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}


/**
 * Analytically calculates the Poisson distribution
 * @return {number}
 */
export function Poisson(lambda, x) {
  if (x < 0) {
    return 0
  }
  return (Math.pow(lambda, x) * Math.exp(-lambda)) / (factorial(x))
}

/**
 * Helper function to calculate the factorial of a number recursively
 * @return {number}
 */
function factorial(x) {
  if (x === 0) {
    return 1
  }
  else {
    return x*factorial(x-1);
  }
}

/**
 * Box-Muller transform on the uniform distribution from the built-in Math.random() method
 * @param mu - the mean of the distribution
 * @param sigma - the variance of the distribution
 * @return {number}
 */
export function BoxMuller(mu = 0, sigma = 1) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let z1 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z1 * sigma + mu;
}

/**
 * Inverse transform sampling on the formula e^-x to get a Poisson distribution
 * @return {number}
 */
export function InverseTransformSampling(lambda = 0) {
  if (lambda > 1000) {
    throw new Error('Value of Lambda too large')
  }
  let x = 0, p = Math.exp(-lambda), s = p, u = Math.random();
  while (s < u) {
    x++;
    p *= lambda / x;
    s += p;
  }
  return x;
}

/**
 * Converts data from generator to histogram
 */
export function createHistogram(data) {
  console.time('histogram');
  let hist = [];
  let max = 0;
  let keys = Object.keys(data[0]).slice(1, data.length);
  data.forEach(item => {
    keys.forEach(key => {
      if (Math.sign(item[key]) === -1) {
        if (Math.abs(item[key]) > max) {
          max = Math.abs(item[key])
        }
      }
      if (!hist[item[key]]) {
        hist[item[key]] = {};
        keys.forEach(others => {
          hist[item[key]][others] = 0;
        });
        hist[item[key]][key] = 1;
      }
      else {
        hist[item[key]][key] += 1;
      }
    });
  });
  // let negatives = hist.splice(hist.length - max + 1, max)
  console.timeEnd('histogram');
  console.log(max, hist);
  return hist;
}

/**
 * Converts linear scale to logarithmic scale
 * @param x
 * @returns {number}
 */
export function linToLog(x) {
  const y = Math.floor((x + Math.floor(x / 10)) / 10);
  return ((x + y) % 10) * Math.pow(10, y);
}

/**
 * Converts logarithmic scale to linear scale
 * @param x
 * @returns {number}
 */
export function logToLin(x) {
  const y = Math.floor(Math.log10(x === 0 ? 1 : x));
  return (y === 0 ? x : Math.round(x / Math.pow(10, y))) + y * 9;
}
