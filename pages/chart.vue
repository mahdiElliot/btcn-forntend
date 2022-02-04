<template>
	<div class="w-full h-full p-6 py-12">
		<CandleChart :data="data" :clickedTimestamp="clickedTimestamp"/>
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

		<Table
			class="mt-6 mx-2"
			:data="tableData"
			@clicked="itemClicked"
			@sort="sort"
			:heads="tableHeads"
		/>
		<Pagination
			class="mt-6"
			:listSize="total"
			:eachRowNumbers="rowsListNumber"
			@paginate="paginate"
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
			clickedTimestamp: 1,
			tradeClicked: 'buy',
			loading: true,
			// startDate: '2022-01-07T09:00',
			// endDate: '2022-01-09T06:15',
			startDate: '2020-04-18T07:00',
			endDate: '2020-04-19T12:00',
			tableData: [] as any,
			totalTableData: [] as any[],
			fixedTableData: [] as any[],
			tableHeads: ['timestamp', 'price', 'type'] as Array<string>,
		}
	},
	methods: {
		async getCandleData() {
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

				this.fixedTableData = (r2.data.data as Array<any>).map(
					(it) => ({ ...it, timestamp: Number(it.timestamp) * 1000 })
				)

				this.totalTableData = [...this.fixedTableData]

				this.sort('timestamp', true)

				const tradeData = (r2.data.data as Array<any>).map(
					(it: any) => ({
						...it,
						timestamp: Number(it.timestamp) * 1000,
					})
				)
				const candleData = (r.data.data as Array<any>).map(
					(it: any) => ({
						...it,
						timestamp: Number(it.timestamp) * 1000,
					})
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
		async getTradeData() {
			this.loading = true
			try {
				const startDate = Date.parse(this.startDate)
				const endDate = Date.parse(this.endDate)
				const r = await this.$axios.get(
					this.$apiUrl.tradeUrl(startDate, endDate)
				)
				const candleData = r.data.data
				const tradeData = (r.data.data as Array<any>)
					.filter((it) => it.buy || it.sell)
					.map((it) => ({
						timestamp: Number(it.timestamp),
						price: it.open,
						buy: it.buy,
					}))
				this.data = {
					candleData,
					tradeData,
				}

				this.total = tradeData.length
				this.fixedTableData = (r.data.data as Array<any>)
					.filter((it) => it.buy || it.sell)
					.map((it) => ({
						...it,
						timestamp: Number(it.timestamp),
						buy: it.buy,
					}))

				this.totalTableData = [...this.fixedTableData]
				this.tableHeads = [
					'timestamp',
					'open',
					'high',
					'low',
					'close',
					'volume_btc',
					'volume_usdt',
					'slowk',
					'slowd',
					'k',
					'j',
					'd',
					'profit',
					'profit_percent',
					'type',
				]
				this.sort('timestamp', true)
			} catch (e: any) {
				this.$toastErrors(this, e)
			} finally {
				this.loading = false
			}
		},
		itemClicked(timestamp: string) {
			this.clickedTimestamp = Number(timestamp)
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
		},
		paginate(page: number) {
			this.page = page
			// this.tableData = [
			// 	...this.totalTableData
			// 		.map((it: any) => [
			// 			new Date(it.timestamp),
			// 			it.price,
			// 			it.buy ? 'buy' : 'sell',
			// 		])
			// 		.slice(
			// 			this.rowsListNumber * (this.page - 1),
			// 			this.page * this.rowsListNumber - 1
			// 		),
			// ]
			this.tableData = [
				...this.totalTableData
					.map((it: any) => [
						new Date(it.timestamp),
						it.open,
						it.high,
						it.low,
						it.close,
						it.volume_btc,
						it.volume_usdt,
						it.slowk,
						it.slowd,
						it.k,
						it.j,
						it.d,
						it.profit,
						it.profit_percent,
						it.buy ? 'buy' : 'sell',
					])
					.slice(
						this.rowsListNumber * (this.page - 1),
						this.page * this.rowsListNumber - 1
					),
			]
		},
		submitDate() {
			// this.getCandleData()
			this.getTradeData()
		},
		sort(s: string, asc: boolean) {
			if (s === 'type') s = 'buy'
			const ret = asc ? 1 : -1
			this.totalTableData.sort((a: any, b: any) =>
				a[s] >= b[s] ? ret : -ret
			)
			this.paginate(this.page)
		},
	},
	mounted() {
		// this.getCandleData()
		this.getTradeData()
	},
	head() {
		return {
			title: 'big data finance',
		}
	},
})
</script>

<style lang="postcss" scoped>
input {
	@apply outline-none border border-border-2-light p-2;
}
</style>