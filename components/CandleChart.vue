<template>
	<div>
		<div id="candle" style="height: 800px; width: 100%"></div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
const anychart = process.client
	? require('~/assets/js/anychart-core.min.js')
	: ({} as any)
const anychartStock = process.client
	? require('~/assets/js/anychart-stock.min.js')
	: ({} as any)

export default Vue.extend({
	data() {
		return {
			chart: null as any,
			candleSeries: null as any,
			sellSeries: null as any,
			buySeries: null as any,
		}
	},
	props: {
		candleData: {
			type: Array,
			default: () => [],
		},
		sellData: {
			type: Array,
			default: () => [],
		},
		buyData: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		initCandle() {
			this.candleSeries = this.chart.plot(0).candlestick(this.candleData)
			this.candleSeries.name('Candle Data')
		},
		initSellData() {
			const table = anychart.data.table()
			table.addData(this.sellData)
			const mapping = table.mapAs()
			mapping.addField('value', 1)
			this.sellSeries = this.chart.plot(0).marker(mapping)
			this.sellSeries.name('Sell Data')
			this.sellSeries.type('circle')
			this.sellSeries.fill('darkened')
			this.sellSeries.stroke('darkened')
			this.sellSeries.size(2)
			this.sellSeries.tooltip().format(function (e: any) {
				return `Sell price: ${e.value || ''}`
			})
		},
		initBuyData() {
			const table = anychart.data.table()
			table.addData(this.buyData)
			const mapping = table.mapAs()
			mapping.addField('value', 1)
			this.buySeries = this.chart.plot(0).marker(mapping)
			this.buySeries.name('Buy Data')
			this.buySeries.type('circle')
			this.buySeries.fill('blue')
			this.buySeries.stroke('blue')
			this.buySeries.size(2)
			this.buySeries.tooltip().format(function (e: any) {
				return `Buy price: ${e.value || ''}`
			})
		},
	},
	watch: {
		candleData() {
			this.initCandle()
		},
		sellData() {
			this.initSellData()
		},
		buyData() {
			this.initBuyData()
		},
	},
	mounted() {
		if (!this.chart) {
			this.chart = anychart.stock()
			// set the chart title
			this.chart.title('Data')

			// set the container id
			this.chart.container('candle')

			if (this.candleData.length) this.initCandle()
			if (this.sellData.length) this.initSellData()
			if (this.buyData.length) this.initBuyData()

			this.chart.interactivity(true)
			this.chart.plot(0).yScale().comparisonMode("value")

			// draw the chart
			this.chart.draw()
		}
	},
})
</script>

<style >
</style>