<template>
	<div class="block overflow-x-auto">
		<div v-if="allHeaders.length" class="flex py-4 flex-wrap">
			<span v-for="h in allHeaders" :key="h.name" class="ml-4">
				<CheckBox
					v-model="h.selected"
					:label="h.name"
					:id="h.name"
					@changed="updateTable"
					class="my-1"
				/>
			</span>
		</div>
		<Table
			:heads="allHeaders.filter((it) => it.selected).map((it) => it.name)"
			:data="tData"
			:sorted="sorted"
			:asc="asc"
			@sort="sort"
			@clicked="clickedData"
		/>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import CheckBox from '~/components/utils/CheckBox.vue'
import Table from './Table.vue'

type header = {
	name: string
	selected: boolean
}

export default Vue.extend({
	components: {
		CheckBox,
		Table,
	},
	data() {
		return {
			sorted: 'timestamp',
			asc: true,
			checked: true,
			allHeaders: [] as header[],
			tData: [] as any[][],
		}
	},
	methods: {
		sort(s: string) {
			this.sorted === s ? (this.asc = !this.asc) : (this.asc = true)
			this.sorted = s
			this.$emit('sort', this.sorted, this.asc)
		},
		clickedData(row: number) {
			let index = this.headers.findIndex((it) => it === 'timestamp')
			const timestamp = Date.parse(this.data[row][index])
			index = this.headers.findIndex((it) => it === 'type')
			const type = this.data[row][index]
			index = this.headers.findIndex(it => it === 'tradecount')
			const tradeCount = this.data[row][index]
			this.$emit('clicked', timestamp, type, tradeCount)
		},

		updateTable() {
			this.tData = this.data.map((it) => {
				const d = [] as any[]
				it.map((it2, j) => {
					if (this.allHeaders[j].selected) d.push(it2)
				})
				return d
			})
		},
	},
	watch: {
		data() {
			if (!this.allHeaders.length)
				this.allHeaders = this.headers.map((it) => ({
					name: it,
					// selected: !this.allIndicators.includes(it),
					selected: this.initialHeaders.includes(it)
				}))
			this.updateTable()
		},
	},
	props: {
		headers: {
			type: Array,
			default: () => [] as string[],
		} as PropOptions<Array<string>>,
		data: {
			type: Array,
			default: () => [] as any[][],
		} as PropOptions<Array<Array<any>>>,
		indicators: {
			type: Array,
			default: () => [] as string[],
		} as PropOptions<Array<string>>,
		secondIndicators: {
			type: Array,
			default: () => [] as string[],
		} as PropOptions<Array<string>>,
		initialHeaders: {
			type: Array,
			default: () => [] as string[],
		} as PropOptions<Array<string>>,
	},
	computed: {
		allIndicators(): string[] {
			return [...this.indicators, ...this.secondIndicators]
		},
	},
	mounted() {
		if (this.data.length) {
			this.allHeaders = this.headers.map((it) => ({
				name: it,
				// selected: !this.allIndicators.includes(it),
				selected: this.initialHeaders.includes(it)
			}))
			this.updateTable()
		}
	},
})
</script>