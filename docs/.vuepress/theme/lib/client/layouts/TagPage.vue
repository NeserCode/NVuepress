<script setup lang="ts">
import Navbar from "@theme/Navbar.vue"
import Page from "@theme/Page.vue"

import { computed } from "vue"
import { usePageData, usePageFrontmatter } from "@vuepress/client"
import { useThemeLocaleData } from "../composables"

const page = usePageData()
const themeLocale = useThemeLocaleData()
console.log("page", page.value)

// navbar
const shouldShowNavbar = computed(
	() => frontmatter.value.navbar !== false && themeLocale.value.navbar !== false
)
</script>

<template>
	<div class="theme-tag-view-container">
		<slot name="navbar">
			<Navbar v-if="shouldShowNavbar">
				<template #before>
					<slot name="navbar-before" />
				</template>
				<template #after>
					<slot name="navbar-after" />
				</template>
			</Navbar>
		</slot>

		<slot name="page">
			<Transition name="fade-slide-y" mode="out-in">
				<Page :key="page.path">
					<template #top>
						<slot name="page-top" />
					</template>
					<template #content-top>
						<slot name="page-content-top" />
					</template>
					<template #content-bottom>
						<slot name="page-content-bottom" />
					</template>
					<template #bottom>
						<slot name="page-bottom" />
					</template>
				</Page>
			</Transition>
		</slot>
	</div>
</template>

<style lang="postcss"></style>
