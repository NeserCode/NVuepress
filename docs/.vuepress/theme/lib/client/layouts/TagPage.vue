<script setup lang="ts">
import Navbar from "@theme/Navbar.vue"
import Page from "@theme/Page.vue"
import ArticleList from "../components/ArticleList.vue"

import { computed } from "vue"
import { usePageData, usePageFrontmatter } from "@vuepress/client"
import type { DefaultThemePageFrontmatter } from "../../shared"
import { useThemeLocaleData } from "../composables"
import { useBlogCategory } from "vuepress-plugin-blog2/client"

const page = usePageData()
const blogCategory = useBlogCategory("tag")
const frontmatter = usePageFrontmatter<DefaultThemePageFrontmatter>()
const themeLocale = useThemeLocaleData()

// navbar
const shouldShowNavbar = computed(
	() => frontmatter.value.navbar !== false && themeLocale.value.navbar !== false
)
</script>

<template>
	<div class="theme-tag-view-container">
		<slot name="navbar">
			<Navbar v-if="shouldShowNavbar" />
		</slot>

		<slot name="page">
			<Page :key="page.path" :isSubsidebar="false" :isComment="false">
				<template #content-top>
					<div class="neser-theme-tags-list">
						<RouterLink
							v-for="({ items, path }, name) in blogCategory.map"
							:key="name"
							:to="path"
							class="tag"
						>
							{{ name }}
							<span class="tag-num">
								{{ items.length }}
							</span>
						</RouterLink>
					</div>
					<Transition name="fade-slide-y" mode="out-in" appear>
						<ArticleList :items="blogCategory.currentItems" />
					</Transition>
				</template>
			</Page>
		</slot>
	</div>
</template>

<style lang="postcss" scoped>
.neser-theme-tags-list {
	@apply inline-flex w-full flex-wrap my-12;
}

.tag {
	@apply relative inline-block px-4 pr-6 py-0.5 m-2 rounded border-2
	bg-slate-50 dark:bg-slate-600 border-slate-300 dark:border-slate-500
	whitespace-nowrap text-ellipsis overflow-hidden;
	max-width: 18ch;
}
.tag .tag-num {
	@apply inline-flex items-center absolute -top-px right-2;
}
.tag.router-link-active {
	@apply hover:no-underline text-blue-400 border-blue-400;
}
</style>
