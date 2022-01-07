<template>
	<div class="w-full h-full p-12">
		<CandleChart :data="data" />
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import CandleChart from '~/components/CandleChart.vue'
const x = 1
export default Vue.extend({
	components: {
		CandleChart,
	},
	data() {
		return {
			data: [] as any[],
		}
	},
	methods: {
		getData() {
			this.$axios
				.get(this.$apiUrl.candleInfoUrl())
				.then((r) => {
					this.data = (r.data as Array<any>).map((it: any) => ({
						x: new Date(Number(it.timestamp) * 1000),
						y: [it.open, it.high, it.low, it.close],
					}))
				})
				.catch((e) => {
					this.$toastErrors(this, e)
				})
		},
	},
	mounted() {
		this.getData()
	},
})
</script>