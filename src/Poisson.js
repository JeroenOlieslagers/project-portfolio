import React from 'react';
import PoissonConfig from './components/configDashboards/PoissonConfig';
import {Paper, Grid, Typography, Link} from '@material-ui/core';
import {InlineMath, BlockMath} from 'react-katex';
import 'katex/dist/katex.min.css';
import PoissonChart from './components/PoissonChart';
import Tag from './components/Tag';

function Poisson() {
  return (
    <Grid container spacing={3} className={'stats__grid'}>
      <Grid item xs={12}>
        <Paper className={'stats__text'}>
          <Typography variant={'h4'} align={'center'} gutterBottom={true}>
            Transforming Random Variable Distributions <br /> &nbsp;
          </Typography>
          <Typography variant={'h6'} align={'center'} gutterBottom={true}>
            Poisson distributions
          </Typography>
          <Typography>
            We now turn to the Poisson distribution, another very prominent distribution that describes random events
            happening at a constant rate independently of time. The analytic function is:
            <BlockMath>
              {'\\large{\\text{Po}(x\\hspace{2pt} ; \\hspace{2pt} \\lambda) = \\frac{\\lambda^x}{x!}e^{-\\lambda}}'}
            </BlockMath>
            To transform our uniform distribution to a Poisson one, we can use the Knuth algorithm or we can use
            inverse transform sampling to obtain a practical estimate to the analytic distribution (
            <Link className={'link'} target="_blank" href={'https://en.wikipedia.org/wiki/Poisson_distribution#Generating_Poisson-distributed_random_variables'}>
              source
            </Link>). Since the Knuth algorithm can have underflow errors at high <InlineMath>{'\\lambda'}</InlineMath>
            &nbsp; due to the very small <InlineMath>{'e^{\\lambda}'}</InlineMath>, another algorithm is also used that
            uses a smallest value of <InlineMath>{'e^{-\\lambda}'}</InlineMath> using a separate parameter &nbsp;
            <InlineMath>{'{\\footnotesize{\\text{STEP}}}'}</InlineMath>.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <PoissonChart />
      </Grid>
      <Grid item xs={12}>
        <PoissonConfig />
      </Grid>
    </Grid>
  );
}

export default Poisson;
