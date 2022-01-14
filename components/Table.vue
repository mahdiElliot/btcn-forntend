<template>
	<table>
		<thead>
			<tr>
				<th v-for="s in heads" :key="s">{{ s }}</th>
			</tr>
		</thead>
		<tbody>
			<tr
				class="cursor-pointer"
				v-for="(t, i) in data"
				:key="i"
				@click="$emit('clicked', i)"
			>
				<td v-for="(d, j) in t" :key="j">{{ d }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data() {
		return {}
	},
	props: {
		heads: {
			type: Array,
			default: () => [
				'timestamp',
				'open',
				'close',
				'low',
				'high',
				'volume',
				'USD_volume',
			],
		},
		data: {
			type: Array,
			default: () => [],
		},
	},
})
</script>

<style scoped>
table {
	border-collapse: collapse;
	width: 100%;
}

td,
th {
	border: 1px solid #dddddd;
	text-align: left;
	padding: 0.5rem;
}

tr:nth-child(even) {
	background-color: #dddddd;
}
</style>