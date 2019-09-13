import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import dark from '@amcharts/amcharts4/themes/dark';
import animated from '@amcharts/amcharts4/themes/animated';
import randomDataGenerator from './randomDataGenerator';
import * as utils from './utils';

export default class SpikeTrain extends React.Component {
  constructor() {
    super();
    this.chart = null;
    am4core.options.commercialLicense = true;
  }

  componentDidMount() {
    this.createChart();
  }

  createData() {
    const samples = 100;
    const mean = 10;
    const st_div = 2;
    let chart_data = randomDataGenerator({
      timeRange: samples,
      variance_divisor: mean / st_div,
      isStatic: true,
      independent: 'ID',
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
    xAxis.dataFields.category = 'ID';
    xAxis.renderer.grid.strokeDasharray = 3;

    let yAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis1.renderer.grid.strokeDasharray = 3;

    // Create series
    let spikes = chart.series.push(new am4charts.ColumnSeries());
    spikes.name = 'Spike Train';
    spikes.dataFields.valueY = 'column-1';
    spikes.dataFields.categoryX = 'ID';
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
      <div>
        <div className="chart" ref={'chart'} />
      </div>
    );
  }
}
