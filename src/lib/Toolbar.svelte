<script>
	import { toggleMarkerVisibility, cycleMapStyle, switchLanguage } from '$lib/stores';


	let eye = true;
	function clickEye() {
		eye = !eye;
		toggleMarkerVisibility(eye);
	}

	function triggerCycleMapStyle() {
		cycleMapStyle();
		console.log('triggerCycleMapStyle');
	}

	function toggleLanguage() {
		switchLanguage();
	}
</script>

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
	<svg style='margin-left:5px' fill="#000000" stroke="#000000" stroke-width="10" height="24px" width="24px" viewBox="0 0 421.59 421.59" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<g transform="translate(0,0)">
			<path d="M400.491,291.098l-58.865-36.976l58.864-36.971c2.185-1.372,3.511-3.771,3.511-6.351s-1.326-4.979-3.511-6.352
				l-58.865-36.977l58.862-36.973c2.185-1.373,3.511-3.771,3.511-6.351s-1.326-4.979-3.511-6.351L214.783,1.149
				c-2.438-1.532-5.54-1.532-7.979,0L21.1,117.796c-2.185,1.373-3.511,3.771-3.511,6.351c0,2.58,1.326,4.979,3.511,6.351
				l58.861,36.972l-58.859,36.978c-2.185,1.373-3.51,3.771-3.51,6.351c0,2.58,1.326,4.979,3.511,6.351l58.859,36.97l-58.859,36.979
				c-2.185,1.372-3.51,3.771-3.51,6.351c0,2.58,1.326,4.979,3.511,6.351l185.7,116.64c1.22,0.766,2.604,1.149,3.989,1.149
				s2.77-0.383,3.989-1.149L400.491,303.8c2.185-1.372,3.511-3.771,3.511-6.351C404.002,294.869,402.676,292.47,400.491,291.098z"/>
		</g>
	</svg>
  </button>

  <button class='selected' on:click={toggleLanguage} title="Cycle Map Style">
Bonjour
	</button>

<style>
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
	}
	
	button:hover {
		opacity: 100%;
		background-color: lightgray;
	}
</style>