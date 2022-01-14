<template>
	<div class="w-full h-full p-6 py-12">
		<CandleChart
			:candleData="candleData"
			:sellData="sellData"
			:buyData="buyData"
			:selectedRange="selectedRange"
		/>
		<div class="flex w-full my-4 justify-center items-center">
			<div>
				<label for="startdate">{{ $en.start_date() }}:</label>
				<input
					type="datetime-local"
					id="meeting-time"
					name="start-date"
					v-model="startDate"
					min="2020-01-01T00:00"
				/>
			</div>
			<div class="ml-2">
				<label for="enddate">{{ $en.end_date() }}:</label>
				<input
					type="datetime-local"
					name="enddate"
					v-model="endDate"
					min="2020-01-01T00:00"
				/>
			</div>
			<button
				@click="submitDate"
				class="ml-2 py-1 px-6 rounded-lg bg-primary text-white"
			>
				{{ $en.submit() }}
			</button>
		</div>
		<Pagination
			class="mt-6"
			:listSize="total"
			:eachRowNumbers="rowsListNumber"
			@paginate="paginate"
		/>
		<Table class="mt-6 mx-2" :data="tableData" @clicked="itemClicked" />
		<Loader v-if="loading" />
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import CandleChart from '~/components/CandleChart.vue'
import Table from '~/components/Table.vue'
import Pagination from '~/components/utils/Pagination.vue'
import Loader from '~/components/utils/Loader.vue'
export default Vue.extend({
	components: {
		Table,
		CandleChart,
		Pagination,
		Loader,
	},
	data() {
		return {
			candleData: [] as any[],
			sellData: [] as any[],
			buyData: [] as any[],
			tableData: [] as any,
			total: 0,
			rowsListNumber: 100,
			rowsListNumber2: 35,
			page: 1,
			selectedRange: 20,
			loading: true,
			startDate: '2022-01-12T09:00',
			endDate: '2022-01-14T06:15',
			totalTableData: [] as any[]
		}
	},
	methods: {
		async getData() {
			this.loading = true
			try {
				const startDate = Date.parse(this.startDate) / 1000
				const endDate = Date.parse(this.endDate) / 1000
				const r = await this.$axios.get(
					this.$apiUrl.candleInfoUrl(startDate, endDate)
				)
				const r2 = await this.$axios.get(
					this.$apiUrl.fastPaperUrl(startDate, endDate)
				)
				this.total = r.data.total
				this.candleData = (r.data.data as Array<any>).map((it: any) => [
					new Date(Number(it.timestamp) * 1000),
					it.open,
					it.high,
					it.low,
					it.close,
				])
				this.totalTableData = r.data.data
				this.tableData = (r.data.data as Array<any>)
					.map((it: any) => [
						new Date(Number(it.timestamp) * 1000),
						it.open,
						it.close,
						it.low,
						it.high,
						it.volume.toFixed(4),
						it.usdvol.toFixed(4),
					])
					.slice(
						this.rowsListNumber * (this.page - 1),
						this.page * this.rowsListNumber - 1
					)
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
			} finally {
				this.loading = false
			}
		},
		itemClicked(i: number) {
			this.selectedRange = i
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
		},
		paginate(page: number) {
			this.page = page
			this.tableData = [
				...this.totalTableData.slice(
					this.rowsListNumber * (this.page - 1),
					this.page * this.rowsListNumber - 1
				),
			]
		},
		submitDate() {
			this.getData()
		},
	},
	mounted() {
		this.getData()
	},
})
</script>

<style lang="postcss" scoped>
input {
	@apply outline-none border border-border-2-light p-2;
}
</style>