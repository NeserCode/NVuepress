<script setup lang="ts">
import Navbar from "@theme/Navbar.vue"
import Page from "@theme/Page.vue"

import { computed } from "vue"
import { usePageData, usePageFrontmatter } from "@vuepress/client"
import type { DefaultThemePageFrontmatter } from "../../shared"
import { useThemeLocaleData } from "../composables"
import { useBlogType } from "vuepress-plugin-blog2/client"

const page = usePageData()
const blogType = useBlogType()
const frontmatter = usePageFrontmatter<DefaultThemePageFrontmatter>()
const themeLocale = useThemeLocaleData()

// navbar
const shouldShowNavbar = computed(
	() => frontmatter.value.navbar !== false && themeLocale.value.navbar !== false
)

const articles = computed(() => {
	return blogType.value.items.sort(
		(a, b) => new Date(b.info.date).getTime() - new Date(a.info.date).getTime()
	)
})

function getComputedExcerpt(item) {
	let stringfiedExcerpt = item.info.excerpt
		.replace(/<[^>]*>/g, "")
		.replace("# ", "")

	// 删去标题
	if (stringfiedExcerpt.indexOf(item.info.title) === 0)
		stringfiedExcerpt = stringfiedExcerpt.replace(`${item.info.title}\n`, "")

	// 删去末尾字符
	if (stringfiedExcerpt.length >= 15)
		stringfiedExcerpt = stringfiedExcerpt.substring(
			0,
			stringfiedExcerpt.length - 2
		)
	// 空摘要处理
	else if (stringfiedExcerpt === "" || stringfiedExcerpt === undefined)
		stringfiedExcerpt = "点击文章标题查看更多内容"

	// 摘要省略号处理
	stringfiedExcerpt += "......"

	return stringfiedExcerpt
}

function getEarliestAndLatestDate() {
	let earliestDate = new Date(articles.value[0].info.date)
	let latestDate = new Date(articles.value[0].info.date)

	for (let i = 1; i < articles.value.length; i++) {
		let date = new Date(articles.value[i].info.date)
		if (date < earliestDate) earliestDate = date
		if (date > latestDate) latestDate = date
	}

	return [earliestDate.toLocaleString(), latestDate.toLocaleString()]
}

console.log(articles.value)
</script>

<template>
	<div class="theme-tag-view-container">
		<slot name="navbar">
			<Navbar v-if="shouldShowNavbar" />
		</slot>

		<slot name="page">
			<Page :key="page.path" :isSubsidebar="false" :isComment="false">
				<template #content-header-addon>
					<span class="time-area"
						>{{ getEarliestAndLatestDate()[0] }} ~
						{{ getEarliestAndLatestDate()[1] }}</span
					>
					<span class="total-area"> 共 {{ articles.length }} 篇 </span>
				</template>
				<template #content-bottom>
					<div class="time-node-wrapper">
						<div
							class="time-line-container"
							v-for="article of articles"
							key="article.path"
						>
							<span class="time-node">
								<div class="article">
									<span class="title"
										><router-link :to="article.path">{{
											article.info.title
										}}</router-link></span
									>
									<span class="date">{{
										new Date(article.info.date).toLocaleString()
									}}</span>
									<span class="excerpt">{{ getComputedExcerpt(article) }}</span>
								</div>
							</span>
						</div>
					</div>
				</template>
			</Page>
		</slot>
	</div>
</template>

<style lang="postcss" scoped>
.time-node-wrapper {
	@apply relative inline-flex flex-col w-full p-4
	box-content;
}
.time-node-wrapper .time-line-container:nth-child(even) {
	@apply self-end border-x-2 
	-translate-x-px items-end
	border-transparent border-l-slate-400;
}
.time-node-wrapper .time-line-container:nth-child(odd) {
	@apply self-start border-x-2 
	translate-x-px
	border-transparent border-r-slate-400;
}
.time-line-container {
	@apply relative inline-flex w-1/2 p-4;
}

.time-line-container:nth-child(even) .time-node {
	@apply self-end;
}
.time-line-container:nth-child(odd) .time-node {
	@apply self-start;
}
.time-node {
	@apply inline-block overflow-hidden p-4;
}
.time-node .article {
	@apply relative inline-flex flex-col w-full p-4 border-2 rounded-md
	border-slate-400 dark:border-slate-600
	hover:ring-2 dark:hover:ring-slate-600 hover:ring-yellow-200 dark:hover:bg-gray-700 hover:bg-green-100
	transition-all;
}

.article span {
	@apply inline-block 
	text-ellipsis whitespace-nowrap overflow-hidden;
}

.article .title {
	@apply text-xl font-semibold;
}

.article .date {
	@apply text-sm w-full
	text-gray-500;
}

.article .excerpt {
	@apply text-base
	text-gray-600 dark:text-gray-400;
}

/* Node point */
.time-node-wrapper .time-line-container:nth-child(even) .time-node::before {
	@apply absolute top-1/2 left-0 w-4 h-4
	border-2 border-slate-400
	bg-slate-100 dark:bg-slate-600
	rounded-full -translate-x-[9px] -translate-y-1/2;
	content: " ";
}

.time-node-wrapper .time-line-container:nth-child(odd) .time-node::before {
	@apply absolute top-1/2 right-0 w-4 h-4
	border-2 border-slate-400
	bg-slate-100 dark:bg-slate-600
	rounded-full translate-x-[9px] -translate-y-1/2;
	content: " ";
}

.time-area,
.total-area {
	@apply inline-block text-sm font-semibold mr-4
	text-gray-500;
}
</style>
