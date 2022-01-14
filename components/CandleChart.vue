<template>
	<div>
		<div class="ml-12 my-0 py-0">
			<input type="checkbox" name="comparison" v-model="comparison" />
			<label for="comparison">scale</label>
		</div>
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
			comparison: false,
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
		selectedRange: {
			type: Number,
			default: 0,
		},
	},
	methods: {
		initCandle() {
			if (this.candleSeries === null) {
				this.candleSeries = this.chart
					.plot(0)
					.candlestick(this.candleData)
				this.candleSeries.name('Candle Data')
				return
			}
			this.candleSeries.data(this.candleData)
		},
		initSellData() {
			const table = anychart.data.table()
			table.addData(this.sellData)
			const mapping = table.mapAs()
			mapping.addField('value', 1)
			if (this.sellSeries === null) {
				this.sellSeries = this.chart.plot(0).marker(mapping)
				this.sellSeries.name('Sell Data')
				this.sellSeries.type('circle')
				this.sellSeries.fill('#FFFFFF')
				this.sellSeries.stroke('#FF000F')
				this.sellSeries.size(3)
				this.sellSeries.tooltip().format(function (e: any) {
					return `Sell price: ${e.value || ''}`
				})
				return
			}
			this.sellSeries.data(mapping)
		},
		initBuyData() {
			const table = anychart.data.table()
			table.addData(this.buyData)
			const mapping = table.mapAs()
			mapping.addField('value', 1)
			if (this.buySeries === null) {
				this.buySeries = this.chart.plot(0).marker(mapping)
				this.buySeries.name('Buy Data')
				this.buySeries.type('circle')
				this.buySeries.fill('blue')
				this.buySeries.stroke('blue')
				this.buySeries.size(3)
				this.buySeries.tooltip().format(function (e: any) {
					return `Buy price: ${e.value || ''}`
				})
				return
			}
			this.buySeries.data(mapping)
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
		comparison() {
			this.chart
				.plot(0)
				.yScale()
				.comparisonMode(this.comparison ? 'value' : 'none')
		},
		selectedRange() {
			const r1 = this.selectedRange >= 20 ? this.selectedRange - 20 : 0
			const r2 =
				this.candleData.length - this.selectedRange >= 21
					? this.selectedRange + 20
					: this.candleData.length - 1
			const arr1: any[] = this.candleData[r1] as any[]
			const arr2: any[] = this.candleData[r2] as any[]

			this.chart.selectRange(arr1[0] + '', arr2[0] + '')
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

			// const rangePicker = anychart.ui.rangePicker()
			// const rangeSelector = anychart.ui.rangeSelector()
			// rangePicker.render(this.chart)
			// rangeSelector.render(this.chart)
			// this.chart.interactivity(true)
			// this.chart.plot(0).yScale().comparisonMode("percent")

			// draw the chart
			this.chart.draw()
		}
	},
})
</script>

<style >
</style>