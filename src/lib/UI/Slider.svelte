<script>
    import { onMount, onDestroy } from 'svelte';
    import sliderSVG from '$lib/icons/slider.svg';
    import circleSVG from '$lib/icons/circle.svg';
  
    let currentYear = new Date().getFullYear();
    let selectedYear = 1850; // Default year
    let sliderWidth;
    const minYear = 1790;
    const maxYear = currentYear;
    let circlePosition = 0;
    let isDragging = false;
  
    function updatePosition() {
      const yearRange = maxYear - minYear;
      const positionPerYear = sliderWidth / yearRange;
      circlePosition = (selectedYear - minYear) * positionPerYear;
      // Adjust circlePosition to center the circle on the line
      circlePosition -= 5; // Assuming circle's diameter is 10px
    }
  
    function handleResize() {
      const sliderElement = document.querySelector('.slider-container');
      sliderWidth = sliderElement.offsetWidth; // Get the dynamic width
      updatePosition();
    }
  
    onMount(() => {
      handleResize(); // Initial setup
      window.addEventListener('resize', handleResize); // Adjust on window resize
    });
  
    onDestroy(() => {
      window.removeEventListener('resize', handleResize); // Cleanup
    });
  
   // Drag start event handling
   function startDrag(event) {
    isDragging = true;
    updateDrag(event);
  }

  // Drag event handling
  function updateDrag(event) {
    if (!isDragging) return;
    const slider = document.querySelector('.slider');
    const rect = slider.getBoundingClientRect();
    const x = event.clientX - rect.left; //x position within the element.
    selectedYear = Math.round(x / sliderWidth * (maxYear - minYear) + minYear);
    selectedYear = Math.max(minYear, Math.min(maxYear, selectedYear)); // Clamp within range
    updatePosition();
  }

  // Stop dragging
  function stopDrag() {
    isDragging = false;
  }

  onMount(() => {
    sliderWidth = 432; // The SVG width. Update this if your SVG size changes.
    updatePosition();
  });
  </script>
  
  <div class="slider-container" on:mousedown={startDrag} on:mousemove={updateDrag} on:mouseup={stopDrag}>
    <img src={sliderSVG} alt="Slider" style="width: 100%; height: auto;" />
    <div style="position: absolute; left: {circlePosition}px; top: 50%; transform: translateY(-50%);">
      <img src={circleSVG} alt="Circle" style="cursor: grab;" draggable="false" />
    </div>
    <!-- Display Selected Year -->
    <div style="position: absolute; left: {circlePosition}px; transform: translate(-50%, -100%); color: black;">
      {selectedYear}
    </div>
  </div>
  
  <style>
    .slider-container {
      position: relative;
      user-select: none;
    }
  </style>
  