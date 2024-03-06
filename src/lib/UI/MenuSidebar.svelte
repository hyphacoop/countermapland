<script>
  import { fly } from "svelte/transition";
  import { currentMenuSection } from "$lib/stores";

  let sections = [
    "Menu",
    "About",
    "Projects",
    "Contact",
    "Community Agreements",
  ];

  import About from "$lib/Pages/About.svelte";
  import Contact from "$lib/Pages/Contact.svelte";
  import Projects from "$lib/Pages/Projects.svelte";
  import CommunityAgreements from "$lib/Pages/CommunityAgreements.svelte";

  import countermonumentIcon from "$lib/icons/countermonument.svg";
  import closeImage from "$lib/icons/close.svg";
  import { currentSidebar } from "$lib/stores";

  // Function to update current section
  function setcurrentMenuSection(section) {
    currentSidebar.set("menu");
    currentMenuSection.set(section);
  }
</script>

<div
  class="sidebar"
  in:fly={{ x: 300, duration: 800 }}
  out:fly={{ x: 300, duration: 800 }}
>
  {#if $currentMenuSection !== "Menu"}
    <button
      class="close-button"
      on:click={(event) => {
        event.stopPropagation();
        currentMenuSection.set("Menu");
      }}
    >
      <img src={closeImage} alt="Open Sidebar" />
    </button>
  {:else}
    <button
      class="close-button"
      on:click={(event) => {
        event.stopPropagation();
        currentSidebar.set(null);
      }}
    >
      <img src={closeImage} alt="Close Sidebar" />
    </button>
  {/if}
  <div>
    {#if $currentMenuSection === "About"}
      <h2>About</h2>
      <About />
    {:else if $currentMenuSection === "Projects"}
      <h2>Projects</h2>
      <Projects />
    {:else if $currentMenuSection === "Contact"}
      <h2>Contact</h2>
      <Contact />
    {:else if $currentMenuSection === "Community Agreements"}
      <h2>Community Agreements</h2>
      <CommunityAgreements />
    {:else if $currentMenuSection === "Menu"}
      <ul>
        {#each sections.filter((section) => section !== "Menu") as section}
          <li>
            <button
              on:click={(event) => {
                event.stopPropagation();
                setcurrentMenuSection(section);
              }}
            >
              {section}
              <img
                class="menu-icon"
                src={countermonumentIcon}
                alt="Hover Icon"
              />
            </button>
          </li>
        {/each}
      </ul>
      <div>*countermap was initiated on territory occupied by many nations including the Mississaugas of the Credit, the Anishnabeg, the Chippewa, the Haudenosaunee and the Wendat peoples for thousands of years. Today T’karonto is home to many diverse Indigenous people from across Turtle Island. </div>
    {:else}
      <p>no content for this section yet.</p>
    {/if}
  </div>
</div>

<style>
  .sidebar {
    background-color: #bde3ff;
    width: 450px;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    z-index: 9999;
    padding: 0 1.88rem;
    padding-top: 1.69rem;
  }

  li button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-family: Itim;
    font-size: 2.0625rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 2.75rem;
  }
  .menu-icon {
    width: 24px;
    margin-left: 10px; /* Space between icon and text */
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  li button:hover .menu-icon {
    opacity: 1;
  }
  h2 {
    margin-bottom: 2rem;
  }
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      padding: 0 0.88rem;
      padding-top: 2rem;
    }
    li button {
      font-size: 1.75rem;
    }
  }
</style>
