<script setup>
import Giscus from "@giscus/vue"
import PageMeta from "./PageMeta.vue"
import PageNav from "./PageNav.vue"
import PageFooter from "./PageFooter.vue"
import PageReadingTime from "./PageReadingTime.vue"
import PageReadingLine from "./PageReadingLine.vue"
import SubSidebar from "./SubSidebar.vue"
import Comments from "./Comments.vue"

import { ref, toRefs, onMounted, onUnmounted } from "vue"

const $props = defineProps({
	isSubsidebar: {
		type: Boolean,
		default: true,
	},
})
const { isSubsidebar } = toRefs($props)

const sidebarContainer = ref(null)
const mainTextBodyWidth = 660
const sideOffset = 60

const resizeWatcher = isSubsidebar.value
	? new ResizeObserver((element) => {
			let containerWidth = Math.floor(
				Number(
					window
						.getComputedStyle(sidebarContainer.value)
						.width.replace("px", "")
				)
			)
			let screenWidth = element[0].contentRect.width

			let computedRightMargin =
				(screenWidth - mainTextBodyWidth) / 2 -
				sideOffset -
				(containerWidth === NaN ? 0 : containerWidth)

			sidebarContainer.value.style.right = `${computedRightMargin}px`
	  })
	: null

onMounted(() => {
	if (isSubsidebar.value) resizeWatcher.observe(document.body)
})
onUnmounted(() => {
	if (isSubsidebar.value) resizeWatcher.disconnect()
})
</script>

<template>
	<main class="page">
		<div class="content-container">
			<slot name="top" />
			<!-- <Toc /> -->
			<div class="theme-default-content">
				<slot name="content-top" />
				<Content />

				<slot name="content-bottom" />
			</div>

			<PageMeta />

			<PageNav />
			<slot name="bottom" />
			<Comments />
			<PageFooter />
		</div>
		<div class="sidebar-container" ref="sidebarContainer" v-if="isSubsidebar">
			<page-reading-time />
			<sub-sidebar />
		</div>
		<page-reading-line />
	</main>
</template>

<style lang="postcss" scoped>
.page {
	@apply relative pl-0;
}

.sidebar-container {
	@apply absolute inline-flex flex-col h-full top-0 right-0 pt-40;
}

.sub-sidebar {
	@apply top-24 right-0;
}

@media (max-width: 1150px) {
	.sidebar-container {
		@apply hidden;
	}
}
</style>
