import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import dark from '@amcharts/amcharts4/themes/dark';
import animated from '@amcharts/amcharts4/themes/animated';
import randomDataGenerator from './randomDataGenerator';
import * as utils from './utils';

export default class Stats extends React.Component {
  constructor() {
    super();
    this.chart = null;
    am4core.options.commercialLicense = true;
  }

  componentDidMount() {
    this.createChart();
  }

  createData () {
    const samples = 1000000;
    const mean = 1000;
    const st_div = 20;
    let chart_data = randomDataGenerator({
      timeRange: samples,
      variance_divisor: mean / st_div,
      isStatic: true,
      independent: 'ID',
      rules: ['positive'],
      dependent: [
        {name: 'column-1', typical: mean, rules: []},
        {name: 'column-3', typical: mean, rules: ['uniform']}
      ]
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
    let chart = am4core.create(this.refs.chart, am4charts.XYChart);
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
    yAxis2.renderer.line.stroke =  am4core.color("#FF0000");
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
    normalBM.stroke =  am4core.color("#FF8000");

    let normal = chart.series.push(new am4charts.LineSeries());
    normal.name = 'Normal (analytical)';
    normal.dataFields.valueY = 'column-2';
    normal.dataFields.categoryX = 'ID';
    normal.strokeWidth = 1;
    normal.tensionX = 1;
    normal.stroke =  am4core.color("#00FF00");

    let uniform = chart.series.push(new am4charts.LineSeries());
    uniform.name = 'Uniform';
    uniform.dataFields.valueY = 'column-3';
    uniform.dataFields.categoryX = 'ID';
    uniform.strokeWidth = 1;
    uniform.tensionX = 1;
    uniform.stroke =  am4core.color("#00BFFF");

    let cfdBM = chart.series.push(new am4charts.LineSeries());
    cfdBM.name = 'CDF (Box-Muller)';
    cfdBM.dataFields.valueY = 'column-4';
    cfdBM.dataFields.categoryX = 'ID';
    cfdBM.strokeWidth = 1;
    cfdBM.tensionX = 1;
    cfdBM.yAxis = yAxis2;
    cfdBM.stroke =  am4core.color("#FF0000");


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
      <div>
        <div className={'config-container'}>
          <button>Hello</button>
        </div>
        <div className='chart' ref={'chart'} />
      </div>
    )
  }
}
