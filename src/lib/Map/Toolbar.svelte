<script>
	import { toggleMarkerVisibility, cycleMapStyle, toggleDarkMode, territoriesVisible  } from '$lib/stores';


	let eye = true;
	function clickEye() {
		eye = !eye;
		toggleMarkerVisibility(eye);
	}

	function triggerCycleMapStyle() {
		cycleMapStyle();
		console.log('triggerCycleMapStyle');
	}

	function toggleMarkerColor() {
		toggleDarkMode();
	}
	function toggleTerritoriesLayer() {
		territoriesVisible.update(n => !n);
	}
</script>
<div class='flex flex-col'>
	<button on:click={toggleTerritoriesLayer}>territories</button>
	<button type="button" on:click={clickEye} class:selected={eye} title="Show Markers">
		<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="{eye ? 2 : 1}" viewBox="0 0 24 24" stroke="currentColor">
		{#if eye}
			<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
		{:else}
			<path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
		{/if}
		</svg>
	</button>

	<button class='selected' on:click={triggerCycleMapStyle} title="Cycle Map Style">
		<svg class='svgSize' width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0.800017 9.54074L15.8136 16.3514C16.2519 16.5506 16.7475 16.5506 17.1858 16.3514L32.1993 9.54074C33.266 9.0567 33.266 7.44474 32.1993 6.96071L17.1864 0.149366C16.9711 0.0509415 16.7371 0 16.5003 0C16.2636 0 16.0296 0.0509415 15.8142 0.149366L0.800017 6.96006C-0.266672 7.4441 -0.266672 9.0567 0.800017 9.54074ZM32.2 15.2306L28.4559 13.5336L18.0378 18.256C17.5506 18.4771 17.033 18.5892 16.5 18.5892C15.967 18.5892 15.4501 18.4771 14.9622 18.256L4.54471 13.5336L0.800017 15.2306C-0.266672 15.714 -0.266672 17.3253 0.800017 17.8087L15.8136 24.6142C16.2519 24.8128 16.7475 24.8128 17.1858 24.6142L32.2 17.8087C33.2667 17.3253 33.2667 15.714 32.2 15.2306ZM32.2 23.4676L28.4701 21.777L18.0378 26.5059C17.5506 26.727 17.033 26.8391 16.5 26.8391C15.967 26.8391 15.4501 26.727 14.9622 26.5059L4.53053 21.777L0.800017 23.4676C-0.266672 23.951 -0.266672 25.5623 0.800017 26.0457L15.8136 32.8513C16.2519 33.0498 16.7475 33.0498 17.1858 32.8513L32.2 26.0457C33.2667 25.5623 33.2667 23.951 32.2 23.4676Z" fill="black"/>
		  </svg>
	</button>

	<button class='selected' on:click={toggleMarkerColor}>
		<svg class='svgSize' width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
			<mask id="mask0_14_196" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="54" height="54">
			<rect width="54" height="54" fill="#D9D9D9"/>
			</mask>
			<g mask="url(#mask0_14_196)">
			<path d="M24.75 47.25V32.4L14.2875 42.9188L11.0813 39.7125L21.6 29.25H6.75V24.75H21.6L11.0813 14.2875L14.2875 11.0813L24.75 21.6V6.75H29.25V21.6L39.7125 11.0813L42.9188 14.2875L32.4 24.75H47.25V29.25H32.4L42.9188 39.7125L39.7125 42.9188L29.25 32.4V47.25H24.75Z" fill="white"/>
			</g>
			</svg> 
	</button>

</div>

<style>

	.svgSize {
		margin-left:2px;
		width: 28px;
	}

	div {
		position: absolute;
		z-index: 9999;
		right: 0;
	}
	.selected {
		opacity: 50%;
		background-color: #DCC;
	}
	
	button {
		width: 2rem;
		height: 2rem;
		border: 0;
		background-color: transparent;
		transition-property: background-color, background-opacity; 
		transition-duration: 250ms;
		border-radius: 0.375rem;
		margin-right:5px;
		margin-bottom: 5px;
	}
	
	button:hover {
		opacity: 100%;
		background-color: lightgray;
	}
</style>