<script setup lang="ts">
import Home from "@theme/Home.vue"
import Navbar from "@theme/Navbar.vue"
import Page from "@theme/Page.vue"
import Sidebar from "@theme/Sidebar.vue"
import About from "../components/About.vue"

import { usePageData, usePageFrontmatter } from "@vuepress/client"
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"
import type { DefaultThemePageFrontmatter } from "../../shared"
import {
	useScrollPromise,
	useSidebarItems,
	useThemeLocaleData,
} from "../composables"

const page = usePageData()
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
		class="theme-container"
		:class="containerClass"
		@touchstart="onTouchStart"
		@touchend="onTouchEnd"
	>
		<slot name="navbar">
			<Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar">
				<template #before>
					<slot name="navbar-before" />
				</template>
				<template #after>
					<slot name="navbar-after" />
				</template>
			</Navbar>
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

		<slot name="page">
			<Home v-if="frontmatter.home" />

			<Transition
				v-else
				name="fade-slide-y"
				mode="out-in"
				@before-enter="onBeforeEnter"
				@before-leave="onBeforeLeave"
			>
				<About v-if="frontmatter.about" />

				<Page :key="page.path" v-else>
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

<style lang="postcss">
html {
	@apply scroll-smooth;
}

.back-to-top,
.down-to-comment {
	@apply inline-flex justify-center items-center w-8 h-8 bg-transparent
	bottom-24 transition-all;
}

.back-to-top::before,
.down-to-comment::before {
	@apply absolute inline-block w-9 h-9 -top-0.5 -left-0.5 rounded border
	bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500
	backdrop-blur bg-opacity-60 dark:bg-opacity-60;
	content: " ";
}
.back-to-top::after,
.down-to-comment::after {
	@apply absolute inline-flex flex-col items-center justify-end w-8 h-8 pb-0.5
	text-xs font-semibold;
	content: "Top";
}

.back-to-top__inner,
.down-to-comment__inner {
	@apply absolute -top-px w-8 h-8
	bg-slate-500 dark:bg-slate-200;
	mask-size: 40% 50%;
	mask-position: 50% 10%;
}

.down-to-comment {
	@apply bottom-12;
}

.down-to-comment::after {
	content: "评论";
}

.down-to-comment__inner {
	@apply transform rotate-180;
	mask-size: 40% 50%;
	mask-position: 50% 85%;
}
.down-to-comment__link {
	@apply absolute inline-block top-0 w-8 h-8 z-10;
}
</style>
