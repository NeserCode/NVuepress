<script setup>
import Giscus from "@giscus/vue"
import PageMeta from "./PageMeta.vue"
import PageNav from "./PageNav.vue"
import PageFooter from "./PageFooter.vue"
import PageReadingTime from "./PageReadingTime.vue"
import PageReadingLine from "./PageReadingLine.vue"
import SubSidebar from "./SubSidebar.vue"
import Comments from "./Comments.vue"

import { ref, toRefs, onMounted, onUnmounted, computed } from "vue"
import { usePageData, usePageFrontmatter } from "@vuepress/client"

const page = usePageData()
const frontmatter = usePageFrontmatter()

const $props = defineProps({
	isSubsidebar: {
		type: Boolean,
		default: true,
	},
	isComment: {
		type: Boolean,
		default: true,
	},
})
const { isSubsidebar, isComment } = toRefs($props)

const sidebarContainer = ref(null)
const mainTextBodyWidth = 660
const sideOffset = 60

const resizeWatcher = computed(() =>
	isSubsidebar.value
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
)

onMounted(() => {
	resizeWatcher.value?.observe(document.body)
})
onUnmounted(() => {
	resizeWatcher.value?.disconnect()
})

function getComputedDate() {
	return frontmatter.value.date === "0000-00-00" || !frontmatter.value.date
		? new Date(page.value.git?.createdTime).toLocaleString() ?? "时间长河中某处"
		: new Date(frontmatter.value.date).toLocaleString() ??
				new Date(page.value.git?.createdTime).toLocaleString() ??
				"时间长河中某处"
}

const isShowArticleHeader = computed(() => {
	return page.value.path.startsWith("/blog/")
})
</script>

<template>
	<main class="page">
		<div class="content-container">
			<slot name="top" />
			<div class="theme-default-content">
				<div class="content-header">
					<h1 class="md-title" :title="page.title">{{ page.title }}</h1>
					<span class="cpdDate" v-if="isShowArticleHeader">{{
						getComputedDate()
					}}</span>
					<slot name="content-header-addon" />
					<span class="tags">
						<span
							v-for="tag of frontmatter.tag"
							:key="tag"
							:title="tag + ' tag'"
						>
							<a :href="`/tag/${tag}/`">{{ tag }}</a>
						</span>
					</span>
				</div>
				<slot name="content-top" />
				<Content class="content-body" />
				<slot name="content-bottom" />
			</div>

			<PageMeta />

			<!-- <PageNav /> -->
			<slot name="bottom" />
			<Comments v-if="isComment" />
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

/* Content fix */
.content-header {
	@apply my-4 py-8;
}
.content-header h1 {
	@apply pb-0;
}
.content-header .cpdDate {
	@apply inline-flex justify-center items-center py-0.5 mr-1 my-1 px-2 rounded border-2 text-sm
	bg-slate-100 dark:bg-slate-700
	border-slate-200 dark:border-slate-600
	text-gray-600 dark:text-gray-400
	select-none;
}

.content-header .tags span {
	@apply inline-flex justify-center items-center py-0.5 px-2 m-1 rounded border-2
	bg-slate-100 dark:bg-slate-700
	border-slate-200 dark:border-slate-600
	text-gray-600 dark:text-gray-400
	select-none;
}

:deep(.content-body > h1:first-child) {
	@apply hidden;
}

@media (max-width: 1280px) {
	.sidebar-container {
		@apply hidden;
	}
}
</style>
