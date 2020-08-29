import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import book_cover from '../images/book_cover.jpg';
import {CardMedia, Grid, Link, Paper, Typography} from '@material-ui/core';
import 'katex/dist/katex.min.css';
import CustomCard from '../components/CustomCard';
import {Code, Subject} from '@material-ui/icons';
import {InlineMath, BlockMath} from 'react-katex';
import Highlight from 'react-highlight.js';
import norm_approx from '../images/norm_approx.svg';
import perf1 from '../images/perf1.svg';
import perf2 from '../images/perf2.svg';

export default class NeurExt extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Grid container spacing={3} className={'stats__grid'}>
        <Grid item xs={12}>
          <Paper className={'stats__text'}>
            <Typography variant={'h4'} align={'center'} gutterBottom={true}>
              Extensions <br /> &nbsp;
            </Typography>
            <CustomCard title={'Question 1'} avatar={<Subject />} expanded={false}>
              <Grid container spacing={3} justify='center'>
                <Grid key={0} item className={'neur__questions__gridL'}>
                  <Typography  gutterBottom={true}>
                    The problem with the vectorised method specified in the main text is that we have to specify how many spikes we wish to calculate (which might lead to a final duration
                    lower or higher than the specified spike train duration <InlineMath>{'T'}</InlineMath>). To solve this issue, we could oversample and discard the samples
                    that lead to trains longer than <InlineMath>{'T'}</InlineMath>. The question is then by how much should we oversample so that we always have enough samples
                    to reach <InlineMath>{'T'}</InlineMath> but also minimising the number of samples for better computational efficiency. Since we are usually using Poisson
                    rates (<InlineMath>{'\\text{r}\\times T'}</InlineMath>) of above 100, we may approximate the Poisson by a Gaussian distribution and hence, if we oversample
                    by 3 standard deviations, we will get that 99.7% of trials will have enough samples to reach <InlineMath>{'T'}</InlineMath> and since this number depends
                    on the rate, it is a good lower bound. The standard deviation in this case is <InlineMath>{'\\sqrt{\\text{r}T}'}</InlineMath>.
                    <br/><br/>
                    To the right, we see that the distribution of spike train durations is shaped like a Gaussian when
                    <InlineMath>{'\\text{r} = 100'}</InlineMath> and <InlineMath>{'T=5'}</InlineMath> for
                    the vector method. <br />
                    The bottom left graph shows us the distribution of the spike train durations if we use the iterative method. This method is much
                    much slower (~30-50 times slower). <br />
                    Finally, the bottom right graph shows us the distribution if we use the vectorised method with oversampling of 3 standard deviations.
                    We see that this distribution is very similar to the one with the iterative method. The oversampling leads to a very small increasing in computing time (~0.01ms).
                  </Typography>
                  <CustomCard title={'Code'} avatar={<Code />} expanded={false}>
                    <Highlight language={'python'}>
                      {'def performance_experiment(r, T, n, oversample=True, iterative=False, bins=50):\n' +
                      '    """\n' +
                      '    Experiment that compares spike train duration distribution and computation time\n' +
                      '    """\n' +
                      '    tic = perf_counter()    # Performance timer\n' +
                      '    if iterative:\n' +
                      '        t = homogeneous_poisson_iterative(r, T, n=n)\n' +
                      '    else:\n' +
                      '        t = homogeneous_poisson(r, T, n=n, oversample=oversample)\n' +
                      '    toc = perf_counter()\n' +
                      '    print(\'Spike train generation (single train): \' + str(round((toc-tic)*1000/n, 5)) + \' ms\')  # Take average performance time\n' +
                      '    plt.hist([i[-1]for i in t], bins=bins, fill=None, ec=plt.rcParams[\'axes.prop_cycle\'].by_key()[\'color\'][0]) # Histogram of final spike time\n' +
                      '    plt.xlabel(\'Spike train duration (s)\')\n' +
                      '    plt.ylabel(\'Histogram count\')\n' +
                      '    plt.show()\n' +
                      '\n' +
                      'bins = np.linspace(9.92, 10, 51)\n' +
                      'print(\'No oversampling\')\n' +
                      'performance_experiment(100, 10, 100000, oversample=False)\n' +
                      'print(\'Iterative method \')\n' +
                      'performance_experiment(100, 10, 10000, iterative=True, bins=bins)\n' +
                      'print(\'Vectorised method with oversampling\')\n' +
                      'performance_experiment(100, 10, 10000, bins=bins)'}
                    </Highlight>
                  </CustomCard>
                  <Typography gutterBottom={true}>
                    <br/><br/>
                    To prove the forms of <InlineMath>{'\\text{p}_{\\tau}[\\tau]'}</InlineMath> (probability density of the ISI) and
                    <InlineMath>{'\\text{P}_N[n]'}</InlineMath> (probability of <InlineMath>{'n'}</InlineMath> spikes firing within the interval <InlineMath>{'T'}</InlineMath>),
                    we start with considering the probability of a spike firing within one of <InlineMath>{'M'}</InlineMath> small time bins <InlineMath>{'\\Delta t = \\frac{T}{M}'}</InlineMath>
                    (small enough so two spikes can never fall in the same bin). This probability is equal to <InlineMath>{'\\text{r}\\Delta t'}</InlineMath>
                    , the fraction of trials during which there was a spike within the given bin.
                    <br/>
                    The probability of <InlineMath>{'n'}</InlineMath> spikes firing within an interval <InlineMath>{'T'}</InlineMath> is the product
                    of the probability of generating <InlineMath>{'n'}</InlineMath> spikes within a given set of bins <InlineMath>{'(\\text{r}\\Delta t)^n'}</InlineMath>, the probability of generating no
                    spikes in the remaining bins <InlineMath>{'(1-\\text{r}\\Delta t)^{M-n}'}</InlineMath> and a combinatorial factor
                    <InlineMath>{'M \\choose n'}</InlineMath>. Taking the limit as the bin sizes go to zero, we get that:
                    <BlockMath>
                      {'\\text{P}_N[n]=\\lim_{\\Delta t\\to 0}\\frac{M!}{(M-n)!n!}(\\text{r}\\Delta t)^n(1-\\text{r}\\Delta t)^{M-n}'}
                    </BlockMath>
                    To evaluate this limit, we take the limit of the three parts separately. For the binomial coefficient, we note that <InlineMath>{'M'}</InlineMath> grows without
                    bound since <InlineMath>{'M = \\frac{T}{\\Delta t}'}</InlineMath>.This means that:
                    <BlockMath>
                      {'\\lim_{\\Delta t \\to 0}\\frac{M!}{(M-n)!} = \\lim_{\\Delta t \\to 0}M \\times (M-1) \\times\\dots\\times(M-n+1) = M^n'}
                    </BlockMath>
                    since <InlineMath>{'n'}</InlineMath> is constant and <InlineMath>{'M'}</InlineMath> tends towards infinity.
                    This result cancels with the second term since <InlineMath>{'\\Delta t^n \\propto \\frac{1}{M^n}'}</InlineMath>.
                    For the final term, we make the following substitution: <InlineMath>{'\\epsilon = -\\text{r}\\Delta t'}</InlineMath> from which we get:
                    <BlockMath>
                      {'\\lim_{\\Delta t \\to 0}(1-\\text{r}\\Delta t)^{M-n} = \\lim_{\\epsilon \\to 0}\\Big((1+\\epsilon)^{\\frac{1}{\\epsilon}}\\Big)^{-\\text{r}T} = e^{-\\text{r}T}'}
                    </BlockMath>
                    which follows from the definition that:
                    <BlockMath>
                      {'\\lim_{\\epsilon\\to 0}(1+\\epsilon)^{\\frac{1}{\\epsilon}}=e'}
                    </BlockMath>
                    Putting this together we get that:
                    <BlockMath>
                      {'\\text{P}_N[n] = \\frac{M^n}{n!}\\frac{(\\text{r}T)^n}{M^n}e^{-\\text{r}T}= \\frac{(\\text{r}T)^n}{n!}e^{-\\text{r}T} = \\text{Po}(n;\\lambda=\\text{r}T)'}
                    </BlockMath>
                    <br/><br/>
                    For the ISI, we note that the the probability of a spike being generated withing the interval <InlineMath>{'[\\tau, \\tau+\\Delta t]'}</InlineMath>
                    is the probability that no spike is fired over a time <InlineMath>{'\\tau'}</InlineMath> (<InlineMath>{'\\text{P}_N[0]=e^{-\\text{r}\\tau}'}</InlineMath>)
                    multiplied by the probability of a spike firing withing a small interval (<InlineMath>{'\\text{r}\\Delta t'}</InlineMath>).
                    To get the probability density, we just divide by <InlineMath>{'\\Delta t'}</InlineMath> to get:
                    <BlockMath>
                      {'\\text{p}_{\\tau}[\\tau] = \\text{r} e^{-\\text{r}\\tau} = \\text{Exp}\\Big(\\tau;\\lambda=\\frac{1}{\\text{r}}\\Big)'}
                    </BlockMath>
                  </Typography>
                </Grid>
                <Grid key={1} item className={'neur__questions__gridR'}>
                  <CardMedia image={norm_approx} className={'neur__questions__image'}/>
                  <Grid container spacing={0} justify='center'>
                    <Grid key={0} item className={'neur__questions__gridL'}>
                      <CardMedia image={perf1} className={'neur__questions__image'}/>
                    </Grid>
                    <Grid key={1} item className={'neur__questions__gridL'}>
                      <CardMedia image={perf2} className={'neur__questions__image'}/>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CustomCard>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
