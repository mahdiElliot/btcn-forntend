<template>
	<div class="w-full h-full p-6 py-12">
		<CandleChart
			v-if="data.candleData && data.candleData.length > 0"
			:data="data"
			:clickedTimestamp="clickedTimestamp"
			:clickedTrade="tradeClicked"
			:indicators="indicators"
			:secondIndicators="secondChartIndicators"
			:candleNumber="100"
			:tradeOrder="tradeOrder"
		/>
		<!-- <div class="flex w-full my-4 justify-center items-center">
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
		</div> -->

		<div class="flex w-full items-center justify-center mt-12">
			<button
				@click="tablePage = 1"
				class="px-12 py-2 outline-none"
				:class="[
					tablePage === 1 ? 'selected' : 'unselected ripple-bg-white',
				]"
			>
				info
			</button>
			<button
				@click="tradesClicked"
				class="px-12 py-2 outline-none"
				:class="[
					tablePage === 2 ? 'selected' : 'unselected ripple-bg-white',
				]"
			>
				trades
			</button>
		</div>
		<div class="mt-6 mx-2">
			<InfoTable
				v-if="tablePage === 1"
				:data="infoTableData"
				@sort="sort"
				:headers="infoTableHeads"
				@clicked="clickedInfo"
			/>
			<MainTable
				v-if="tablePage === 2"
				:data="tableData"
				@clicked="itemClicked"
				@sort="sort"
				:headers="tableHeads"
				:indicators="indicators"
				:secondIndicators="secondChartIndicators"
				:initialHeaders="initialMainHeaders"
			/>
		</div>
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
import MainTable from '~/components/MainTable.vue'
import InfoTable from '~/components/InfoTable.vue'
import Pagination from '~/components/utils/Pagination.vue'
import Loader from '~/components/utils/Loader.vue'

type Data = {
	candleData: Array<any>
	tradeData: Array<any>
}

export default Vue.extend({
	components: {
		CandleChart,
		Pagination,
		Loader,
		MainTable,
		InfoTable,
	},
	data() {
		return {
			data: {} as Data,
			total: 0,
			tradesTotal: 0,
			rowsListNumber: 60,
			rowsListNumber2: 35,
			page: 1,
			clckTimestamp: 1,
			clickedTimestamp: 1,
			tradeOrder: 1,
			tradeClicked: 'buy',
			tradesSort: 'timestamp',
			tradesSortAsc: 1,
			loading: true,
			// startDate: '2022-01-07T09:00',
			// endDate: '2022-01-09T06:15',
			startDate: '',
			endDate: '',
			tradeKey: 0,
			tableData: [] as any,
			totalTableData: [] as any[],
			fixedTableData: [] as any[],
			tableHeads: ['timestamp', 'price', 'type'] as Array<string>,
			initialMainHeaders: [
				'timestamp',
				'open',
				'high',
				'low',
				'close',
				'price',
				'profit',
				'profit_percent',
				'cum_profit',
				'type',
			],
			infoTableHeads: [] as any[],
			infoTableData: [] as any[],
			infoTotalTableData: [] as any[],
			indicators: [] as string[],
			secondChartIndicators: [] as string[],
			tablePage: 1,
		}
	},
	watch: {
		tablePage() {
			this.page = 1
			if (this.tablePage === 1) this.getInfoData()
		},
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
		async getInfoData() {
			this.loading = true
			try {
				const r = await this.$axios.get(this.$apiUrl.infoUrl())
				this.total = r.data.total
				this.infoTotalTableData = r.data.data

				if (this.infoTotalTableData.length) {
					const x = this.infoTotalTableData[0]
					this.infoTableHeads = Object.keys(x)

					this.sort('Time of Back Test', true)
				}
				this.loading = false
			} catch (e: any) {
				this.loading = false
				this.$toastErrors(this, e)
			}
		},
		async setMainTableData() {
			const r = await this.$axios.get(
				this.$apiUrl.tradeUrl(
					this.tradeKey,
					0,
					0,
					this.rowsListNumber,
					this.page,
					this.tradesSort,
					this.tradesSortAsc,
					1
				)
			)

			if (!r.data.data.length) throw new Error(this.$en.empty_data())

			const tradeData = (r.data.data as Array<any>).map((it) => {
				const t = {
					timestamp: Number(it.timestamp),
					price: it.buy ? it.open : it.sell_price,
					buy: it.buy,
					...it,
				}
				delete t['sell_price']
				return t
			})
			this.total = r.data.total
			this.tradesTotal = r.data.total

			this.totalTableData = [...tradeData]

			if (this.totalTableData.length) {
				const x = this.totalTableData[0]
				const ts = Object.keys(x).filter(
					(it) => it !== 'buy' && it !== 'sell'
				)
				ts.push('type')
				this.tableHeads = ts
				// this.sort('timestamp', true)
				this.tableData = [
					...this.totalTableData.map((it: any) => {
						const temp = { ...it }
						delete temp['buy']
						delete temp['sell']
						const d = Object.values(temp)
						d[0] = new Date(it.timestamp).toUTCString()
						d.push(it.buy ? 'buy' : 'sell')
						return d
					}),
				]
			}
		},
		async getTradeData() {
			this.loading = true
			try {
				//get data
				await this.setMainTableData()

				//set indicators for chart
				const r = await this.$axios.get(this.$apiUrl.indicatorUrl())
				this.indicators = (r.data as Array<any>).filter(it => it.type).map(it => it.name)
				this.secondChartIndicators = (r.data as Array<any>).filter(it => !it.type).map(it => it.name)
				await this.setChartData()
			} catch (e: any) {
				this.$toastErrors(this, e)
			} finally {
				this.loading = false
			}
		},
		async setChartData() {
			const MINUTE = 60000
			let startDate = 0,
				endDate = 0
			const DAYS = 2880 * MINUTE
			if (this.clckTimestamp > 1)
				(startDate = this.clckTimestamp - DAYS),
					(endDate = this.clckTimestamp + DAYS)

			//set candle and trade chart data
			const r = await this.$axios.get(
				this.$apiUrl.tradeUrl(
					this.tradeKey,
					startDate,
					endDate,
					1000,
					1,
					this.tradesSort,
					this.tradesSortAsc,
					0
				)
			)
			const candleData: any[] = r.data.data

			const tradeData = candleData
				.filter((it) => it.buy || it.sell)
				.map((it) => {
					const t = {
						timestamp: Number(it.timestamp),
						price: it.buy ? it.open : it.sell_price,
						buy: it.buy,
						...it,
					}
					delete t['sell_price']
					return t
				})

			this.data = {
				candleData,
				tradeData,
			}
		},
		itemClicked(timestamp: string, type: string, trade_order: number) {
			this.clckTimestamp = Number(timestamp)
			this.loading = true
			this.data = {
				candleData: [],
				tradeData: []
			}
			this.setChartData()
				.then(() => {
					this.tradeClicked = type
					this.tradeOrder = trade_order
					this.clickedTimestamp = Number(timestamp)
					document.body.scrollTop = 0
					document.documentElement.scrollTop = 0
				})
				.catch((e) => {
					this.$toastErrors(this, e)
				})
				.finally(() => {
					this.loading = false
				})
		},
		clickedInfo(key: number) {
			this.tableData = []
			this.totalTableData = []
			this.fixedTableData = []
			this.tableHeads = []
			this.tradeKey = key
			this.tablePage = 2
			this.startDate = ''
			this.endDate = ''
			this.getTradeData()
		},
		tradesClicked() {
			this.tablePage = 2
			this.total = this.tradesTotal
		},
		async paginate(page: number) {
			this.page = page
			this.loading = true
			try {
				if (this.tablePage === 2)
					await this.setMainTableData()
				else if (this.tablePage === 1) {
					this.infoTableData = [
						...this.infoTotalTableData.map((it) => {
							const d = Object.values(it)
							return d
						}),
					].slice(
						this.rowsListNumber * (this.page - 1),
						this.page * this.rowsListNumber - 1
					)
				}
			} catch (e: any) {
				this.$toastErrors(this, e)
			} finally {
				this.loading = false
			}
		},
		submitDate() {
			this.tableData = []
			this.totalTableData = []
			this.fixedTableData = []
			// this.indicators = []
			// this.secondChartIndicators = []
			this.data = {} as Data
			// this.getCandleData()
			this.getTradeData()
		},
		async sort(s: string, asc: boolean) {
			this.loading = true
			try {
				if (this.tablePage === 1) {
					const ret = asc ? 1 : -1
					this.infoTotalTableData.sort((a: any, b: any) =>
						a[s] >= b[s] ? ret : -ret
					)
					this.paginate(this.page)
				} else if (this.tablePage === 2) {
					if (s !== 'type') {
						this.tradesSort = s
						this.tradesSortAsc = asc ? 1 : -1
						await this.setMainTableData()
					}
				}
			} catch (e: any) {
				this.$toastErrors(this, e)
			} finally {
				this.loading = false
			}
			// this.paginate(this.page)
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

		this.getInfoData()
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

.selected {
	color: white;
	box-shadow: 0px 4px 4px rgba(38, 50, 56, 0.15);
	@apply bg-primary;
}

.unselected {
	border: 1px solid #cfd8dc;
	@apply text-text-primary-dark;
}
</style>