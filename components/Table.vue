<template>
	<div class="block overflow-x-auto">
		<table ref="table" :class="[resizable ? 'layout-fixed': '']">
			<thead>
				<tr>
					<th
						v-for="s in heads"
						:key="s"
						class="cursor-pointer relative"
					>
						<span @click="sort(s)" class="mr-5 w-full flex">{{
							s
						}}</span>
						<span
							v-if="s === sorted"
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
					v-for="(t, i) in data"
					:key="i"
					@click="clickedData(i)"
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

export default Vue.extend({
	components: {
		CheckBox,
	},
	data() {
		return {}
	},
	methods: {
		sort(s: string) {
			this.$emit('sort', s)
		},
		clickedData(row: number) {
			this.$emit('clicked', row)
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
			if (!this.resizable) return
			this.resizableGrid(this.$refs.table)
		},
	},
	props: {
		heads: {
			type: Array,
			default: () => [] as string[],
		} as PropOptions<Array<string>>,
		data: {
			type: Array,
			default: () => [] as any[][],
		} as PropOptions<Array<Array<any>>>,
		sorted: {
			type: String,
			default: '',
		},
		asc: {
			type: Boolean,
			default: true,
		},
		resizable: {
			type: Boolean,
			default: true,
		},
	},
	mounted() {
		if (this.data.length) {
			this.enableResize()
		}
	},
	updated() {
		this.enableResize()
	},
})
</script>

<style scoped>
.layout-fixed {
	table-layout: fixed;
}

table {
	border-collapse: collapse;
	width: 100%;
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

tbody tr:nth-child(even) {
	background-color: #dddddd9d;
}

tbody tr:hover {
	background: #cccccc radial-gradient(circle, transparent 1%, #cccccc 1%)
		center/15000%;
}

tbody tr:active {
	background-color: #dddddd9d;
	background-size: 100%;
}

.w-400 {
	width: 800px;
}
</style>