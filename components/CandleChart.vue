<template>
	<div class="ml-12 my-0 py-0">
		<div id="stock-container" style="height: 800px; width: 100%"></div>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import HighStock, { StockChart } from 'highcharts/highstock'

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
			const data = [...this.data.candleData].reverse()
			const sellData = this.data.tradeData
				.filter((it) => !it.buy)
				.map((it) => [Number(it.timestamp) * 1000, it.price])

			const buyData = this.data.tradeData
				.filter((it) => it.buy)
				.map((it) => [Number(it.timestamp) * 1000, it.price])

			this.chart = HighStock.stockChart('stock-container', {
				// rangeSelector: {
				// 	buttons: [
				// 		{
				// 			type: 'minute',
				// 			count: 1000,
				// 			text: '1min',
				// 		},
				// 		{
				// 			type: 'day',
				// 			count: 1,
				// 			text: '1D',
				// 		},
				// 		{
				// 			type: 'all',
				// 			count: 1,
				// 			text: 'All',
				// 		},
				// 	],
				// 	selected: 0,
				// },
				navigator: {
					enabled: true,
				},
				series: [
					{
						type: 'candlestick',
						name: 'Candlestick',
						data,
					},
					{
						name: 'sell trade',
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
			})
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
				Number(t1.timestamp) * 1000 - r,
				Number(t1.timestamp) * 1000 + r
			)
		},
	},
	mounted() {
		if (this.data && this.data.candleData && this.data.tradeData)
			this.init()
	},
})
</script>