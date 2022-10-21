<script setup>
import { computed, watch, toRefs, ref } from "vue"

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

watch(currentPage, (val) => {
	if (val >= countPages.value) currentPage.value = countPages.value
	else if (val <= 1) currentPage.value = 1
	else currentPage.value = val
})

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
				<input
					type="number"
					class="input-body"
					name="pagination-input"
					id="pagination-input"
					v-model="currentPage"
				/>
			</span>
			<span class="next page-fn" v-show="hasNext" @click="handleNext"
				>&gt;</span
			>
			<span class="page-count"> {{ countPages }} pages</span>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.pagination-main {
	@apply inline-flex w-full;
}

.pagination-container {
	@apply inline-flex items-center justify-end w-full p-2;
}

.pagination-container .page-fn {
	@apply inline-flex items-center justify-center w-8 h-8 mx-1
  text-lg font-semibold leading-3
  text-gray-500 hover:bg-slate-200 rounded cursor-pointer
  select-none transition-all;
}

.pagination-container .page-input {
	@apply inline-flex items-center;
}
.page-input .input-body {
	@apply w-12 h-6 mx-1 text-center
  text-lg font-semibold leading-3
  text-gray-500 bg-white border border-gray-300
  rounded focus:outline-none focus:ring-2 focus:ring-offset-1
  focus:ring-offset-gray-100 focus:ring-slate-400
  transition-all appearance-none;
}
</style>
