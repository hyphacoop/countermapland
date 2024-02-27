
<script>
    import { fly } from "svelte/transition";
    import { writable } from 'svelte/store';

    import countermonumentIcon from "$lib/icons/countermonument.svg";

    let sections = [ 'Menu', 'About', 'Projects', 'Research', 'Credits', 'Contact' ];

    import About from '$lib/Pages/About.svelte';
    import Contact from '$lib/Pages/Contact.svelte';
    import Projects from '$lib/Pages/Projects.svelte';

    import closeImage from "$lib/icons/close.png";

    // Reactive variable to track current section
    let currentSection = writable('Menu');

    // Function to update current section
    function setCurrentSection(section) {
        currentSection.set(section);
    }
</script>
{#if $currentSection !== 'Menu'}
  <button class="close-button" on:click={() => currentSection.set('Menu')} >
    <img src={closeImage} alt="Open Sidebar"/>
  </button>
{/if}
<div
class="menu-sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
>
<div>
    {#if $currentSection === 'About'}
    <h2>About</h2>
    <About />
  {:else if $currentSection === 'Projects'}
    <h2>Projects</h2>
    <Projects />
  {:else if $currentSection === 'Contact'}
    <h2>Contact</h2>
    <Contact />
  {:else if $currentSection === 'Menu'}
  <ul>
    {#each sections.filter(section => section !== 'Menu')  as section}
    <li>
        <button on:click={() => setCurrentSection(section)}>{section}</button>
    </li>
    {/each}
       
  </ul>
  <div>
    *countermap is based in Tkaronto on the traditional lands... 
    </div>
  {:else}
   <p> no content for this section yet.</p>
  {/if}
</div>



</div>

<style>
    .menu-sidebar {
        background-color: #BDE3FF;
        width: 450px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    z-index: 9998;
    padding: 0 1.88rem;
    padding-top: 1.69rem;
    }
    .close-button {
    position: absolute;
    top: 1.19rem;
    right: 1.19rem;
    z-index: 9999;
  }

  li button {
    color: #000;
font-family: Itim;
font-size: 2.0625rem;
font-style: normal;
font-weight: 400;
line-height: normal; 
margin-bottom: 2.75rem;
  }
  h2 {
    margin-bottom: 2rem;
  }
</style>