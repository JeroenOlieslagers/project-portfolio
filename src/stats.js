import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import dark from '@amcharts/amcharts4/themes/dark';
import animated from '@amcharts/amcharts4/themes/animated';
import randomDataGenerator from './randomDataGenerator';
import * as utils from './utils';
import StatsConfig from './configDashboards/StatsConfig';
import {connect} from 'react-redux';
import {toggleUpdateData} from './actions';
import {Paper, Grid, Typography, Link} from '@material-ui/core';
import NavigationBar from './NavigationBar';
import CustomCard from './CustomCard';
import {BarChart} from '@material-ui/icons';
import {InlineMath, BlockMath} from 'react-katex';
import 'katex/dist/katex.min.css';


class Stats extends React.Component {
  constructor() {
    super();
    this.chart = null;
    am4core.options.commercialLicense = true;
    this.mean = 0;
  }

  componentDidMount() {
    this.createChart();
  }

  createData() {
    const samples = this.props.samples;
    const mean = this.props.mean;
    const st_div = this.props.stDev;
    let chart_data = randomDataGenerator({
      timeRange: samples,
      variance_divisor: mean / st_div,
      isStatic: true,
      independent: 'ID',
      rules: ['positive'],
      dependent: [{name: 'column-1', typical: mean, rules: []}, {name: 'column-3', typical: mean, rules: ['uniform']}]
    });
    let dummy = utils.createHistogram(chart_data);
    let data = [];
    /**
     * Converts to data object that is readable by amcharts
     */
    Object.keys(dummy).forEach((item, index) => {
      let dataPoint = {};
      dataPoint['ID'] = item;
      dataPoint['column-1'] = dummy[item]['column-1'];
      dataPoint['column-2'] = Math.round(utils.Gaussian(mean, st_div, parseInt(item, 10)) * samples);
      dataPoint['column-3'] = dummy[item]['column-3'];
      if (!data[0]) {
        dataPoint['column-4'] = dummy[item]['column-1'];
      } else {
        dataPoint['column-4'] = data[index - 1]['column-4'] + dummy[item]['column-1'];
      }
      data.push(dataPoint);
    });
    return data;
  }

  createChart() {
    /* Chart code */
    // Themes begin
    am4core.useTheme(dark);
    am4core.useTheme(animated);
    // Themes end

    // Create chart instance
    this.chart = am4core.create(this.refs.chart, am4charts.XYChart);
    let chart = this.chart;
    chart.categoryField = 'category';

    // Add data
    chart.data = this.createData();

    // Create axes
    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.id = 'xAxis';
    xAxis.dataFields.category = 'ID';
    xAxis.renderer.grid.strokeDasharray = 3;

    let yAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis1.renderer.grid.strokeDasharray = 3;

    let yAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis2.renderer.grid.template.disabled = true;
    yAxis2.renderer.line.strokeOpacity = 1;
    yAxis2.renderer.line.strokeWidth = 2;
    yAxis2.renderer.opposite = true;

    // Create series
    let normalBM = chart.series.push(new am4charts.ColumnSeries());
    normalBM.name = 'Normal (artificial, Box-Muller)';
    normalBM.dataFields.valueY = 'column-1';
    normalBM.dataFields.categoryX = 'ID';
    normalBM.columns.template.width = am4core.percent(80);
    normalBM.strokeWidth = 1;
    normalBM.fillOpacity = 0;
    normalBM.tensionX = 1;

    let normal = chart.series.push(new am4charts.LineSeries());
    normal.name = 'Normal (analytical)';
    normal.dataFields.valueY = 'column-2';
    normal.dataFields.categoryX = 'ID';
    normal.strokeWidth = 1;
    normal.tensionX = 1;

    let uniform = chart.series.push(new am4charts.LineSeries());
    uniform.name = 'Uniform';
    uniform.dataFields.valueY = 'column-3';
    uniform.dataFields.categoryX = 'ID';
    uniform.strokeWidth = 1;
    uniform.tensionX = 1;
    uniform.hidden = true;

    let cfdBM = chart.series.push(new am4charts.LineSeries());
    cfdBM.name = 'CDF (Box-Muller)';
    cfdBM.dataFields.valueY = 'column-4';
    cfdBM.dataFields.categoryX = 'ID';
    cfdBM.strokeWidth = 1;
    cfdBM.tensionX = 1;
    cfdBM.yAxis = yAxis2;

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

    // Add padding
    chart.paddingBottom = 20;
    chart.paddingTop = 40;
  }

  render() {
    if (this.props.updateData) {
      this.props.toggleUpdateData();
      this.chart.data = this.createData();
    }
    return (
      <div>
        <Grid container spacing={3} className={'stats__grid'}>
          <Grid item xs={12}>
            <Paper className={'stats__text'}>
              <Typography variant={'h4'} align={'center'} gutterBottom={true}>
                Transforming Random Variable Distributions
              </Typography>
              <Typography>
                This section compares the performance of an artificially created normal distribution
                from the uniform distribution provided by Javascript's <code>Math.random()</code>
                &nbsp;function. In order
                to achieve this, a method called the&nbsp;
                <Link
                  className={'link'}
                  href={'https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform'}>
                  Box-Muller transform
                </Link>
                &nbsp; was used.
                In the graph below,
                we can see its performance in a histogram compared to the analytic function of the
                normal distribution:
                <BlockMath>{'\\large{\\mathcal{N}(x ; \\mu,\\sigma) =' +
                ' \\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}}'}</BlockMath>
                There is also an option to show the source of the random variable
                by ticking the 'Uniform' legend which will show raw output from <code>Math.random()</code>
                . The CDF of our transformed distribution is also shown to further our comparison.
                <br/>Below the graph, there is a panel that allows you to change the three parameters that define
                the graph: the mean, variance and number of samples.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <CustomCard title={'Probability Distribution Histograms'} avatar={<BarChart />}>
              <div className={'stats__chart'} ref={'chart'} />
            </CustomCard>
          </Grid>
          <Grid item xs={12}>
            <StatsConfig />
          </Grid>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mean: state.mean,
    stDev: state.stDev,
    samples: state.samples,
    updateData: state.updateData
  };
}

const mapDispatchToProps = {
  toggleUpdateData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats);
