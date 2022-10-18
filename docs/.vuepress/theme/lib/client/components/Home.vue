<script setup>
import HomeContent from "./HomeContent.vue"
import HomeFooter from "./HomeFooter.vue"
import HomeHitokoto from "./HomeHitokoto.vue"
</script>

<template>
	<main class="home">
		<HomeHitokoto />
		<HomeContent />
		<HomeFooter />
	</main>
</template>

<style lang="postcss" scoped>
.home {
	@apply flex flex-col justify-center w-full mx-auto;
}
</style>
