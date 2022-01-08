<template>
	<client-only>
		<apexchart
			height="500"
			type="candlestick"
			:options="chartOptions"
			:series="series"
		></apexchart>
	</client-only>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		data: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			series: [{ data: [] }] as any[],
			chartOptions: {
				title: {
					text: 'CandleStick Chart',
					align: 'left',
				},
				xaxis: {
					type: 'datetime',
				},
				yaxis: {
					tooltip: {
						enabled: true,
					},
				},
			},
		}
	},
	watch: {
		data() {
            this.series = [{ data: this.data }]
		},
	},
	mounted() {
		if (this.data.length) this.series = [{ data: this.data }]
	},
})
</script>