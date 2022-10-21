<script setup>
import { computed, toRefs, ref } from "vue"

const $props = defineProps({
	prev: {
		type: Function,
	},
	next: {
		type: Function,
	},
	total: {
		type: Number,
	},
	current: {
		type: Number,
	},
	size: {
		type: Number,
	},
})

const { prev, next, total, size } = toRefs($props)
const hasPrev = computed(() => prev.value !== undefined)
const hasNext = computed(() => next.value !== undefined)

const countPages = computed(() => {
	return Math.ceil(total.value / size.value)
})
const currentPage = ref(1)

function handlePrev() {
	if (currentPage.value === 1) return false
	prev.value()
	currentPage.value--
}
function handleNext() {
	if (currentPage.value === countPages.value) return false
	next.value()
	currentPage.value++
}
</script>

<template>
	<div class="pagination-main">
		<div class="pagination-container">
			<span class="prev page-fn" v-show="hasPrev" @click="handlePrev"
				>&lt;</span
			>
			<span class="page-input">
				<input type="number" name="" id="" />
			</span>
			<span class="next page-fn" v-show="hasNext" @click="handleNext"
				>&gt;</span
			>
			<span class="page-count">
				{{ currentPage }} | {{ countPages }} pages</span
			>
		</div>
	</div>
</template>

<style lang="postcss" scoped></style>
