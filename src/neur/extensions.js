import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import book_cover from '../images/book_cover.jpg';
import {CardMedia, Grid, Link, Paper, Typography} from '@material-ui/core';

export default class NeurExt extends React.Component {
  constructor() {
    super();
    this.chart = null;
    am4core.options.commercialLicense = true;
  }

  render() {
    return (
      <Grid container spacing={3} className={'stats__grid'}>
        <Grid item xs={12}>
          <Paper className={'neur__info__text'}>
            <Typography variant={'h4'} align={'center'} gutterBottom={true}>
              Extensions <br /> &nbsp;
            </Typography>
            <Typography align={'center'} gutterBottom={true}>
              This section is still under development.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
