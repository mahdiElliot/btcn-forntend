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
		<table ref="table">
			<thead>
				<tr>
					<th
						v-for="s in allHeaders.filter((it) => it.selected)"
						:key="s.name"
						class="cursor-pointer relative"
					>
						<span @click="sort(s.name)" class="mr-5 w-full flex">{{
							s.name
						}}</span>
						<span
							v-if="s.name === sorted"
							@click="sort(s)"
							class="absolute right-0 top-0 bottom-0 mr-5 mt-2"
						>
							<span v-if="asc">&#x25be;</span>
							<span v-else class="text-xs">&#x25B2;</span>
						</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					class="cursor-pointer"
					v-for="(t, i) in tData"
					:key="i"
					@click="$emit('clicked', t[0])"
				>
					<td v-for="(d, j) in t" :key="j">{{ d }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import CheckBox from '~/components/utils/CheckBox.vue'

type header = {
	name: string
	selected: boolean
}

export default Vue.extend({
	components: {
		CheckBox,
	},
	data() {
		return {
			sorted: 'timestamp',
			checked: true,
			asc: true,
			allHeaders: [] as header[],
			tData: [] as any[][],
		}
	},
	methods: {
		sort(s: string) {
			this.sorted === s ? (this.asc = !this.asc) : (this.asc = true)
			this.sorted = s
			this.$emit('sort', s, this.asc)
		},
		resizableGrid(e: any) {
			const t = e.getElementsByTagName('tr')[0],
				n = t ? t.children : void 0
			if (n) {
				e.style.overflow = 'hidden'
				for (let i = e.offsetHeight, o = 0; o < n.length; o++) {
					const div = s(i)
					n[o].appendChild(div),
						(n[o].style.position = 'relative'),
						d(div)
				}
			}
			function d(e: any) {
				let t: any, n: any, i: any, o: any, r: any
				e.addEventListener('mousedown', function (e: any) {
					;(n = e.target.parentElement),
						(i = n.nextElementSibling),
						(t = e.pageX)
					const d = (function (e) {
						if ('border-box' == l(e, 'box-sizing')) return 0
						const t = l(e, 'padding-left'),
							n = l(e, 'padding-right')
						return parseInt(t) + parseInt(n)
					})(n)
					;(o = n.offsetWidth - d), i && (r = i.offsetWidth - d)
				}),
					e.addEventListener('mouseover', function (e: any) {
						e.target.style.borderRight = '2px solid #0000ff'
					}),
					e.addEventListener('mouseout', function (e: any) {
						e.target.style.borderRight = ''
					}),
					document.addEventListener('mousemove', function (e) {
						if (n) {
							const d = e.pageX - t
							i && (i.style.width = r - d + 'px'),
								(n.style.width = o + d + 'px')
						}
					}),
					document.addEventListener('mouseup', function (e) {
						;(n = void 0),
							(i = void 0),
							(t = void 0),
							(r = void 0),
							(o = void 0)
					})
			}
			function s(height: any) {
				const t = document.createElement('div')
				return (
					(t.style.top = '0'),
					(t.style.right = '0'),
					(t.style.width = '5px'),
					(t.style.position = 'absolute'),
					(t.style.cursor = 'col-resize'),
					(t.style.userSelect = 'none'),
					(t.style.height = height + 'px'),
					t
				)
			}
			function l(e: any, t: any) {
				return window.getComputedStyle(e, null).getPropertyValue(t)
			}
		},
		enableResize() {
			this.resizableGrid(this.$refs.table)
		},
		updateTable() {
			// const index = this.heads.findIndex((it) => it === id)
			// if (value) {
			// 	this.tData = this.tData.map((it) =>
			// 		it.filter((_, i) => i !== index)
			// 	)
			// } else {
			// }
			this.tData = this.data.map((it) => {
				const d = [] as any[]
				it.map((it2, j) => {
					if (this.allHeaders[j].selected)
						d.push(it2)
				})
				return d
			})
		},
	},
	watch: {
		heads() {
			this.allHeaders = this.heads.map((it) => ({
				name: it as string,
				selected: true,
			}))
		},
		data() {
			this.updateTable()
		},
	},
	props: {
		heads: {
			type: Array,
			default: () => [] as string[],
		},
		data: {
			type: Array,
			default: () => [] as any[][],
		} as PropOptions<Array<Array<any>>>,
	},
	mounted() {
		if (this.data.length) this.enableResize()
	},
	updated() {
		this.enableResize()
	},
})
</script>

<style scoped>
table {
	border-collapse: collapse;
	width: 100%;
	table-layout: fixed;
}

td,
th {
	border: 1px solid #dddddd;
	text-align: left;
	padding: 0.5rem;
	overflow: hidden;
	-moz-text-overflow: ellipsis;
	-ms-text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
	white-space: nowrap;
	text-overflow: ellipsis;
}
tr:nth-child(even) {
	background-color: #dddddd;
}

.w-400 {
	width: 800px;
}
</style>