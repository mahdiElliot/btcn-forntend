<template>
	<div class="w-full h-full p-6 py-12">
		<CandleChart
			:data="data"
			:clickedTimestamp="clickedTimestamp"
			:clickedTrade="tradeClicked"
			:indicators="indicators"
			:secondIndicators="secondChartIndicators"
			:candleNumber="100"
		/>
		<div class="flex w-full my-4 justify-center items-center">
			<div>
				<label for="startdate">{{ $en.start_date() }}:</label>
				<input
					type="datetime-local"
					id="meeting-time"
					name="start-date"
					v-model="startDate"
					min="2018-01-01T00:00"
				/>
			</div>
			<div class="ml-2">
				<label for="enddate">{{ $en.end_date() }}:</label>
				<input
					type="datetime-local"
					name="enddate"
					v-model="endDate"
					min="2018-01-01T00:00"
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
			:indicators="indicators"
			:secondIndicators="secondChartIndicators"
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
			startDate: '',
			endDate: '',
			tableData: [] as any,
			totalTableData: [] as any[],
			fixedTableData: [] as any[],
			tableHeads: ['timestamp', 'price', 'type'] as Array<string>,
			indicators: [] as string[],
			secondChartIndicators: [] as string[],
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
		async setTableData(r: any) {
			this.total = this.data.tradeData.length
			this.fixedTableData = (r.data.data as Array<any>)
				.filter((it) => it.buy || it.sell)
				.map((it) => ({
					...it,
					timestamp: Number(it.timestamp),
					buy: it.buy,
				}))

			this.totalTableData = [...this.fixedTableData]
			// this.tableHeads = [
			// 	'timestamp',
			// 	'open',
			// 	'high',
			// 	'low',
			// 	'close',
			// 	'volume_btc',
			// 	'volume_usdt',
			// 	'slowk',
			// 	'slowd',
			// 	'k',
			// 	'j',
			// 	'd',
			// 	'profit',
			// 	'profit_percent',
			// 	'type',
			// ]
			if (this.totalTableData.length) {
				const x = this.totalTableData[0]
				const ts = Object.keys(x).filter(
					(it) => it !== 'buy' && it !== 'sell'
				)
				ts.push('type')
				this.tableHeads = ts
				this.sort('timestamp', true)
			}
		},
		async getTradeData() {
			this.loading = true
			try {
				const startDate =
					this.startDate === '' ? 0 : Date.parse(this.startDate)
				const endDate =
					this.endDate === '' ? 0 : Date.parse(this.endDate)

				//get data
				const r = await this.$axios.get(
					!startDate && !endDate
						? this.$apiUrl.newTradeUrl()
						: this.$apiUrl.newTradeUrl(startDate, endDate)
				)

				//set candle and trade chart data
				const candleData = r.data.data
				if (!candleData.length) throw new Error(this.$en.empty_data())

				const tradeData = (r.data.data as Array<any>)
					.filter((it) => it.buy || it.sell)
					.map((it) => ({
						timestamp: Number(it.timestamp),
						price: it.open,
						buy: it.buy,
						...it,
					}))
				this.data = {
					candleData,
					tradeData,
				}

				//set start and end date inputs
				let s = candleData[0].timestamp,
					e = candleData[candleData.length - 1].timestamp
				if (Number(s) >= Number(e)) {
					s = candleData[candleData.length - 1].timestamp
					e = candleData[0].timestamp
				}
				this.startDate = this.convertTimeToString(s)
				this.endDate = this.convertTimeToString(e)

				//set indicators for chart
				this.indicators = [
					'lower',
					'middle',
					'upper',
					'MA_21',
					'MA_50',
					'SMMA_21',
				]
				this.secondChartIndicators = ['k', 'j', 'd']
				this.setTableData(r)
			} catch (e: any) {
				this.$toastErrors(this, e)
			} finally {
				this.loading = false
			}
		},
		itemClicked(timestamp: string, type: string) {
			this.clickedTimestamp = Number(timestamp)
			this.tradeClicked = type
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
					.map((it: any) => {
						const temp = { ...it }
						delete temp['buy']
						delete temp['sell']
						const d = Object.values(temp)
						d[0] = new Date(it.timestamp).toUTCString()
						d.push(it.buy ? 'buy' : 'sell')
						return d
					})
					.slice(
						this.rowsListNumber * (this.page - 1),
						this.page * this.rowsListNumber - 1
					),
			]
		},
		submitDate() {
			this.tableData = []
			this.totalTableData = []
			this.fixedTableData = []
			this.indicators = []
			this.secondChartIndicators = []
			this.data = {}
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
		convertTimeToString(timestamp: number) {
			const date = new Date(timestamp)
			const month =
				date.getUTCMonth() + 1 >= 10
					? `${date.getUTCMonth() + 1}`
					: `0${date.getUTCMonth() + 1}`
			const day =
				date.getUTCDate() >= 10
					? `${date.getUTCDate()}`
					: `0${date.getUTCDate()}`
			const hour =
				date.getUTCHours() >= 10
					? `${date.getUTCHours()}`
					: `0${date.getUTCHours()}`
			const minute =
				date.getUTCMinutes() >= 10
					? `${date.getUTCMinutes()}`
					: `0${date.getUTCMinutes()}`
			return `${date.getUTCFullYear()}-${month}-${day}T${hour}:${minute}`
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