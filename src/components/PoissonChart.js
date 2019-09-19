import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import dark from '@amcharts/amcharts4/themes/dark';
import animated from '@amcharts/amcharts4/themes/animated';
import randomDataGenerator from './randomDataGenerator';
import * as utils from './utils';
import {connect} from 'react-redux';
import {toggleUpdateData} from '../actions';
import CustomCard from './CustomCard';
import {BarChart} from '@material-ui/icons';

class PoissonChart extends React.Component {
  constructor() {
    super();
    this.chart = null;
    am4core.options.commercialLicense = true;
    this.prevPerf = false;
  }

  componentDidMount() {
    this.createChart();
  }

  createData() {
    const lambda = this.props.lambda.stats;
    const samples = this.props.samples.poisson;
    let chart_data = randomDataGenerator({
      samples: samples,
      dependent: [
        {
          name: 'column-1',
          mean: lambda,
          rules: ['poisson', 'positive']
        },
        {
          name: 'column-3',
          mean: lambda,
          stDev: lambda,
          rules: ['uniform']
        }
      ]
    });
    let dummy = utils.createHistogram(chart_data);
    let data = [];
    /**
     * Converts to data object that is readable by amcharts and add analytical and CFD functions
     */
    Object.keys(dummy).forEach((item, index) => {
      let dataPoint = {};
      dataPoint['id'] = item;
      dataPoint['column-1'] = dummy[item]['column-1'];
      dataPoint['column-2'] = Math.round(utils.Poisson(lambda, parseInt(item, 10)) * samples);
      dataPoint['column-3'] = dummy[item]['column-3'];
      if (!data[0]) {
        dataPoint['column-4'] = dataPoint['column-2'];
      } else {
        dataPoint['column-4'] = data[index - 1]['column-4'] + dataPoint['column-2'];
      }
      data.push(dataPoint);
    });
    return data;
  }

  createChart() {
    /* Chart code */
    // Themes begin
    am4core.useTheme(dark);
    if (this.props.performanceChart.poisson) {
      am4core.unuseTheme(animated);
    } else {
      am4core.useTheme(animated);
    }
    // Themes end

    // Create chart instance
    this.chart = am4core.create(this.refs.poisson_chart, am4charts.XYChart);
    let chart = this.chart;
    chart.categoryField = 'category';

    // Add data
    chart.data = this.createData();

    // Create axes
    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.renderer.baseGrid.disabled = true;
    xAxis.id = 'xAxis';
    xAxis.dataFields.category = 'id';
    xAxis.renderer.grid.strokeDasharray = 3;

    let yAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis1.renderer.grid.strokeDasharray = 3;

    let colorSet = new am4core.ColorSet();
    let yAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis2.renderer.grid.template.disabled = true;
    yAxis2.renderer.line.strokeOpacity = 1;
    yAxis2.renderer.line.stroke = colorSet.getIndex(3);
    yAxis2.renderer.line.strokeWidth = 2;
    yAxis2.renderer.opposite = true;

    // Create series
    let poissonITS = chart.series.push(
      this.props.performanceChart.poisson ? new am4charts.StepLineSeries() : new am4charts.ColumnSeries()
    );
    poissonITS.name = 'Poisson (inverse transform sampling)';
    poissonITS.dataFields.valueY = 'column-1';
    poissonITS.dataFields.categoryX = 'id';
    poissonITS.strokeWidth = 1;
    poissonITS.fillOpacity = 1;
    poissonITS.tensionX = 1;
    if (!this.props.performanceChart.poisson) {
      poissonITS.columns.template.width = am4core.percent(80);
      poissonITS.fillOpacity = 0;
    }

    let poisson = chart.series.push(new am4charts.LineSeries());
    poisson.name = 'Poisson (analytical)';
    poisson.dataFields.valueY = 'column-2';
    poisson.dataFields.categoryX = 'id';
    poisson.strokeWidth = 1;
    poisson.tensionX = 1;

    let uniform = chart.series.push(new am4charts.LineSeries());
    uniform.name = 'Uniform';
    uniform.dataFields.valueY = 'column-3';
    uniform.dataFields.categoryX = 'id';
    uniform.strokeWidth = 1;
    uniform.tensionX = 1;
    uniform.hidden = true;

    let cfd = chart.series.push(new am4charts.LineSeries());
    cfd.name = 'CDF (analytical)';
    cfd.dataFields.valueY = 'column-4';
    cfd.dataFields.categoryX = 'id';
    cfd.strokeWidth = 1;
    cfd.tensionX = 1;
    cfd.yAxis = yAxis2;

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
    if (this.props.updateData.poisson) {
      if (this.props.performanceChart.poisson && this.prevPerf !== this.props.performanceChart.poisson) {
        am4core.options.queue = true;
        am4core.options.minPolylineStep = 5;
        this.prevPerf = !this.prevPerf;
        this.createChart();
      } else if (!this.props.performanceChart.poisson && this.prevPerf !== this.props.performanceChart.poisson) {
        am4core.options.queue = false;
        am4core.options.minPolylineStep = 0.5;
        this.prevPerf = !this.prevPerf;
        this.createChart();
      } else if (this.props.updateData.poisson) {
        this.chart.data = this.createData();
      }
      this.props.toggleUpdateData('poisson');
    }
    return (
      <CustomCard title={'Poisson Probability Distribution Histograms'} avatar={<BarChart />}>
        <div className={'stats__chart'} ref={'poisson_chart'} />
      </CustomCard>
    );
  }
}

function mapStateToProps(state) {
  return {
    mean: state.mean,
    lambda: state.lambda,
    stDev: state.stDev,
    samples: state.samples,
    updateData: state.updateData,
    performanceChart: state.performanceChart
  };
}

const mapDispatchToProps = {
  toggleUpdateData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PoissonChart);
