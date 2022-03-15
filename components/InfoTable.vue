<template>
	<div class="block overflow-x-auto">
		<div class="flex py-4 flex-wrap">
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
			:asc="asc"
			:sorted="sorted"
			@sort="sort"
			@clicked="clickedData"
		/>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Table from './Table.vue'
import CheckBox from '~/components/utils/CheckBox.vue'

type header = {
	name: string
	selected: boolean
}

export default Vue.extend({
	components: {
		Table,
		CheckBox
	},
	data() {
		return {
			sorted: 'Start Date',
			asc: true,
			allHeaders: [] as header[],
			tData: [] as any[][],
		}
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
	},
	watch: {
		data() {
			this.updateHeader()
			this.updateTable()
		},
	},
	methods: {
		sort(s: string) {
			this.sorted === s ? (this.asc = !this.asc) : (this.asc = true)
			this.sorted = s
			this.$emit('sort', this.sorted, this.asc)
		},
		clickedData(row: number) {
			const index = this.headers.findIndex((it) => it === 'key')

			this.$emit('clicked', this.data[row][index])
		},
		updateHeader() {
			this.allHeaders = this.headers.map((it) => ({
				name: it,
				selected: it !== 'key',
			}))
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
	mounted() {
		if (this.data.length) {
			this.updateHeader()
			this.updateTable()
		}
	},
})
</script>

<style scoped>
</style>