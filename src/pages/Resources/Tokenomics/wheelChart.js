import Chart from "chart.js";
import _ from "lodash";
import { bindChartEvents, chartConfig } from "./configChart";
import listWheel from "./data/listWheel.json";

const renderChart = () => {
  const chartSelector = "[data-results-chart]";
  const chartLegendSelector = "[data-results-chart-legends]";

  let chartEl;
  let chartLegendEL;
  let myChart;

  chartEl = document.querySelector(chartSelector);
  chartLegendEL = document.querySelector(chartLegendSelector);

  const dataItems = [];
  const labels = [];
  const background = [];
  const sortDataItems = _.sortBy(listWheel, (e) => {
    return e.percent;
  });
  if (sortDataItems != null) {
    sortDataItems.map((item) => {
      dataItems.push(item.percent);
      labels.push(item.name);
      background.push(item.background);
    });
  }
  const ctx = chartEl.getContext("2d");
  myChart = new Chart(ctx, chartConfig({ dataItems, labels, background }));
  chartLegendEL.innerHTML = myChart.generateLegend();
  bindChartEvents(myChart, document);
};
export { renderChart };
