import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import book_cover from '../images/book_cover.jpg';
import {CardMedia, Grid, Link, Paper, Typography} from '@material-ui/core';

export default class NeurInfo extends React.Component {
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
              Theoretical Neuroscience <br /> &nbsp;
            </Typography>
            <Grid container spacing={3} justify='center'>
              <Grid key={0} item className={'neur__info__grid'}>
                <CardMedia image={book_cover} className={'neur__info__image'}/>
              </Grid>
              <Grid key={1} item className={'neur__info__grid'}>
                <Typography gutterBottom={true}>
                  This section will go through the &nbsp;
                  <Link className={'link'} target="_blank" href={'https://www.gatsby.ucl.ac.uk/~dayan/book/exercises/'}>
                    problems
                  </Link>
                  &nbsp; chapter by chapter from Peter Dayan and L. F. Abbott's Theoretical
                  neuroscience textbook. The solutions are computed in python, there will be code snippets along with the answers.
                  The accompanying graphs are saved from matplotlib plots. The reason python was used over javascript is due to
                  it's fast and wide linear algebra modules such as numpy.
                </Typography>
                <Typography gutterBottom={true}>
                  For certain questions, there might be extensions referenced. These can be found under the 'extensions' tab.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
