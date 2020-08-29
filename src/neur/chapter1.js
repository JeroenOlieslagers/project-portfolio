import React from 'react';
import CustomCard from '../components/CustomCard';
import 'katex/dist/katex.min.css';
import {InlineMath, BlockMath} from 'react-katex';
import {Subject, Code} from '@material-ui/icons';
import {CardMedia, Grid, Paper, Typography} from '@material-ui/core';
import abc from '../images/abc.svg';
import fano_window from '../images/fano_window.svg';
import isi_hist from '../images/isi_hist.svg';
import Highlight from 'react-highlight.js';
import fano from '../images/fano.svg';
import cv from '../images/cv.svg';
import spike_train_bw from '../images/spike_train_bw.svg';

export default class Chapter1 extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Grid container spacing={3} className={'stats__grid'}>
        <Grid item xs={12}>
          <Paper className={'stats__text'}>
            <Typography variant={'h4'} align={'center'} gutterBottom={true}>
              Chapter 1: Neural Encoding I <br /> &nbsp;
            </Typography>
            <CustomCard title={'Question 1'} avatar={<Subject />} expanded={false}>
              <Grid container spacing={3} justify='center'>
                <Grid key={0} item className={'neur__questions__gridL'}>
                  <Typography>
                    <i>Generate spikes for 10 s (or longer if you want better statistics) using
                    a Poisson spike generator with a constant rate of 100 Hz, and record
                      their times of occurrence.</i>
                    <br/><br/>
                    Estimated probability of firing a spike during a short interval of duration &nbsp;
                    <InlineMath>{'\\Delta t'}</InlineMath> is <InlineMath>{'\\text{r}_{\\text{est}}(t)\\Delta t'}</InlineMath>
                    &nbsp; where&nbsp;  <InlineMath>{'\\text{r}_{\\text{est}}(t)'}</InlineMath>
                    &nbsp; is the estimate of the firing rate predicted from knowledge of the stimulus
                    (we will assume it is some constant in this first section). The normal way to generate a spike train
                    for this rate is to generate a uniform random number&nbsp;
                    <InlineMath>{'x_{\\text{rand}}'}</InlineMath> &nbsp; between 0 and 1 at each time step and if &nbsp;
                    <InlineMath>{'\\text{r}_{\\text{est}}(t)\\Delta t > x_{\\text{rand}}'}</InlineMath>
                    &nbsp; then a spike is fired in the time step.
                    <br/><br/>
                    For constant spike rates, we can compute the spike times by using the following iterative formula:
                    <BlockMath>
                      {'t_{i+1}=t_i-\\frac{\\ln(x_{\\text{rand}})}{\\text{r}}'}
                    </BlockMath>
                    where &nbsp;<InlineMath>{'\\bf{t}'}</InlineMath>&nbsp;  is a vector of the spike times.
                    The ISI (interspike intervals) can be computed in one
                    step by taking a vector of random numbers and applying the negative log with the division by
                    &nbsp;<InlineMath>{'\\text{r}'}</InlineMath>&nbsp;
                    at once providing a computationally more efficient method. The quantitative comparisons may be found
                    in the extensions section. To record the times of spike occurrence, we use a raster plot and
                    repeat for a number of trials.
                  </Typography>
                  <CustomCard title={'Code'} avatar={<Code />} expanded={false}>
                    <Highlight language={'python'}>
                      {'def homogeneous_poisson(r, T, n=1, oversample=True):\n' +
                      '    """\n' +
                      '    Generates a homogeneous Poisson spike train of rate r (Hz) and duration T (s) using the vector method\n' +
                      '    :param r: rate\n' +
                      '    :param T: duration\n' +
                      '    :param oversample: whether to include extra samples to make duration equal to T\n' +
                      '    :param n: set number of trials. 1 will return a numpy array, anything larger will return a list of numpy arrays\n' +
                      '    """\n' +
                      '    if n != 1:      # Use recursion to sample multiple trials\n' +
                      '        return [homogeneous_poisson(r, T, n=1, oversample=oversample) for i in range(n)]\n' +
                      '    \n' +
                      '    if oversample:\n' +
                      '        isi = - np.log(np.random.rand(int((r * T) + 3 * np.sqrt(r*T)))) / r  # Oversample by 3 standard deviations\n' +
                      '        t = to_spike_times(isi)     \n' +
                      '        t = t[t<=T]     # Remove spikes that occur after time limit\n' +
                      '    else:\n' +
                      '        isi = - np.log(np.random.rand(r * T)) / r  # Approximately r*T spikes per trial\n' +
                      '        t = to_spike_times(isi)     \n' +
                      '    return t\n' +
                      '\n' +
                      '\n' +
                      'def homogeneous_poisson_iterative(r, T, n=1):\n' +
                      '    """\n' +
                      '    Generates a homogeneous Poisson spike train of rate r (Hz) and duration T (s) using the iterative formula\n' +
                      '    """\n' +
                      '    if n != 1:      # Use recursion to sample multiple trials\n' +
                      '        return [homogeneous_poisson_iterative(r, T, n=1) for i in range(n)]\n' +
                      '    \n' +
                      '    t = [-np.log(np.random.rand())/r]\n' +
                      '    while True:\n' +
                      '        t.append(t[-1] - np.log(np.random.rand())/r)\n' +
                      '        if t[-1] > T:   # This is python\'s version of a do-while loop\n' +
                      '            t = t[:-1]\n' +
                      '            break\n' +
                      '    return np.array(t)\n' +
                      '\n' +
                      '\n' +
                      'def to_isi(t, join=False):\n' +
                      '    """\n' +
                      '    Converts spike times to ISI\n' +
                      '    join parameter allows return of numpy vector containing isi from all trials joined together\n' +
                      '    """\n' +
                      '    if type(t) == list:     # case of multiple trials\n' +
                      '        isi = [i[1:] - i[:-1].copy() for i in t]\n' +
                      '        if join:\n' +
                      '            return np.array(list(itertools.chain(*isi)))\n' +
                      '        else:\n' +
                      '            return isi\n' +
                      '    else:                   # case of single trial\n' +
                      '        isi = t.copy()\n' +
                      '        isi[1:] -= isi[:-1].copy()  # inverse of cumsum\n' +
                      '        return isi  \n' +
                      '\n' +
                      '\n' +
                      'def to_spike_times(isi):\n' +
                      '    """\n' +
                      '    Converts ISI to spike times\n' +
                      '    """\n' +
                      '    if type(isi) == list:   # case of multiple trials\n' +
                      '        return np.cumsum(isi, axis=1)\n' +
                      '    else:                   # case of single trial\n' +
                      '        return np.cumsum(isi)' +
                      '\n' +
                      '\n' +
                      'def plot_spikes(t, T=np.inf):\n' +
                      '    """\n' +
                      '    Raster plot for one or more spike trains\n' +
                      '    :param t: spike times\n' +
                      '    :param T: integer for cropping to a set duration (default set to infinity for no cropping)\n' +
                      '    """\n' +
                      '    if type(t) == list:\n' +
                      '        n = len(t)\n' +
                      '        t = [t[i][t[i]<=T] for i in range(n)]\n' +
                      '        line_size = [0.6 for i in range(n)]\n' +
                      '        colours = [\'C{}\'.format(i) for i in range(n)]\n' +
                      '        plt.eventplot(t, linelengths=line_size, colors=colours)\n' +
                      '    elif t.ndim == 1:\n' +
                      '        t = t[t<=T]\n' +
                      '        plt.eventplot(t, linelengths=0.6, color=plt.rcParams[\'axes.prop_cycle\'].by_key()[\'color\'][0])\n' +
                      '    plt.title(\'Spike trains\')\n' +
                      '    plt.xlabel(\'Time (s)\')\n' +
                      '    plt.ylabel(\'Spike occurrence\')\n' +
                      '\n' +
                      '\n' +
                      't = homogeneous_poisson(100, 10, n=10)\n' +
                      'plot_spikes(t, T=0.5)'}
                    </Highlight>
                  </CustomCard>
                </Grid>
                <Grid key={1} item className={'neur__questions__gridR'}>
                  <Grid container spacing={0} justify='center'>
                    <Grid key={0} item className={'neur__questions__gridL'}>
                      <CardMedia image={abc} className={'neur__questions__image'}/>
                    </Grid>
                    <Grid key={1} item className={'neur__questions__gridL'}>
                      <CardMedia image={spike_train_bw} className={'neur__questions__image'}/>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <hr className={'neur__hr'}/>
              <Grid container spacing={3} justify='center'>
                <Grid key={0} item className={'neur__questions__gridL'}>
                  <Typography>
                    <i>Compute the coefficient of variation of the interspike intervals, and the Fano factor for spike counts obtained
                      over counting intervals ranging from 1 to 100 ms. Plot the interspike interval histogram.</i>
                    <br/>
                    The coefficient of variation is defined as:
                    <BlockMath>{'C_V=\\frac{\\sigma_{\\tau}}{\\langle\\tau\\rangle}'}</BlockMath>
                    where
                    <BlockMath>
                      {'\\langle\\tau\\rangle = \\int^{\\infty}_0 \\tau \\text{p}_{\\tau}[\\tau] \\text{d}\\tau = \\frac{1}{\\text{r}} \n' +
                      '\\sigma_{\\tau}^2 = \\int^{\\infty}_0\\tau^2\\text{p}_{\\tau}[\\tau] \\text{d}\\tau - \\langle\\tau\\rangle^2 = \\frac{1}{\\text{r}^2}'}
                    </BlockMath>
                    using the fact that ISI (represented by <InlineMath>{'\\tau'}</InlineMath>) are distributed according to an exponential distribution (explanation for this in extension).
                    <br/><br/>
                    The Fano factor is defined as:
                    <BlockMath>{'F = \\frac{\\sigma_n^2}{\\langle n\\rangle}'}</BlockMath>
                    where
                    <BlockMath>
                      {'\\langle n\\rangle = \\sum^{\\infty}_{n=0} n\\text{P}_{N}[n] = \\text{r}T \n' +
                      '\\sigma_n^2 = \\Big(\\sum^{\\infty}_{n=0}n^2\\text{P}_{N}[n]\\Big) - \\langle n\\rangle^2 = \\text{r}T'}
                    </BlockMath>
                    using the fact that spike times (represented by <InlineMath>{'n'}</InlineMath>) are distributed according to a Poisson distribution (explanation for this in extension).
                    <br/><br/>
                    The theoretical values of both of these metrics are 1 for a homogeneous Poisson process independent of <InlineMath>{'T'}</InlineMath>.
                    <br/>
                    We can confirm these values by plotting the mean and variance against each other. We should see that these points lie on the x=y line.
                  </Typography>
                  <CustomCard title={'Code'} avatar={<Code />} expanded={false}>
                    <Highlight language={'python'}>
                      {'def fano_factor(t, window, end, start=0, return_value=True):\n' +
                      '    """\n' +
                      '    Computes the Fano factor\n' +
                      '    :param t: spike times\n' +
                      '    :param start: start time of sampling (if the whole spike train is not to be taken account for)\n' +
                      '    :param end: end time of sampling     (if the whole spike train is to be considered, enter the duration of the spike train here)\n' +
                      '    :param window: window size for averaging ()\n' +
                      '    :param return_value: set to False if the individual values of the variance and mean are required\n' +
                      '    """\n' +
                      '    if type(t) == list:\n' +
                      '        n = np.array([]) if return_value else np.array([[None, None]])\n' +
                      '        for trial in t:\n' +
                      '                if return_value:\n' +
                      '                    n = np.concatenate((n, fano_factor(trial, window, end, start=start, return_value=\'recurse\')))\n' +
                      '                else:\n' +
                      '                    n = np.concatenate((n, np.array([fano_factor(trial, window, end, start=start, return_value=False)])))\n' +
                      '    else:\n' +
                      '        n = bin_spikes(t, window, start, end)[0]\n' +
                      '\n' +
                      '    if return_value == \'recurse\':\n' +
                      '        return n\n' +
                      '    elif return_value:\n' +
                      '        return np.var(n) / np.mean(n)\n' +
                      '    else:\n' +
                      '        if type(t) == list:\n' +
                      '            return n[1:].T\n' +
                      '        else:\n' +
                      '            return np.var(n), np.mean(n)\n' +
                      '\n' +
                      '\n' +
                      'def coefficient_variation(t, return_value=True):\n' +
                      '    """\n' +
                      '    Computes the coefficient of variation of a given spike train\n' +
                      '    If return_value is set to false, will return the variance and mean as a tuple\n' +
                      '    """\n' +
                      '    if type(t) == list:\n' +
                      '        isi = np.array([]) if return_value else np.array([[None, None]])\n' +
                      '        for trial in t:\n' +
                      '                if return_value:\n' +
                      '                    isi = np.concatenate((isi, coefficient_variation(trial, return_value=\'recurse\')))\n' +
                      '                else:\n' +
                      '                    isi = np.concatenate((isi, np.array([coefficient_variation(trial, return_value=False)])))\n' +
                      '    else:\n' +
                      '        isi = to_isi(t)\n' +
                      '\n' +
                      '    if return_value == \'recurse\':\n' +
                      '        return isi\n' +
                      '    elif return_value:\n' +
                      '        return np.std(isi) / np.mean(isi)\n' +
                      '    else:\n' +
                      '        if type(t) == list:\n' +
                      '            return isi[1:].T\n' +
                      '        else:\n' +
                      '            return np.std(isi), np.mean(isi)\n' +
                      '\n' +
                      '\n' +
                      'def bin_spikes(t, window, start, end):\n' +
                      '    """\n' +
                      '    Returns histogram counts of the spikes from start to end (in seconds) in with a bin width of window\n' +
                      '    Discards some of the last data if the interval does not divide exactly into window\n' +
                      '    """\n' +
                      '    cropped_end = end - (end - start) % window                      # Makes sure that the specified interval divides into bins of duration window\n' +
                      '    number_bins = int((cropped_end - start) / window)\n' +
                      '    bins = np.linspace(start, cropped_end, number_bins+1)           # Acts like np.arange but including the last element (more stable with floats)\n' +
                      '    return np.histogram(t, bins)                                    # number of spikes in each bin\n' +
                      '\n' +
                      '\n' +
                      'def plot_interval_hist(t, c=0, fill=False, alpha=1, label=None, line_plot=False, density=False, extra_title=\'\'):\n' +
                      '    """\n' +
                      '    Plots a histogram of the ISI (c sets colour index)\n' +
                      '    """\n' +
                      '    isi = to_isi(t, join=True)\n' +
                      '    plt.hist(isi*1000, bins=50, fill=fill,\n' +
                      '             edgecolor=plt.rcParams[\'axes.prop_cycle\'].by_key()[\'color\'][c],\n' +
                      '             facecolor=plt.rcParams[\'axes.prop_cycle\'].by_key()[\'color\'][c], alpha=alpha, label=label, density=density)\n' +
                      '    if line_plot:\n' +
                      '        plt.plot(np.histogram(isi, bins=50)[1][:-1]*1000, np.histogram(isi, bins=50)[0], color=plt.rcParams[\'axes.prop_cycle\'].by_key()[\'color\'][c])\n' +
                      '    plt.title(\'Interspike interval histogram\' + extra_title)\n' +
                      '    plt.xlabel(\'Interval (ms)\')\n' +
                      '    plt.ylabel(\'Histogram count\')' +
                      '\n' +
                      '\n' +
                      'def diagonal_fit_plot(x):\n' +
                      '    """\n' +
                      '    Takes in a tuple of (x, y) data and plots it against a x=y diagonal\n' +
                      '    """\n' +
                      '    plt.scatter(x[0], x[1], marker=\'.\', color=\'gray\', label=\'data\')\n' +
                      '    plt.plot([x.min(), x.max()], [x.min(), x.max()], color=\'red\', label=\'fit\')\n' +
                      '    plt.legend()\n' +
                      '\n' +
                      '\n' +
                      'def join_lists(x):\n' +
                      '    """\n' +
                      '    Used for running multiple trial sets with different hyperparameters\n' +
                      '    Joins the lists of numpy arrays into one large list of numpy arrays\n' +
                      '    """\n' +
                      '    return list(itertools.chain(*x))' +
                      '\n' +
                      '\n' +
                      't = homogeneous_poisson(100, 50, 10)\n' +
                      'windows = np.linspace(1, 100, 100) / 1000\n' +
                      'F = [fano_factor(t, i, 50) for i in windows]\n' +
                      'plt.scatter(1000*windows, F)\n' +
                      'plt.xlabel(\'Window size (ms)\')\n' +
                      'plt.ylabel(\'Fano factor\')\n' +
                      'plt.title(\'Fano factor for different window sizes\')\n' +
                      'plt.show()\n' +
                      '\n' +
                      'Cv = coefficient_variation(t)\n' +
                      'print(\'Coefficient of variation: \' + str(Cv))\n' +
                      '\n' +
                      'plot_interval_hist(t)\n' +
                      'plt.show()' +
                      '\n' +
                      '\n' +
                      'rates = np.linspace(10, 100, 91, dtype=int)\n' +
                      't = join_lists([homogeneous_poisson(i, 10, 50) for i in rates])\n' +
                      'F = fano_factor(t, 1e-3, 10, return_value=False)\n' +
                      'diagonal_fit_plot(F)\n' +
                      'plt.xlabel(\'Spike Count Variance\')\n' +
                      'plt.ylabel(\'Spike Count Mean\')\n' +
                      'plt.title(\'Fano factor\')\n' +
                      'plt.show()\n' +
                      '\n' +
                      'Cv = coefficient_variation(t, return_value=False)\n' +
                      'diagonal_fit_plot(Cv)\n' +
                      'plt.xlabel(\'Interval Standard Deviation\')\n' +
                      'plt.ylabel(\'Interval Mean\')\n' +
                      'plt.title(\'Coefficient of variation\')\n' +
                      'plt.show()'}
                    </Highlight>
                  </CustomCard>
                </Grid>
                <Grid key={1} item className={'neur__questions__gridR'}>
                  <Grid container spacing={0} justify='center'>
                    <Grid key={0} item className={'neur__questions__gridL'}>
                      <CardMedia image={fano_window} className={'neur__questions__image'}/>
                    </Grid>
                    <Grid key={1} item className={'neur__questions__gridL'}>
                      <CardMedia image={isi_hist} className={'neur__questions__image'}/>
                    </Grid>
                  </Grid>
                  <Grid container spacing={0} justify='center'>
                    <Grid key={0} item className={'neur__questions__gridL'}>
                      <CardMedia image={fano} className={'neur__questions__image'}/>
                    </Grid>
                    <Grid key={1} item className={'neur__questions__gridL'}>
                      <CardMedia image={cv} className={'neur__questions__image'}/>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CustomCard>
          </Paper>
        </Grid>
        <Grid item xs={12}>

        </Grid>
      </Grid>
    );
  }
}
