<script>
    import { onMount, onDestroy } from 'svelte';

    import { filtersActive } from '$lib/stores';

    export let options = []; 
    export let selected; 
    let searchTerm = '';
    let showDropdown = false;
  
    function selectOption(event, option) {
      event.stopPropagation();
      selected = option;
      showDropdown = false;
      filtersActive.set(true);
    }

    function toggleDropdown() {
    if (options.length > 0) { // Only toggle showDropdown if there are options
      showDropdown = !showDropdown;
    }
  }

    $: filteredOptions = searchTerm
    ? options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

    onMount(() => {
    // Function to check if the click is outside the component
    const handleClickOutside = event => {
      if (!event.target.closest('.custom-select') && showDropdown) {
        showDropdown = false;
      }
    };
    
    // Add click event listener to the document
    document.addEventListener('click', handleClickOutside);

    // Return a cleanup function to remove the event listener
    // when the component is destroyed
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  </script>
  
  <div class="custom-select {options.length ? 'cursor-pointer' : 'cursor-not-allowed'}" on:click={toggleDropdown}
    style="background-color: {options.length ? '#FED5BE' : 'transparent'}; width: {options.length ? 'auto' : '60%'};">
    <input
    class="select-selected truncate ..."
    type="text"
    placeholder="Search"
    bind:value={selected}
    on:input="{(e) => (searchTerm = e.target.value)}"
    on:click|stopPropagation="{() => (showDropdown = true)}"
    style="background-color: {options.length ? '#FED5BE' : 'transparent'}"
  />
    {#if showDropdown}
      <div class="select-items {!showDropdown ? 'select-hide' : ''}">
        {#each filteredOptions as option}
          <div on:click|stopPropagation={() => selectOption(event, option)}>{option}</div>
        {/each}
      </div>
    {/if}
  </div>
  <p>{filteredOptions.length} options</p>
  <style>
    * {
        font-size: 0.6875rem; 
    }
    .custom-select {
      position: relative;
      background-color: #FED5BE;
      border-radius: 0.25rem; 
      border: 1px solid #000;
      width: fit-content;
    }
  
    .select-selected {
        background-color: #FED5BE;
      padding: 0.125rem 0.625rem; 
      display: flex;
      justify-content: space-between;
      align-items: center;
      color:#000;
      border-radius: 0.25rem;
      width: 100%;
    }

    .select-selected:focus {
        outline: none;
    }

    .select-selected::placeholder {
  color: #000;
}
  
    .select-selected:after {
  content: "";
  display: block;
  width: 18px;
  height: 18px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOC44MTAzNCAxMS41NUw0IDcuMDVMNS4xMjI0MSA2TDguODEwMzQgOS40NUwxMi40OTgzIDZMMTMuNjIwNyA3LjA1TDguODEwMzQgMTEuNTVaIiBmaWxsPSIjMUMxQjFGIi8+PC9zdmc+');
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

  
    .select-items {
      margin-top: 0.125rem;
      position: absolute;
      background-color: #FED5BE;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 99;
      max-height: 200px; 
    overflow-y: auto;
        border: 1px solid #000;
        border-radius: 0.25rem;
    }
  
    .select-items div {
        padding: 0.125rem 0.625rem; 
      border: 1px solid #000;
      width: fit-content;
      margin: 0.25rem 0.25rem;
      border-radius:  0.25rem;

    }
  
    .select-items div:last-child {
      border-bottom: none;
    }
  
    .select-items div:hover {
      background-color: rgba(0, 0, 0, 0.1); 
    }
    .select-hide {
      display: none;
    }
    .option-count {
    font-size: 0.5rem;
    }
    p {
        margin-top: 0.25rem;
        width: fit-content;
    }
</style>
  