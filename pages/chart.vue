<template>
	<div class="w-full h-full p-6">
		<CandleChart :candleData="candleData" />
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import CandleChart from '~/components/CandleChart.vue'
export default Vue.extend({
	components: {
		CandleChart,
	},
	data() {
		return {
			candleData: [] as any[],
			sellData: [] as any[],
			buyData: [] as any[],
		}
	},
	methods: {
		async getData() {
			try {
				const r = await this.$axios.get(this.$apiUrl.candleInfoUrl())
				const r2 = await this.$axios.get(this.$apiUrl.fastPaperUrl())
				this.candleData = (r.data.data as Array<any>).map((it: any) => [
					new Date(Number(it.timestamp) * 1000),
					it.open,
					it.high,
					it.low,
					it.close,
				])
				this.sellData = (r2.data.data as Array<any>)
					.filter((it) => !it.buy)
					.map((it) => [
						new Date(Number(it.timestamp) * 1000),
						it.price,
					])
				this.buyData = (r2.data.data as Array<any>)
					.filter((it) => it.buy)
					.map((it) => [
						new Date(Number(it.timestamp) * 1000),
						it.price,
					])
			} catch (e: any) {
				this.$toastErrors(this, e)
			}
		},
	},
	mounted() {
		this.getData()
	},
})
</script>