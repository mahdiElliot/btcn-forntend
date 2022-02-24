<template>
	<div class="ml-12 my-0 py-0">
		<div class="tools-container outline-none">
			<button
				class="zoom-disable"
				@click="disableZoom"
				v-if="data.candleData"
			>
				<img
					src="~/assets/img/icons/ic_hand.png"
					height="20"
					width="20"
				/>
			</button>
			<button
				class="p-1 px-2 text-sm rounded bg-option -my-1"
				@click="zoomIn"
				v-if="data.candleData"
			>
				+
			</button>
			<button
				class="p-1 px-2 text-sm rounded bg-option -my-1"
				@click="zoomOut"
				v-if="data.candleData"
			>
				-
			</button>
		</div>
		<div id="stock-container" style="height: 800px; width: 100%"></div>
		<div v-if="data.candleData" class="ml-2">
			<div
				class="ml-2 mb-1 z-2"
				@click="indicatorsVisible = !indicatorsVisible"
			>
				<span class="cursor-pointer p-1 rounded bg-option">
					{{ indicatorsVisible ? '&#8964;' : '&#8963;' }}
				</span>
			</div>
			<transition name="show-ind">
				<div v-if="indicatorsVisible" class="mt-1 flex text-xs z-1">
					<span
						v-for="i in allIndicators"
						:key="i"
						class="indicator ml-2"
						:class="[
							chosenIndicators.includes(i)
								? 'bg-option-hover'
								: 'bg-option',
						]"
						@click="addIndicator(i)"
						>{{ i }}</span
					>
				</div>
			</transition>
		</div>
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

const colors = [
	'blue',
	'orange',
	'#e91e63',
	'#9c27b0',
	'gray',
	'black',
	'#2196f3',
	'yellow',
	'red',
	'#009688',
	'#4caf50',
	'#8bc34a',
	'#cddc39',
	'#008000',
	'#ff5722',
	'#795548',
	'#ff94cb',
]
let iColor = 0
const getColor = () => {
	const c = colors[iColor]
	iColor = (iColor + 1) % colors.length
	return c
}

const convertToMinute = (d: string, n: number) => {
	const dc: any = {
		minute: n,
		hour: n * 60,
		day: n * 1440,
		month: n * 43200,
		year: n * 518400,
	}
	return dc[d]
}

//timestamp minute = 6000
const MINUTE = 60000
const ZOOM = 3 * MINUTE

export default Vue.extend({
	data() {
		return {
			chart: {} as StockChart,
			chosenIndicators: [] as string[],
			indicatorsVisible: true,
		}
	},
	props: {
		clickedTimestamp: {
			type: Number,
			default: 1,
		},
		clickedTrade: {
			type: String,
			default: '',
		},
		data: {
			type: Object,
			default: () => ({} as Data),
		} as PropOptions<Data>,
		indicators: {
			type: Array,
			default: () => [],
		} as PropOptions<string[]>,
		secondIndicators: {
			type: Array,
			default: () => [],
		} as PropOptions<string[]>,
		candleNumber: {
			type: Number,
			default: 100,
		},
	},
	computed: {
		allIndicators(): string[] {
			return [...this.indicators, ...this.secondIndicators]
		},
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

			this.chart = HighStock.stockChart(
				'stock-container',
				{
					chart: {
						panning: {
							enabled: true,
							type: 'x',
						},
					},
					navigation: {
						bindingsClassName: 'tools-container',
					},
					mapNavigation: {
						enableMouseWheelZoom: true,
					},
					// time: {
					// 	useUTC: false,
					// 	timezone: 'IR',
					// },
					xAxis: {},
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
							buttons: [
								'indicators',
								'separator',
								'simpleShapes',
								'lines',
								'measure',
								'advanced',
								'verticalLabels',
								'flags',
								'separator',
								'zoomChange',
								'fullScreen',
								'separator',
								'currentPriceIndicator',
								'saveChart',
							],
						},
					},
					plotOptions: {
						series: {
							states: {
								inactive: {
									enabled: false,
								},
							},
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
									x: point.series
										? point.series.chart.plotLeft
										: 0,
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
								type: 'minute',
								count: 100,
								text: '1min',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['minute', [1]]],
								},
							},
							{
								type: 'minute',
								count: 200,
								text: '5min',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['minute', [5]]],
								},
							},
							{
								type: 'minute',
								count: 400,
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
								count: 500,
								text: '45min',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['minute', [45]]],
								},
							},
							{
								type: 'hour',
								count: 50,
								text: '1h',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['hour', [1]]],
								},
							},
							{
								type: 'hour',
								count: 50,
								text: '2h',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['hour', [2]]],
								},
							},
							{
								type: 'hour',
								count: 50,
								text: '3h',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['hour', [3]]],
								},
							},
							{
								type: 'hour',
								count: 50,
								text: '4h',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['hour', [4]]],
								},
							},
							{
								type: 'day',
								// count: 10,
								text: '1d',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['day', [1]]],
								},
							},
							{
								type: 'week',
								// count: 10,
								text: '1w',
								preserveDataGrouping: true,
								dataGrouping: {
									forced: true,
									units: [['week', [1]]],
								},
							},
							{
								type: 'month',
								// count: 10,
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
						selected: 1,
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
							color: '#8B0000',
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
							color: 'green',
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
					] as any[],
				},
				(chart) => {
					HighStock.addEvent(
						chart.container,
						'wheel',
						(event: any) => {
							if (event.deltaY > 0) this.zoomOut()
							else if (event.deltaY < 0) this.zoomIn()

							event.preventDefault && event.preventDefault()
						}
					)
				}
			)
			this.chart.xAxis[0].setExtremes(
				data[1][0],
				data[Math.floor(data.length / 110) + 1][0]
			)
		},
		zoomOut() {
			const min = this.chart.xAxis[0].getExtremes().min,
				max = this.chart.xAxis[0].getExtremes().max
			this.chart.xAxis[0].setExtremes(min - ZOOM, max + ZOOM)
		},
		zoomIn() {
			const min = this.chart.xAxis[0].getExtremes().min,
				max = this.chart.xAxis[0].getExtremes().max
			this.chart.xAxis[0].setExtremes(min + ZOOM, max - ZOOM)
		},
		disableZoom() {
			if (this.chart.options.chart) {
				this.chart.options.chart.zoomType = '' as any
			}
		},
		addIndicator(name: any) {
			const index = this.chosenIndicators.findIndex((it) => it === name)
			if (index !== -1) {
				this.chosenIndicators.splice(index, 1)
				this.chart.get(name)?.remove()
				return
			}
			this.chosenIndicators.push(name)

			const tdata = [...this.data.tradeData]
			tdata.sort((a, b) => (a['timestamp'] >= b['timestamp'] ? 1 : -1))
			const data = tdata.map((it) => [Number(it.timestamp), it[name]])

			const color = getColor()
			this.chart.addSeries(
				{
					type: 'line',
					name,
					id: name,
					zIndex: 1,
					color,
					data,
					marker: {
						enabled: true,
						fillColor: color,
						color: color,
						symbol: 'circle',
					},
					yAxis: this.secondIndicators.includes(name) ? 1 : 0,
				},
				true
			)
		},
	},
	watch: {
		data() {
			this.init()
		},
		clickedTimestamp() {
			let m = this.candleNumber

			if (
				this.chart.options.rangeSelector &&
				this.chart.options.rangeSelector.buttons &&
				this.chart.options.rangeSelector.selected
			) {
				const t =
					this.chart.options.rangeSelector.buttons[
						this.chart.options.rangeSelector.selected
					]
				const units =
					t.dataGrouping && t.dataGrouping.units
						? t.dataGrouping.units
						: [['minute', [1]]]

				const n = units[0][1] ? units[0][1][0] : 1
				const minute = convertToMinute(
					units[0][0] as string,
					n as number
				)
				m = this.candleNumber * minute
			}
			// const r = 10000000 * 5
			// this.chart.xAxis[0].setExtremes(
			// 	this.clickedTimestamp - r,
			// 	this.clickedTimestamp + r
			// )

			this.chart.xAxis[0].setExtremes(
				this.clickedTimestamp - Math.floor(m / 2) * MINUTE,
				this.clickedTimestamp + Math.floor(m / 2) * MINUTE
			)

			if (this.chart.get('flag')) this.chart.get('flag')?.remove()

			this.chart.addSeries(
				{
					type: 'flags',
					name: 'flag',
					id: 'flag',
					y: -100,
					zIndex: 1,
					color: 'black',
					fillColor: 'black',
					// width: 52,
					style: {
						color: 'white',
						fontSize: '16px',
					},
					states: {
						hover: {
							fillColor: 'black',
						},
					},
					shape: 'callout' as any,
					onSeries: `${this.clickedTrade}-trade`,
					data: [
						{
							x: this.clickedTimestamp,
							title: `price - ${this.clickedTrade}`,
						},
					],
				},
				true
			)
		},
	},
	mounted() {
		if (this.data && this.data.candleData && this.data.tradeData)
			this.init()
	},
})
</script>

<style lang="postcss" scoped>
.bg-option {
	background: #f7f7f7;
}
.bg-option:hover {
	background: #e2e8f0;
}
.bg-option-hover {
	background: #e2e8f0;
}

.indicator {
	@apply p-2 cursor-pointer rounded;
}

.zoom-disable {
	@apply ml-2 p-2 text-sm rounded bg-option;
}
.zoom-disable:hover {
	@apply bg-option-hover;
}

.show-ind-enter,
.show-ind-leave-active {
	transform: translateY(-20px);
	overflow: hidden;
}

.show-ind-enter-active {
	transition: all 0.3s ease-in;
}

.show-ind-leave-active {
	transition: all 0.3s ease-out;
}
</style>