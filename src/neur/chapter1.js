import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import dark from '@amcharts/amcharts4/themes/dark';
import animated from '@amcharts/amcharts4/themes/animated';
import randomDataGenerator from '../components/randomDataGenerator';
import CustomCard from '../components/CustomCard';
import * as utils from '../components/utils';
import {BarChart} from '@material-ui/icons';
import {Grid, Paper, Typography} from '@material-ui/core';

export default class Chapter1 extends React.Component {
  constructor() {
    super();
    this.chart = null;
    am4core.options.commercialLicense = true;
  }

  componentDidMount() {
    this.createChart();
  }

  createData() {
    const samples = 10;
    const mean = 10;
    const st_div = 10;
    let chart_data = randomDataGenerator({
      samples: samples,
      variance_divisor: mean / st_div,
      isStatic: true,
      independent: 'id',
      rules: ['positive'],
      dependent: [{name: 'column-1', typical: mean, rules: []}]
    });
    return chart_data;
  }

  createChart() {
    /* Chart code */
    // Themes begin
    am4core.useTheme(dark);
    am4core.useTheme(animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create(this.refs.chart, am4charts.XYChart);
    chart.categoryField = 'category';

    // Add data
    chart.data = this.createData();

    // Create axes
    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.id = 'xAxis';
    xAxis.dataFields.category = 'id';
    xAxis.renderer.grid.strokeDasharray = 3;

    let yAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis1.renderer.grid.strokeDasharray = 3;

    // Create series
    let spikes = chart.series.push(new am4charts.ColumnSeries());
    spikes.name = 'Spike Train';
    spikes.dataFields.valueY = 'column-1';
    spikes.dataFields.categoryX = 'id';
    spikes.columns.template.width = am4core.percent(1);
    spikes.strokeWidth = 1;
    spikes.tensionX = 1;
    spikes.fillOpacity = 0;
    spikes.stroke = am4core.color('#FF8000');

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Create legend
    chart.legend = new am4charts.Legend();
    let markers = chart.legend.markers.template;
    markers.width = 12;
    markers.height = 12;
    let container = chart.legend.itemContainers.template;
    container.paddingRight = 5;
    container.paddingLeft = 5;
    container.paddingTop = 0;
    container.paddingBottom = 0;

    // Chart padding
    chart.paddingTop = 50;
  }

  render() {
    return (
      <Grid container spacing={3} className={'stats__grid'}>
        <Grid item xs={12}>
          <Paper className={'stats__text'}>
            <Typography variant={'h4'} align={'center'} gutterBottom={true}>
              Chapter 1 <br /> &nbsp;
            </Typography>
            <Typography align={'center'} gutterBottom={true}>
              This section is still under development.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <CustomCard title={'Theoretical Neuroscience'} avatar={<BarChart />}>
            <div className="stats__chart" ref={'chart'} />
          </CustomCard>
        </Grid>
      </Grid>
    );
  }
}
