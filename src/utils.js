/**
 * Analytically calculates Normal distribution
 * @return {number}
 */
export function Gaussian(mu, sigma, x) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

/**
 * Converts data from generator to histogram
 */
export function createHistogram(data) {
  console.time('histogram');
  let hist = [];
  let keys = Object.keys(data[0]).slice(1, data.length);
  data.forEach((item) => {
    keys.forEach((key) => {
      if (!hist[item[key]]) {
        hist[item[key]] = {};
        keys.forEach((others) => {
          hist[item[key]][others] = 0;
        });
        hist[item[key]][key] = 1;
      }
      else {
        hist[item[key]][key] += 1;
      }
    })
  });
  console.timeEnd('histogram');
  return hist;
}
