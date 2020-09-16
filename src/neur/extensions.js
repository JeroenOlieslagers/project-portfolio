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
import method_of_moments from '../images/method_of_moments.svg';
import mean_fit from '../images/mean_fit.svg';
import var_fit from '../images/var_fit.svg';
import fano_window_refr from '../images/fano_window_refr.svg';

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
            <CustomCard title={'Question 2'} avatar={<Subject />} expanded={false}>
              <Grid container spacing={3} justify='center'>
                <Grid key={0} item className={'neur__questions__gridL'}>
                  <Typography  gutterBottom={true}>
                    It has been suggested that a gamma distribution of the form:
                    <BlockMath>
                      {'\\text{p}_{\\tau}[\\tau] = \\frac{\\text{r}(\\text{r}\\tau)^ke^{-\\text{r}\\tau}}{k!} = \\text{Gamma}(k+1, \\text{r})'}
                    </BlockMath>
                    desribes these distributions. The question now is how <InlineMath>{'k'}</InlineMath> depends on <InlineMath>{'\\tau_{\\text{ref}}'}</InlineMath>. To answer this question, we will find
                    the analytic mean and variance of this function and then fit this to the experimental results.
                    <BlockMath>
                      {'\\begin{aligned}\n' +
                      '\\langle\\tau\\rangle &= \\int^{\\infty}_0 \\tau \\frac{\\text{r}(\\text{r}\\tau)^ke^{-\\text{r}\\tau}}{k!} \\text{d}\\tau = \\frac{\\Gamma(k+2)}{\\text{r}k!} = \\frac{k+1}{\\text{r}}\\\\\n' +
                      '\\sigma_{\\tau}^2 &= \\int^{\\infty}_0 \\tau^2 \\frac{\\text{r}(\\text{r}\\tau)^ke^{-\\text{r}\\tau}}{k!} \\text{d}\\tau - \\langle\\tau\\rangle^2 = \\frac{\\Gamma(k+3)}{\\text{r}^2k!} - \\langle\\tau\\rangle^2\\\\\n' +
                      '&= \\frac{(k+2)(k+1)}{\\text{r}^2} -  \\frac{(k+1)^2}{\\text{r}^2} = \\frac{k+1}{\\text{r}^2}\\\\\n' +
                      'C_V &= \\frac{\\sigma_{\\tau}}{\\langle\\tau\\rangle}=\\frac{1}{\\sqrt{k+1}}\n' +
                      '\\end{aligned}'}
                    </BlockMath>
                    We can plot <InlineMath>{'\\text{r}\\langle\\tau\\rangle - 1'}</InlineMath> and <InlineMath>{'\\text{r}^2\\sigma_{\\tau}^2 - 1'}</InlineMath>
                    &nbsp;against <InlineMath>{'\\tau_{\\text{ref}}'}</InlineMath> and see whether the curves line up to determine a relationship between
                    &nbsp;<InlineMath>{'k'}</InlineMath> and <InlineMath>{'\\tau_{\\text{ref}}'}</InlineMath>.
                    In our case, we see that the curves have different forms: the variance seems to follow a linear trend, and the mean a combination
                    of a linear and decaying exponential. An interesting feature is that they intersect at around
                    &nbsp;<InlineMath>{'\\tau_{\\text{ref}}=38'}</InlineMath>ms. This suggests that our assumption about the model only depending on one latent variable
                    &nbsp;(<InlineMath>{'k'}</InlineMath>) is likely wrong. This method of parameter estimation is a variant of the method of moments.
                  </Typography>
                  <CustomCard title={'Code'} avatar={<Code />} expanded={false}>
                    <Highlight language={'python'}>
                      {'def mean_fit(x):\n' +
                      '    """\n' +
                      '    Function that fits tau_ref to k fitted on the mean of the ISIs\n' +
                      '    """\n' +
                      '    A = 2.29\n' +
                      '    B = 0.0252\n' +
                      '    C = 0.0116\n' +
                      '    return A*(1-np.exp(-B*x)) + C*x\n' +
                      '\n' +
                      '\n' +
                      'def var_fit(x):\n' +
                      '    """\n' +
                      '    Function that fits tau_ref to k fitted on the variance of the ISIs\n' +
                      '    """\n' +
                      '    A = 0.05\n' +
                      '    return A*x\n' +
                      '\n' +
                      '\n' +
                      'means = []\n' +
                      'variances = []\n' +
                      'cvs = []\n' +
                      'taus = np.linspace(1, 100, 100)\n' +
                      'for tau in taus:\n' +
                      '    t = refractory_homogeneous_poisson(100, 10, tau/1000, 30)\n' +
                      '    means.append(np.mean(to_isi(t, join=True))*100 - 1)\n' +
                      '    variances.append(np.var(to_isi(t, join=True))*10000 - 1)\n' +
                      '\n' +
                      'plt.scatter(taus, means, label=r\'$\\displaystyle\\text{r}\\langle\\tau\\rangle - 1$\', marker=\'.\')\n' +
                      'plt.scatter(taus, variances, label=r\'$\\displaystyle\\text{r}^2\\sigma_{\\tau}^2 - 1$\', marker=\'.\')\n' +
                      'plt.plot(taus, mean_fit(taus), label=\'Mean fit\', c=\'r\')\n' +
                      'plt.plot(taus, var_fit(taus), label=\'Var fit\', c=\'b\')\n' +
                      'plt.xlabel(r\'$\\displaystyle\\tau_{\\text{ref}}$ (ms)\')\n' +
                      'plt.ylabel(\'k\')\n' +
                      'plt.legend()\n' +
                      'plt.show()'}
                    </Highlight>
                  </CustomCard>
                </Grid>
                <Grid key={1} item className={'neur__questions__gridR'}>
                  <CardMedia image={method_of_moments} className={'neur__questions__image'}/>
                </Grid>
              </Grid>
              <hr className={'neur__hr'}/>
              <Grid container spacing={3} justify='center'>
                <Grid container spacing={3} justify='center'>
                  <Grid key={0} item className={'neur__questions__gridL'}>
                    <Typography>
                      Using the mean as an example metric, we fit a curve of the form
                      <BlockMath>
                        {'f(\\tau_{\\text{ref}}) = A(1-e^{-B\\tau_{\\text{ref}}}) + C\\tau_{\\text{ref}}'}
                      </BlockMath>
                      and use this to plot some gamma functions against our ISI distribution.
                      These plots show an expected trend, that the fit is best around <InlineMath>{'\\tau_{\\text{ref}}=38'}</InlineMath> ms and worse
                      the further deviated from this. We repeat this for the variance fit of form
                      <BlockMath>
                        {'f(\\tau_{\\text{ref}}) = D\\tau_{\\text{ref}}'}
                      </BlockMath>
                    </Typography>
                    <CustomCard title={'Code'} avatar={<Code />} expanded={false}>
                      <Highlight language={'python'}>
                        {'def mom_experiment(tau, fit):\n' +
                        '    """\n' +
                        '    Runs an instant of a _fit experiment which fits a gamma distribution with the corresponding k value to the simulated data\n' +
                        '    """\n' +
                        '    x = np.linspace(0, 200, 100)\n' +
                        '    t = refractory_homogeneous_poisson(100, 10, tau/1000, 30)\n' +
                        '    plot_interval_hist(t, 0, True, 0.33, label=\'Data\', density=True,\n' +
                        '                       title=fit + r\' fit ($\\displaystyle\\tau_{\\text{ref}}=$\' + str(tau) + \'ms)\')\n' +
                        '    if fit == \'Mean\':\n' +
                        '        k = mean_fit(tau)\n' +
                        '    elif fit == \'Variance\':\n' +
                        '        k = var_fit(tau)\n' +
                        '    plt.plot(x, gamma.pdf(x, 1 + k, scale=1000/100), label=\'Gamma fit\')\n' +
                        '\n' +
                        'fig = matplotlib.pyplot.gcf()\n' +
                        'fig.set_size_inches(10, 10)\n' +
                        'plt.subplot(3, 1, 1)\n' +
                        'mom_experiment(15, \'Mean\')\n' +
                        'plt.xlabel(\'\')\n' +
                        'plt.legend()\n' +
                        'plt.subplot(3, 1, 2)\n' +
                        'mom_experiment(38, \'Mean\')\n' +
                        'plt.xlabel(\'\')\n' +
                        'plt.subplot(3, 1, 3)\n' +
                        'mom_experiment(100, \'Mean\')\n' +
                        'plt.tight_layout()\n' +
                        'plt.show()\n' +
                        '\n' +
                        'fig = matplotlib.pyplot.gcf()\n' +
                        'fig.set_size_inches(10, 10)\n' +
                        'plt.subplot(3, 1, 1)\n' +
                        'mom_experiment(15, \'Variance\')\n' +
                        'plt.xlabel(\'\')\n' +
                        'plt.legend()\n' +
                        'plt.subplot(3, 1, 2)\n' +
                        'mom_experiment(38, \'Variance\')\n' +
                        'plt.xlabel(\'\')\n' +
                        'plt.subplot(3, 1, 3)\n' +
                        'mom_experiment(100, \'Variance\')\n' +
                        'plt.tight_layout()\n' +
                        'plt.show()'}
                      </Highlight>
                    </CustomCard>
                  </Grid>
                  <Grid key={1} item className={'neur__questions__gridR'}>
                    <Grid container spacing={0} justify='center'>
                      <Grid key={0} item className={'neur__questions__gridL'}>
                        <CardMedia image={mean_fit} className={'neur__questions__image--square'}/>
                      </Grid>
                      <Grid key={1} item className={'neur__questions__gridL'}>
                        <CardMedia image={var_fit} className={'neur__questions__image--square'}/>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <hr className={'neur__hr'}/>
              <Grid container spacing={3} justify='center'>
                <Typography gutterBottom={true}>
                  While these fits do show some qualitative deviation from our proposed model, ideally we would want some way to quantify this.
                  This is where EDF (empirical distribution function) statistics come into play. Initially, the Kolmogorov-Smirnov test was thought
                  to be a good way to quantify the goodness of fit of our model but it was later found that the p-values of this test are significantly
                  shifted if the model contained parameters that were estimated from data (which is done here in the case of the shape parameter <InlineMath>{'1+k'}</InlineMath>).
                  <br/><br/>
                  To account for this estimation, we turn to Goodness-of-Fit-Techniques by Ralph B. D'Agostino where methods are discussed that deal
                  with the case where the shape parameter of a gamma distribution is estimated. The steps of the method are as follows:
                  <ol>
                    <li>Put the sample in ascending order <InlineMath>{'X_{(1)}<\\dots <X_{(n)}'}</InlineMath></li>
                    <li>Estimate <InlineMath>{'m=k+1'}</InlineMath> by maximum likelihood estimation (<InlineMath>{'\\hat m'}</InlineMath>)</li>
                    <li>Calculate <InlineMath>{'Z_{(i)}=\\frac{1}{\\beta^{\\hat{m}}\\Gamma(\\hat m)}\\int_0^{X_i}x^{\\hat m-1}e^{\\frac{-x}{\\beta}}\\text{dx}'}</InlineMath>
                      &nbsp;for <InlineMath>{'i=1,\\dots ,n'}</InlineMath> (where <InlineMath>{'\\beta = \\text{r}'}</InlineMath>)</li>
                    <li>Calculate the EDF statistics using the values of <InlineMath>{'Z_{(i)}'}</InlineMath></li>
                    <li>Reject the null hypothesis that the the data follows the given distribution if the the value of the statistics are greater
                      than the tabulated values for a desired significance level <InlineMath>{'\\alpha'}</InlineMath> and for appropriate <InlineMath>{'\\hat m'}</InlineMath></li>
                  </ol>
                  We will first assume that in step 2, our variant of the method of moments is used to estimate <InlineMath>{'m'}</InlineMath> and we will later discuss the MLE solution.
                  We will now show that the integral in step 3 can be simplified to the incomplete gamma function:
                  <BlockMath>
                    {'\\Gamma_{\\text{inc}}(X; m)=\\frac{1}{\\Gamma(m)}\\int_0^X x^{m-1}e^{-m}\\text{dx}'}
                  </BlockMath>
                  Using the substitution <InlineMath>{'x\'=\\frac{x}{\\beta}'}</InlineMath> we can obtain the desired result:
                  <BlockMath>
                    {'\\begin{aligned}\n' +
                    'Z_{(i)}&=\\frac{1}{\\beta^{\\hat{m}}\\Gamma(\\hat{m})}\\int_0^{X_i}(x\'\\beta)^{\\hat{m}-1}e^{-x\'}\\beta \\text{dx\'}\\\\\n' +
                    '                    &=\\frac{\\beta^{\\hat{m}-1}\\beta}{\\beta^{\\hat{m}}}\\Gamma_{\\text{inc}}(X_{(i)};\\hat{m})=\\Gamma_{\\text{inc}}(X_{(i)};\\hat{m})\n' +
                    '                    \\end{aligned}'}
                  </BlockMath>
                  Finally, the EDF statistics that we will be using include the Kolmogorov statistic <InlineMath>{'D'}</InlineMath> (for which no p-values are available so we will simply state it) defined as:
                  <BlockMath>
                    {'D = \\sup_x|F_n(x)-F(x)|'}
                  </BlockMath>
                  where <InlineMath>{'F(x)'}</InlineMath> is the cdf of the model distribution (gamma distribution in our case) and <InlineMath>{'F_n(x)'}</InlineMath> is the
                  empirical cumulative distribution function which we will obtain from the data. This statistic is part of the <i>supremum statistics</i>
                  &nbsp;which are different from the other three statistics we will now describe.
                  <br/><br/>
                  The Cramér–von Mises statistic, <InlineMath>{'W^2'}</InlineMath>, and the Anderson-Darling statistic, <InlineMath>{'A^2'}</InlineMath>, are both of the form:
                  <BlockMath>
                    {'Q = n\\int^\\infty_{-\\infty}\\big(F_n(x)-F(x)\\big)^2\\psi(x)\\text{dF(x)}'}
                  </BlockMath>
                  where <InlineMath>{'\\psi(x) = 1'}</InlineMath> for <InlineMath>{'W^2'}</InlineMath> and <InlineMath>{'\\psi(x) = \\frac{1}{F(x)(1-F(x))}'}</InlineMath>
                  for <InlineMath>{'A^2'}</InlineMath>.
                  Finally, the last statistic we will calculate is the Watson statistic, <InlineMath>{'U^2'}</InlineMath> which has a slightly different format:
                  <BlockMath>
                    {'U^2=n\\int^\\infty_{-\\infty}\\Big\\{F_n(x)-F(x)-\\int_{-\\infty}^\\infty \\big\\{F_n(x)-F(x)\\big\\}\\text{dF(x)}\\Big\\}^2\\text{dF(x)}'}
                  </BlockMath>
                  These three statistics belong to the quadratic statistics and we will obtain p-values for all three and hence, be able to use these for step 5.
                </Typography>
              </Grid>
            </CustomCard>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
