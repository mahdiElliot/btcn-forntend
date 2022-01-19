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
			sellData: [] as any[],
			buyData: [] as any[],
		}
	},
	props: {
		candleData: {
			type: Array,
			default: () => [],
		},
		tradeData: {
			type: Array,
			default: () => [] as any[],
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
		initTradeData() {
			this.sellData = this.tradeData
				.filter((it) => !it.buy)
				.map((it) => [new Date(Number(it.timestamp) * 1000), it.price])

			this.buyData = this.tradeData
				.filter((it) => it.buy)
				.map((it) => [new Date(Number(it.timestamp) * 1000), it.price])
			this.initSellData()
			this.initBuyData()
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
				this.sellSeries.fill('red')
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
		tradeData() {
			this.initTradeData()
		},
		comparison() {
			this.chart
				.plot(0)
				.yScale()
				.comparisonMode(this.comparison ? 'value' : 'none')
		},
		selectedRange() {
			const t1: any = this.tradeData[this.selectedRange]
			const r = 1000000
			this.chart.selectRange(
				new Date(Number(t1.timestamp) * 1000 - r),
				new Date(Number(t1.timestamp) * 1000 + r)
			)
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
			if (this.tradeData.length) this.initTradeData()
			// this.chart.plot(0).yScale().stackMode('percent')
			// this.chart.plot(0).yScale().ticks().interval(0.0000001)
			// this.chart.plot(0).yScale().minorTicks().interval(0.0000001)
			// draw the chart
			this.chart.draw()
		}
	},
})
</script>

<style >
</style>