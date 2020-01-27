import {Grid, Link, Paper, Typography} from '@material-ui/core';
import React from 'react';

export default class IPython extends React.Component {
  render() {
    return (
      <Grid container spacing={3} className={'stats__grid'}>
        <Grid item xs={12}>
          <Paper className={'stats__text'}>
            <Typography variant={'h4'} align={'center'} gutterBottom={true}>
              Google Colab notebooks: <br/> <br/>
            </Typography>
            <Typography variant={'h6'} align={'center'} gutterBottom={true}>
              <Link className={'link'} target="_blank" href={'http://bit.ly/2MLMApR'}>
                Gradient descent and Backpropagation
              </Link>
              <br/>
              <Link className={'link'} target="_blank" href={'http://bit.ly/2METBIW'}>
                Regularisation and Cross-Entropy
              </Link>
              <br/>
              <Link className={'link'} target="_blank" href={'http://bit.ly/2QG9HnC'}>
              k-means Clustering
              </Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}