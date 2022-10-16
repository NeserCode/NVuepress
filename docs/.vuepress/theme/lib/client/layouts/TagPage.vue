<script setup lang="ts">
import Navbar from "@theme/Navbar.vue"
import Page from "@theme/Page.vue"

import { computed } from "vue"
import { usePageData, usePageFrontmatter } from "@vuepress/client"
import type { DefaultThemePageFrontmatter } from "../../shared"
import { useThemeLocaleData } from "../composables"
import { useBlogCategory } from "vuepress-plugin-blog2/client"

const page = usePageData()
const blogCategory = useBlogCategory()
const frontmatter = usePageFrontmatter<DefaultThemePageFrontmatter>()
const themeLocale = useThemeLocaleData()
console.log(page.value, blogCategory.value)

// navbar
const shouldShowNavbar = computed(
	() => frontmatter.value.navbar !== false && themeLocale.value.navbar !== false
)
</script>

<template>
	<div class="theme-tag-view-container">
		<slot name="navbar">
			<Navbar v-if="shouldShowNavbar"> </Navbar>
		</slot>

		<slot name="page">
			<Transition name="fade-slide-y" mode="out-in">
				<Page :key="page.path" :isSubsidebar="false">
					<template #top>
						<span>{{blogCategory.map}}</span>
					</template>
					<template #content-top>
					</template>
					<template #content-bottom>
					</template>
					<template #bottom>
					</template>
				</Page>
			</Transition>
		</slot>
	</div>
</template>

<style lang="postcss">

</style>
