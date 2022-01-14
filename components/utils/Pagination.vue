<template>
	<div dir="auto" class="flex items-center justify-center w-full">
		<MyIcon
			name="left-arrow"
			class="cursor-pointer w-8 h-8"
			:class="[arrowLeftEnable]"
			@click="change('left')"
		/>
		<div
			class="flex overflow-x-auto text-lg justify-around"
			:class="buttons.length >= 5 ? 'w-100' : 'mx-4'"
		>
			<div
				v-for="(b, index) in buttons"
				:key="index"
				class="flex items-center"
				:class="buttons.length < 5 ? 'mx-2' : ''"
			>
				<button
					v-if="b.status === 1"
					class="rounded-xl w-12 h-12"
					:class="[selected(b.isSelected)]"
					@click="select(b.id)"
				>
					{{ buttonNames.length ? b.name : b.id }}
				</button>
				<span class="" v-if="b.status === 2">...</span>
			</div>
		</div>
		<MyIcon
			name="right-arrow"
			class="cursor-pointer w-8 h-8"
			:class="[arrowRightEnable]"
			@click="change('right')"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import MyIcon from '~/components/utils/MyIcon.vue'

type Button = {
	id: any
	isSelected: boolean
	status: number
	name: string
}

export default Vue.extend({
	components: { MyIcon },
	props: {
		listSize: Number,
		eachRowNumbers: Number,
		buttonNames: {
			type: Array,
			default: () => [] as Array<any>,
		},
	},
	watch: {
		listSize(o, n) {
			const old = Math.ceil(o / this.eachRowNumbers)
			const newVal = Math.ceil(n / this.eachRowNumbers)
			if (old !== newVal && this.page > 1) this.page--
			this.createButtons()
			this.changeStyle()
		},
	},
	data() {
		return {
			buttons: [] as Button[],
			page: 1,
		}
	},
	computed: {
		arrowLeftEnable(): string {
			return this.page === 1 ? 'opacity-25' : ''
		},
		arrowRightEnable(): string {
			if (this.buttonNames.length)
				return this.page === this.buttonNames.length ? 'opacity-25' : ''

			return this.page ===
				Math.ceil(this.listSize / this.eachRowNumbers) ||
				this.listSize === 0
				? 'opacity-25'
				: ''
		},
	},
	methods: {
		select(id: number) {
			this.buttons.map((it) => (it.isSelected = it.id === id))
			this.page = id
			this.changeStyle()
			this.$emit('paginate', id)
		},
		selected(isSelected: boolean): string {
			return isSelected ? 'selected font-bold' : 'unselected bg-white'
		},
		change(arrow: string) {
			switch (arrow) {
				case 'left':
					if (this.page > 1) this.select(--this.page)
					break
				default:
					if (this.buttonNames.length) {
						if (this.page < this.buttonNames.length)
							this.select(++this.page)
					} else if (
						this.page <
						Math.ceil(this.listSize / this.eachRowNumbers)
					)
						this.select(++this.page)
					break
			}
		},
		createButtons() {
			if (this.buttonNames.length) {
				this.buttons = this.buttonNames.map((it, i) => ({
					id: i + 1,
					isSelected: i === this.page - 1,
					name: it,
					status: 1,
				}))
			} else {
				const btns = []
				const number = Math.ceil(this.listSize / this.eachRowNumbers)
				for (let i = 1; i <= number; i++) {
					btns.push({
						id: i,
						isSelected: i === this.page,
						name: '',
						status: 1,
					})
				}
				this.buttons = btns
			}
		},
		changeStyle() {
			if (this.buttons.length <= 5) return
			const next = this.buttons.length - this.page >= 3
			const prev = this.page - 1 >= 3
			this.buttons = [
				...this.buttons.map((it, index) => {
					if (prev && index > 0 && index < this.page - 1) {
						if (
							index === 1 ||
							index === Math.ceil((this.buttons.length - 2) / 2)
						)
							return {
								...it,
								status: 2,
							}
						if (index === this.page - 2)
							return {
								...it,
								status: 1,
							}
						return {
							...it,
							status: 0,
						}
					}
					if (next) {
						if (
							this.page + 1 === index ||
							index ===
								Math.ceil(
									(this.page + this.buttons.length - 1) / 2
								)
						)
							return {
								...it,
								status: 2,
							}
						if (
							index > this.page + 1 &&
							index < this.buttons.length - 1
						)
							return {
								...it,
								status: 0,
							}
					}
					return {
						...it,
						status: 1,
					}
				}),
			]
		},
	},
	mounted() {
		this.createButtons()
		this.changeStyle()
	},
})
</script>

<style lang="postcss" scoped>
.selected {
	color: white;
	box-shadow: 0px 4px 4px rgba(38, 50, 56, 0.15);
	@apply bg-primary;
}

.unselected {
	border: 1px solid #cfd8dc;
	@apply bg-white text-text-primary-dark;
}

.w-100 {
	width: 360px;
}
</style>
