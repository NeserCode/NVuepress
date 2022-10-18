<script setup>
import { acticles as rawActicles } from "../../../../.temp/articles"
import { onMounted, computed } from "vue"
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	TransitionRoot,
} from "@headlessui/vue"
import { ChevronUpIcon } from "@heroicons/vue/20/solid"

function useActicles(items = []) {
	// 过滤首页
	items = items.filter(
		(item) => !item.frontmatter.home && !item.frontmatter.about
	)
	// 过滤无题页面
	return items.filter((item) => item.title !== "")
}

const acticles = useActicles(rawActicles)

onMounted(() => {
	console.log(acticles)
})

function getComputedExcerpt(item) {
	let stringfiedExcerpt = item.excerpt.replace(/<[^>]*>/g, "").replace("# ", "")

	// 删去标题
	if (stringfiedExcerpt.indexOf(item.title) === 0)
		stringfiedExcerpt = stringfiedExcerpt.replace(`${item.title}\n`, "")

	// 删去末尾字符
	if (stringfiedExcerpt.indexOf(item.title) !== 0)
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

function getComputedRouterLinktoTags(tag) {
	return `/tag/${tag}`
}
</script>

<template>
	<div class="neser-theme-article-list">
		<Disclosure
			as="div"
			v-slot="{ open }"
			class="neser-theme-article-body"
			v-for="(item, index) in acticles"
			:key="item.key"
		>
			<DisclosureButton class="DBtn">
				<router-link :to="item.path" class="title-wrapper" title="阅读文章"
					><span class="innerTitle">{{ item.title }}</span>
				</router-link>
				<ChevronUpIcon :class="open ? 'open' : ''" class="icon-up" />
			</DisclosureButton>
			<Transition name="fade-slide-y" mode="out-in">
				<DisclosurePanel class="DPanel">
					<span class="submitDate" v-if="item.date">{{ item.date }}</span>
					<span class="innerExcerpt">{{ getComputedExcerpt(item) }}</span>
					<div class="tags" v-if="item.frontmatter.tag">
						<span
							class="tag"
							v-for="tag in item.frontmatter.tag"
							:title="tag"
							:key="tag"
						>
							<router-link
								:to="getComputedRouterLinktoTags(tag)"
								class="title-wrapper"
								:title="tag"
								><span class="innerTitle">{{ tag }}</span>
							</router-link>
						</span>
					</div>
				</DisclosurePanel>
			</Transition>
		</Disclosure>
	</div>
</template>

<style lang="postcss" scoped>
.neser-theme-article-list {
	@apply inline-flex  flex-col justify-center w-full px-2 pb-2 mx-auto rounded-2xl
  bg-gray-100 dark:bg-gray-900;
}

.DBtn {
	@apply flex w-full justify-between rounded-lg p-2 mt-2
  text-base font-medium text-purple-900 hover:bg-gray-50
  border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-700
  outline-none;
}

.icon-up {
	@apply h-5 w-5 text-blue-300
  transition-all;
}
.icon-up.open {
	@apply rotate-180 transform;
}

.DPanel {
	@apply px-4 py-2
  text-sm text-gray-500
  transition-all;
}

.submitDate {
	@apply block font-semibold;
}
.innerExcerpt {
	@apply text-gray-400;
}

.tags {
	@apply inline-flex flex-wrap justify-end w-full py-1 my-1;
}
.tags .tag {
	@apply inline-block mx-0.5 pr-1 rounded-l inset-1
  border border-gray-200 bg-white dark:bg-slate-800 dark:border-gray-600
  text-ellipsis overflow-hidden whitespace-nowrap;
	max-width: 15ch;
}
.tags .tag::before {
	@apply inline-block font-black mx-1;
	content: "·";
}
</style>
