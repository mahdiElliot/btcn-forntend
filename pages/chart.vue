<template>
	<div class="w-full h-full p-6 py-12">
		<CandleChart :data="data" :selectedRange="selectedRange" />
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
		<Table
			class="mt-6 mx-2"
			:data="tableData"
			@clicked="itemClicked"
			@sort="sort"
		/>
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
			data: {} as any,
			total: 0,
			rowsListNumber: 30,
			rowsListNumber2: 35,
			page: 1,
			selectedRange: 20,
			tradeClicked: 'buy',
			loading: true,
			startDate: '2022-01-07T09:00',
			endDate: '2022-01-09T06:15',
			tableData: [] as any,
			totalTableData: [] as any[],
			fixedTableData: [] as any[],
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

				this.total = r2.data.total

				this.fixedTableData = r2.data.data.reverse()

				this.totalTableData = [...this.fixedTableData]

				this.tableData = (r2.data.data as Array<any>)
					.map((it: any) => [
						new Date(Number(it.timestamp) * 1000),
						it.price,
						it.buy ? 'buy' : 'sell',
					])
					.slice(
						this.rowsListNumber * (this.page - 1),
						this.page * this.rowsListNumber - 1
					)

				const tradeData = r2.data.data
				const candleData = (r.data.data as Array<any>).map(
					(it: any) => [
						Number(it.timestamp) * 1000,
						it.open,
						it.high,
						it.low,
						it.close,
					]
				)

				this.data = {
					candleData,
					tradeData,
				}
			} catch (e: any) {
				this.$toastErrors(this, e)
			} finally {
				this.loading = false
			}
		},
		itemClicked(timestamp: string) {
			const i =
				this.fixedTableData.findIndex(
					(it) => Number(it.timestamp) * 1000 === Date.parse(timestamp)
				) || -1
			if (i === -1) return
			this.selectedRange = i + this.rowsListNumber * (this.page - 1)
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
		},
		paginate(page: number) {
			this.page = page
			this.tableData = [
				...this.totalTableData
					.map((it: any) => [
						new Date(Number(it.timestamp) * 1000),
						it.price,
						it.buy ? 'buy' : 'sell',
					])
					.slice(
						this.rowsListNumber * (this.page - 1),
						this.page * this.rowsListNumber - 1
					),
			]
		},
		submitDate() {
			this.getData()
		},
		sort(s: string) {
			if (s === 'type') s = 'buy'
			this.totalTableData.sort((a: any, b: any) =>
				a[s] >= b[s] ? 1 : -1
			)
			this.paginate(this.page)
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