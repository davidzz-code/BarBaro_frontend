<template>
	<div class="mustache-container">
		<img
			id="mustache"
			src="/src/assets/img/mustache.svg"
			alt="Mustache"
		/>
	</div>
</template>

<style scoped>
@keyframes flip {
	0% {
		transform: scaleX(1);
	}
	50% {
		transform: scaleX(-1);
	}
	100% {
		transform: scaleX(1);
	}
}

#mustache {
	animation: flip 1.5s infinite;
	transform-origin: center;
}

.mustache-container {
	width: 70px;
	height: 70px;
}
</style>
