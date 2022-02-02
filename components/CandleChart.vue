<template>
	<div class="ml-12 my-0 py-0">
		<div class="tools-container outline-none">
			<button
				class="ml-2 bg-gray-100 p-2 text-sm rounded"
				@click="disableZoom"
			>
				<img src="~/assets/img/icons/ic_hand.png" height="20" width="20">
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

export type Data = {
	candleData: Array<Array<number>>
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
			const data = [...this.data.candleData].reverse()
			const sellData = this.data.tradeData
				.filter((it) => !it.buy)
				.map((it) => [Number(it.timestamp) * 1000, it.price])

			const buyData = this.data.tradeData
				.filter((it) => it.buy)
				.map((it) => [Number(it.timestamp) * 1000, it.price])

			this.chart = HighStock.stockChart(
				'stock-container',
				{
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
						split: true,
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
								type: 'minute',
								count: 100,
								text: '1min',
							},
							{
								type: 'minute',
								count: 1000,
								text: '5min',
							},
							{
								type: 'minute',
								count: 2000,
								text: '10min',
							},
							{
								type: 'minute',
								count: 10000,
								text: '15min',
							},
							{
								type: 'all',
								text: 'All',
							},
						],
						allButtonsEnabled: true,
						selected: 0,
					},
					navigator: {
						enabled: true,
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
								radius: 5,
								fillColor: 'red',
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
								radius: 5,
								fillColor: 'blue',
								symbol: 'square',
							},
							states: {
								hover: {
									lineWidthPlus: 0,
								},
							},
						},
					] as any[],
				},
				(chart) => {
					HighStock.addEvent(
						chart.container,
						'wheel',
						(event: any) => {
							// if (event.deltaY > 0) {
							// 	chart.xAxis[0].setExtremes(0, 23)
							// } else if (event.deltaY < 0) {
							// 	chart.xAxis[0].setExtremes(5, 10)
							// }
							// // prevent page scroll
							// event.preventDefault && event.preventDefault()
						}
					)
				}
			)
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
			console.log(new Date(Number(t1.timestamp) * 1000))
			this.chart.xAxis[0].setExtremes(
				Number(t1.timestamp) * 1000 - r,
				Number(t1.timestamp) * 1000 + 6 * r
			)
			this.chart.xAxis[0].setExtremes(
				Number(t1.timestamp) * 1000 - r,
				Number(t1.timestamp) * 1000 + 2 * r
			)
		},
	},
	mounted() {
		if (this.data && this.data.candleData && this.data.tradeData)
			this.init()
	},
})
</script>