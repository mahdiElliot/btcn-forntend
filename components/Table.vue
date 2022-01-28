<template>
	<table>
		<thead>
			<tr>
				<th
					v-for="s in heads"
					:key="s"
					@click="sort(s)"
					class="cursor-pointer relative"
				>
					{{ s }}
					<span
						v-if="s === sorted"
						class="absolute right-0 top-0 bottom-0 mr-6 mt-2"
						>&#x25be;</span
					>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr
				class="cursor-pointer"
				v-for="(t, i) in data"
				:key="i"
				@click="$emit('clicked', t[0])"
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
		return {
			sorted: 'timestamp',
		}
	},
	methods: {
		sort(s: string) {
			this.sorted = s
			this.$emit('sort', s)
		},
	},
	props: {
		heads: {
			type: Array,
			default: () => ['timestamp', 'price', 'type'],
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