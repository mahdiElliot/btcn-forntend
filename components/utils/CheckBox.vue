<template>
	<div>
		<input
			type="checkbox"
			:id="id"
			:checked="value"
			@change="
				(e) => {
                    $emit('input', e.target.checked)
					$emit('changed', id, value)
				}
			"
		/>
		<label :for="id">{{ label }} </label>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		value: {
			type: Boolean,
			default: true,
		},
		label: {
			type: String,
			default: '',
		},
		id: {
			type: String,
			default: 'box-1',
		},
	},
})
</script>

<style lang="postcss" scoped>
input[type='checkbox'] {
	display: none;
}

input[type='checkbox'] + label {
	display: block;
	position: relative;
	padding-left: 24px;
	margin-bottom: 20px;
	font: 14px/20px 'Open Sans', Arial, sans-serif;
	color: black;
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
}

input[type='checkbox'] + label:last-child {
	margin-bottom: 0;
}

input[type='checkbox'] + label:before {
	content: '';
	display: block;
	width: 20px;
	height: 20px;
    position: absolute;
	left: 0;
	top: 0;
	opacity: 0.6;
	-webkit-transition: all 0.12s, border-color 0.08s;
    transition: all 0.12s, border-color 0.08s;
    @apply border border-primary;
}

input[type='checkbox']:checked + label:before {
	width: 10px;
	top: -5px;
	left: 5px;
    border-radius: 0;
	opacity: 1;
	border-top-color: transparent;
	border-left-color: transparent;
	-webkit-transform: rotate(45deg);
	transform: rotate(45deg);
}
</style>