<template>
	<div>
		<Table
			:heads="headers"
			:data="data"
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

export default Vue.extend({
	components: {
		Table,
	},
	data() {
		return {
			sorted: 'Start Date',
			asc: true,
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
	methods: {
		sort(s: string) {
			this.sorted === s ? (this.asc = !this.asc) : (this.asc = true)
			this.sorted = s
			this.$emit('sort', this.sorted, this.asc)
		},
		clickedData(row: number){
			const index = this.headers.findIndex(it => it === 'key')

			this.$emit('clicked', this.data[row][index])
		}
	},
})
</script>

<style scoped>
</style>