<script setup lang="ts">
import Navbar from "@theme/Navbar.vue"
import Page from "@theme/Page.vue"
import Sidebar from "@theme/Sidebar.vue"

import ArticleList from "../components/ArticleList.vue"

import { computed, onMounted, onUnmounted, ref } from "vue"
import { usePageData, usePageFrontmatter } from "@vuepress/client"
import type { DefaultThemePageFrontmatter } from "../../shared"
import {
	useScrollPromise,
	useSidebarItems,
	useThemeLocaleData,
} from "../composables"
import { useBlogCategory } from "vuepress-plugin-blog2/client"
import { useRouter } from "vue-router"

const page = usePageData()
const blogCategory = useBlogCategory()
const frontmatter = usePageFrontmatter<DefaultThemePageFrontmatter>()
const themeLocale = useThemeLocaleData()

// navbar
const shouldShowNavbar = computed(
	() => frontmatter.value.navbar !== false && themeLocale.value.navbar !== false
)
// sidebar
const sidebarItems = useSidebarItems()
const isSidebarOpen = ref(false)
const toggleSidebar = (to?: boolean): void => {
	isSidebarOpen.value = typeof to === "boolean" ? to : !isSidebarOpen.value
}
const touchStart = { x: 0, y: 0 }
const onTouchStart = (e): void => {
	touchStart.x = e.changedTouches[0].clientX
	touchStart.y = e.changedTouches[0].clientY
}
const onTouchEnd = (e): void => {
	const dx = e.changedTouches[0].clientX - touchStart.x
	const dy = e.changedTouches[0].clientY - touchStart.y
	if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
		if (dx > 0 && touchStart.x <= 80) {
			toggleSidebar(true)
		} else {
			toggleSidebar(false)
		}
	}
}

// classes
const containerClass = computed(() => [
	{
		"no-navbar": !shouldShowNavbar.value,
		"no-sidebar":
			page.value.themeDataPlugin.subSidebar ?? !sidebarItems.value.length,
		"sidebar-open": isSidebarOpen.value,
	},
	frontmatter.value.pageClass,
])

// close sidebar after navigation
let unregisterRouterHook
onMounted(() => {
	const router = useRouter()
	unregisterRouterHook = router.afterEach(() => {
		toggleSidebar(false)
	})
})
onUnmounted(() => {
	unregisterRouterHook()
})

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending
</script>

<template>
	<div
		class="theme-tag-view-container theme-container"
		:class="containerClass"
		@touchstart="onTouchStart"
		@touchend="onTouchEnd"
	>
		<slot name="navbar">
			<Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />
		</slot>

		<div class="sidebar-mask" @click="toggleSidebar(false)" />

		<slot name="sidebar">
			<Sidebar class="lg:inline-block xl:hidden">
				<template #top>
					<slot name="sidebar-top" />
				</template>
				<template #bottom>
					<slot name="sidebar-bottom" />
				</template>
			</Sidebar>
		</slot>

		<Transition
			name="fade-slide-y"
			mode="out-in"
			@before-enter="onBeforeEnter"
			@before-leave="onBeforeLeave"
		>
			<slot name="page">
				<Page :key="page.path" :isSubsidebar="false" :isComment="false">
					<template #content-top>
						<div
							class="neser-theme-tags-list"
							v-if="Object.keys(blogCategory.map).length"
						>
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
						<div class="neser-theme-tags-list" v-else>
							<span class="no-tags">没有更多的标签</span>
						</div>
						<Transition name="fade-slide-y" mode="out-in" appear>
							<ArticleList :items="blogCategory.currentItems" />
						</Transition>
					</template>
				</Page>
			</slot>
		</Transition>
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

.no-tags {
	@apply inline-flex justify-center w-full font-extrabold text-lg mt-12;
}
</style>
