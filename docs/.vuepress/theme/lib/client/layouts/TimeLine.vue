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

console.log(blogType.value)
</script>

<template>
	<div class="theme-tag-view-container">
		<slot name="navbar">
			<Navbar v-if="shouldShowNavbar" />
		</slot>

		<slot name="page">
			<Page :key="page.path" :isSubsidebar="false" :isComment="false">
				<template #content-top>
					<div class="time-line-container">
						<span class="time-node">
							<div class="article">a article</div>
						</span>
					</div>
				</template>
			</Page>
		</slot>
	</div>
</template>

<style lang="postcss" scoped>
.time-line-container {
	@apply relative inline-flex w-full min-h-screen;
}
.time-line-container::after {
	@apply inline-block absolute w-1 h-full left-1/2 top-0 rounded-sm
	bg-slate-500
	-translate-x-1/2;
	content: " ";
}
</style>
