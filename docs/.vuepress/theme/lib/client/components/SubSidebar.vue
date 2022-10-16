<template>
	<ul v-if="sidebarItems.length" class="sub-sidebar">
		<SidebarItem
			v-for="item in sidebarItems"
			:key="`${item.text}${item.link}`"
			:item="item"
		/>
	</ul>
</template>

<script setup>
import SidebarItem from "./SidebarItem.vue"
import { onMounted, watch, computed } from "vue"
import { useRoute } from "vue-router"
import { useSidebarItems } from "../composables"

const route = useRoute()
const sidebarItems = useSidebarItems()

const computedItemCollapsedClass = computed((item) => {
	let activeSidebarItem = document.querySelector(
		`.sidebar a.sidebar-item[href="${route.path}${hash}"]`
	)
	if (activeSidebarItem.textContent.trim() === item.text)
		return "sidebar-item-collapsed"
	else if (activeSidebarItem.textContent.trim() === item.text) return null
})

onMounted(() => {
	watch(
		() => route.hash,
		(hash) => {
			// get the sidebar DOM
			const sidebar = document.querySelector(".sidebar")
			if (!sidebar) return

			// get the active sidebar item DOM, whose href equals to the current route
			const activeSidebarItem = document.querySelector(
				`.sidebar a.sidebar-item[href="${route.path}${hash}"]`
			)
			if (!activeSidebarItem) return

			// get the top and height of the sidebar
			const { top: sidebarTop, height: sidebarHeight } =
				sidebar.getBoundingClientRect()
			// get the top and height of the active sidebar item
			const { top: activeSidebarItemTop, height: activeSidebarItemHeight } =
				activeSidebarItem.getBoundingClientRect()

			// when the active sidebar item overflows the top edge of sidebar
			if (activeSidebarItemTop < sidebarTop) {
				// scroll to the top edge of sidebar
				activeSidebarItem.scrollIntoView(true)
			}
			// when the active sidebar item overflows the bottom edge of sidebar
			else if (
				activeSidebarItemTop + activeSidebarItemHeight >
				sidebarTop + sidebarHeight
			) {
				// scroll to the bottom edge of sidebar
				activeSidebarItem.scrollIntoView(false)
			}
		}
	)
})
</script>

<style lang="postcss" scoped>
.sub-sidebar {
	@apply sticky inline-flex pr-4 w-56 text-sm transition-all rounded py-2 pb-4 border
  bg-gray-100 border-gray-300 dark:bg-gray-900 dark:border-gray-700 bg-opacity-80 dark:bg-opacity-30 backdrop-blur
  overflow-auto overflow-x-hidden;
	max-height: calc(100vh - 4rem - 12rem);
}
</style>
