import React from 'react';
import StatsConfig from './components/configDashboards/StatsConfig';
import {Paper, Grid, Typography, Link} from '@material-ui/core';
import {InlineMath, BlockMath} from 'react-katex';
import 'katex/dist/katex.min.css';
import StatsChart from './components/StatsChart';

function Stats() {
  return (
    <div>
      <Grid container spacing={3} className={'stats__grid'}>
        <Grid item xs={12}>
          <Paper className={'stats__text'}>
            <Typography variant={'h4'} align={'center'} gutterBottom={true}>
              Transforming Random Variable Distributions
            </Typography>
            <Typography>
              This section compares the performance of an artificially created normal distribution from the uniform
              distribution provided by Javascript's <code>Math.random()</code>
              &nbsp;function. In order to achieve this, a method called the&nbsp;
              <Link className={'link'} target="_blank" href={'https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform'}>
                Box-Muller transform
              </Link>
              &nbsp; was used. If we have two uniformly distributed random variables
              <InlineMath>{'U_1'}</InlineMath> and <InlineMath>{'U_2'}</InlineMath>, then:
              <BlockMath>{'Z_0 = R \\cos{(\\Theta)}'}</BlockMath>
              <BlockMath>{'Z_1 = R \\sin{(\\Theta)}'}</BlockMath>
              where <InlineMath>{'Z_0'}</InlineMath> and <InlineMath>{'Z_1'}</InlineMath> are normally distributed
              random variables and
              <BlockMath>{'R^2 = -2 \\ln{U_1}'}</BlockMath>
              <BlockMath>{'\\Theta = 2\\pi U_2'}</BlockMath>
              this leads to the final two equations:
              <BlockMath>{'Z_0 = \\sqrt{-2\\ln{U_1}} \\cos{(2\\pi U_2)}'}</BlockMath>
              <InlineMath className='latex__tag'>{'(1)'}</InlineMath>
              <BlockMath>{'Z_1 = \\sqrt{-2\\ln{U_1}} \\sin{(2\\pi U_2)}'}</BlockMath>
              In the graph below, we can see its performance in a histogram compared to the analytic
              function of the normal distribution:
              <BlockMath>
                {'\\large{\\mathcal{N}(x \\hspace{2pt} ; \\hspace{2pt} \\mu,\\sigma) =' +
                  ' \\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}}'}
              </BlockMath>
              There is also an option to show the source of the random variable by ticking the 'Uniform' legend which
              will show raw output from <code>Math.random()</code>
              . The CDF of our transformed distribution is also shown to further our comparison.
              <br />
              Below the graph, there is a panel that allows you to change the three parameters that define the graph:
              the mean, variance and number of samples.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <StatsChart />
        </Grid>
        <Grid item xs={12}>
          <StatsConfig />
        </Grid>
      </Grid>
    </div>
  );
}

export default Stats;
