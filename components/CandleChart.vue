<template>
	<div class="ml-12 my-0 py-0">
		<div class="tools-container outline-none">
			<button
				class="ml-2 bg-gray-100 p-2 text-sm rounded"
				@click="disableZoom"
			>
				<img
					src="~/assets/img/icons/ic_hand.png"
					height="20"
					width="20"
				/>
			</button>
		</div>
		<div id="stock-container" style="height: 800px; width: 100%"></div>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import HighStock, { StockChart } from 'highcharts/highstock'
import IndicatorsAll from 'highcharts/indicators/indicators-all'
import DragPanes from 'highcharts/modules/drag-panes'
import Annotations from 'highcharts/modules/annotations-advanced'
import PriceIndicator from 'highcharts/modules/price-indicator'
import FullScreen from 'highcharts/modules/full-screen'
import StockTools from 'highcharts/modules/stock-tools'
//@ts-ignore
import Heikinashi from 'highcharts/modules/heikinashi'
//@ts-ignore
import Hollowcandlestick from 'highcharts/modules/hollowcandlestick'
import 'highcharts/css/stocktools/gui.css'
import 'highcharts/css/annotations/popup.css'
//@ts-ignore
import rightTri from '~/assets/img/right-triangle.png'
//@ts-ignore
import leftTri from '~/assets/img/left-triangle.png'

export type Data = {
	candleData: Array<any>
	tradeData: Array<any>
}

export default Vue.extend({
	data() {
		return {
			chart: {} as StockChart,
		}
	},
	props: {
		selectedRange: {
			type: Number,
			default: 0,
		},
		data: {
			type: Object,
			default: () => ({} as Data),
		} as PropOptions<Data>,
	},
	methods: {
		init() {
			StockTools(HighStock)
			IndicatorsAll(HighStock)
			PriceIndicator(HighStock)
			DragPanes(HighStock)
			Annotations(HighStock)
			FullScreen(HighStock)
			Heikinashi(HighStock)
			Hollowcandlestick(HighStock)
			let data = [...this.data.candleData]
			data.sort((a, b) => (a['timestamp'] >= b['timestamp'] ? 1 : -1))
			data = data.map((it) => [
				Number(it.timestamp),
				it.open,
				it.high,
				it.low,
				it.close,
			])

			const tdata = [...this.data.tradeData]
			tdata.sort((a, b) => (a['timestamp'] >= b['timestamp'] ? 1 : -1))
			const sellData = tdata
				.filter((it) => !it.buy)
				.map((it) => [Number(it.timestamp), it.price])

			const buyData = tdata
				.filter((it) => it.buy)
				.map((it) => [Number(it.timestamp), it.price])

			
			this.chart = HighStock.stockChart('stock-container', {
				chart: {
					panning: {
						enabled: true,
						type: 'xy',
					},
				},
				navigation: {
					bindingsClassName: 'tools-container',
				},
				time: {
					useUTC: false,
					timezone: 'IR',
				},
				xAxis: {
					endOnTick: false,
					startOnTick: false,
				},
				yAxis: [
					{
						labels: {
							align: 'left',
						},
						height: '80%',
						resize: {
							enabled: true,
						},
					},
					{
						labels: {
							align: 'left',
						},
						top: '80%',
						height: '20%',
						offset: 0,
					},
				],
				stockTools: {
					gui: {
						enabled: true,
					},
				},
				tooltip: {
					shape: 'square',
					headerShape: 'callout',
					borderWidth: 0,
					shadow: false,
					positioner: function (width, height, point) {
						let chart = this.chart,
							position

						if (point.isHeader) {
							position = {
								x: Math.max(
									// Left side limit
									chart.plotLeft,
									Math.min(
										point.plotX +
											chart.plotLeft -
											width / 2,
										// Right side limit
										chart.chartWidth - width - 2
									)
								),
								y: point.plotY,
							}
						} else {
							position = {
								x: point.series.chart.plotLeft,
								y: 0 - chart.plotTop,
							}
						}

						return position
					},
				},
				responsive: {
					rules: [
						{
							condition: {
								maxWidth: 800,
							},
							chartOptions: {
								rangeSelector: {
									inputEnabled: false,
								},
							},
						},
					],
				},
				rangeSelector: {
					buttons: [
						{
							type: 'second',
							// count: 400,
							text: '1s',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['second', [1]]],
							},
						},
						{
							type: 'second',
							// count: 400,
							text: '5s',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['second', [5]]],
							},
						},
						{
							type: 'second',
							// count: 400,
							text: '15s',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['second', [15]]],
							},
						},
						{
							type: 'second',
							// count: 400,
							text: '30s',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['second', [30]]],
							},
						},
						{
							type: 'minute',
							// count: 400,
							text: '1min',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['minute', [1]]],
							},
						},
						{
							type: 'minute',
							// count: 2000,
							text: '5min',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['minute', [5]]],
							},
						},
						{
							type: 'minute',
							// count: 6000,
							text: '15min',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['minute', [15]]],
							},
						},
						{
							type: 'minute',
							count: 1000,
							text: '30min',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['minute', [30]]],
							},
						},
						{
							type: 'minute',
							// count: 18000,
							text: '45min',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['minute', [45]]],
							},
						},
						{
							type: 'hour',
							// count: 30000,
							text: '1h',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['hour', [1]]],
							},
						},
						{
							type: 'hour',
							// count: 50000,
							text: '2h',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['hour', [2]]],
							},
						},
						{
							type: 'hour',
							// count: 70000,
							text: '3h',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['hour', [3]]],
							},
						},
						{
							type: 'hour',
							// count: 90000,
							text: '4h',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['hour', [4]]],
							},
						},
						{
							type: 'day',
							// count: 2000,
							text: '1d',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['day', [1]]],
							},
						},
						{
							type: 'week',
							// count: 200000,
							text: '1w',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['week', [1]]],
							},
						},
						{
							type: 'month',
							// count: 300000,
							text: '1m',
							preserveDataGrouping: true,
							dataGrouping: {
								forced: true,
								units: [['month', [1]]],
							},
						},
						{
							type: 'all',
							text: 'All',
						},
					],
					allButtonsEnabled: true,
					selected: 7,
				},
				navigator: {
					enabled: true,
				},
				credits: {
					enabled: false,
				},
				series: [
					{
						type: 'hollowcandlestick',
						name: 'Candlestick',
						id: 'candlestick',
						data,
					},
					{
						name: 'sell trade',
						id: 'sell-trade',
						data: sellData,
						lineWidth: 0,
						marker: {
							enabled: true,
							fillColor: '#8B0000',
							symbol: `url(${leftTri})`,
							marginRight: 4,
							width: 20,
							height: 20,
						},
						states: {
							hover: {
								lineWidthPlus: 0,
							},
						},
					},
					{
						name: 'buy trade',
						id: 'buy-trade',
						data: buyData,
						lineWidth: 0,
						marker: {
							enabled: true,
							fillColor: 'green',
							color: 'green',
							symbol: `url(${rightTri})`,
							width: 20,
							height: 20,
						},
						states: {
							hover: {
								lineWidthPlus: 0,
							},
						},
					},
					// {
					// 	type: 'flags',
					// 	name: 'buy trade',
					// 	id: 'buy-trade',
					// 	data: buyData.map((it) => ({y: it[1], title: ' '})),
					// 	onSeries: 'candlestick',
					// 	shape: `url(${rightTri})`,
					// 	fillColor: 'green',
					// 	color: 'green',
					// 	states: {
					// 		hover: {
					// 			fillColor: '#000',
					// 		},
					// 	},
					// 	y: 15,
					// 	width: 16,
					// },
				] as any[],
			})
		},
		disableZoom() {
			if (this.chart.options.chart) {
				this.chart.options.chart.zoomType = '' as any
			}
		},
	},
	watch: {
		data() {
			this.init()
		},
		selectedRange() {
			const t1: any = this.data.tradeData[this.selectedRange]
			const r = 1000000
			this.chart.xAxis[0].setExtremes(
				Number(t1.timestamp) - r,
				Number(t1.timestamp) + 6 * r
			)
			this.chart.xAxis[0].setExtremes(
				Number(t1.timestamp) - r,
				Number(t1.timestamp) + 2 * r
			)
		},
	},
	mounted() {
		if (this.data && this.data.candleData && this.data.tradeData)
			this.init()
	},
})
</script>