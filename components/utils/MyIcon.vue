<template>
	<client-only>
		<component :is="'my-' + name" @click="(e) => $emit('click', e)" />
	</client-only>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	components: {
		'my-left-arrow': () => import('~/assets/img/icons/ic_left_arrow.svg'),
		'my-right-arrow': () => import('~/assets/img/icons/ic_right_arrow.svg'),
	},
	props: {
		name: {
			type: String,
			default: () => 'grid',
		},
	},
})
</script>