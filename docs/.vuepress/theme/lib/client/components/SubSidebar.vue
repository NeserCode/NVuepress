<script setup>
const tocOptions = {
	containerTag: "nav",
	containerClass: "toc-main",
	listClass: "vuepress-toc-list",
	itemClass: "vuepress-toc-item",
	linkTag: "a",
	linkClass: "vuepress-toc-link",
	linkActiveClass: "active",
	linkChildrenActiveClass: "active",
}
</script>

<template>
	<div class="neser-theme-toc sub-sidebar">
		<Transition mode="out-in">
			<Toc :options="tocOptions" />
		</Transition>
	</div>
</template>

<style lang="postcss" scoped>
.sub-sidebar {
	@apply sticky inline-flex pr-4 w-56 text-sm rounded p-2 border
	bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-700
	bg-opacity-80 dark:bg-opacity-30 backdrop-blur overflow-auto overflow-x-hidden
	transition-all;
	max-height: calc(100vh - 4rem - 12rem);
}

ul,
li {
	@apply list-none;
}
</style>

<style lang="postcss">
.vuepress-toc-link {
	@apply text-gray-600;
}

/* Indent */
.vuepress-toc-list {
	@apply inline-flex flex-col justify-center pl-4
	text-gray-700;
}
.toc-main > .vuepress-toc-list .vuepress-toc-item {
	@apply inline-flex flex-col;
}
.vuepress-toc-list .vuepress-toc-item .vuepress-toc-list .vuepress-toc-item {
	@apply pl-2;
}

/* Active */
.vuepress-toc-link.active {
	@apply text-blue-400;
}

.toc-main > .vuepress-toc-list > .vuepress-toc-item > .vuepress-toc-list {
	@apply hidden;
}

.toc-main
	> .vuepress-toc-list:has(.vuepress-toc-list .vuepress-toc-link.active),
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list:has(.vuepress-toc-link.active),
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item:has(.vuepress-toc-link.active)
	> .vuepress-toc-list {
	@apply inline-flex;
}

.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list
	> .vuepress-toc-item
	.vuepress-toc-link.active::before {
	@apply relative inline-block w-1 h-3.5 top-0.5 -left-12
	bg-green-400;
	content: " ";
	height: 2ch;
}
.toc-main
	> .vuepress-toc-list
	> .vuepress-toc-item
	> .vuepress-toc-list
	> .vuepress-toc-item
	.vuepress-toc-link.active {
}
</style>
