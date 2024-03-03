<script>
  import "../app.css";
  import { base } from "$app/paths";

  import IconMosaic from "$lib/UI/IconMosaic.svelte";

  import Satellite from "$lib/icons/peephole/satellite-view.png";
  import Object from "$lib/icons/peephole/object-view.png";

  import { onMount, onDestroy } from "svelte";

  // Function to hide overflow to the body
  function addBodyClass(className) {
    document.body.classList.add(className);
  }

  // Function to remove the specific class from the body
  function removeBodyClass(className) {
    document.body.classList.remove(className);
  }

  // Use onMount to add the class when the component mounts
  onMount(() => {
    addBodyClass("overflow-hidden");

    // Use onDestroy to clean up when the component is destroyed
    return () => {
      removeBodyClass("overflow-hidden");
    };
  });
</script>

<main class="welcome">
  <IconMosaic />
  <h1>*countermap</h1>
  <div class="flex flex-col justify-center align-center">
    <p class='text-center'>Learn and tell the stories of this place.</p>
    <ul>
      <li>
        <a href="{base}/map">
          <img src={Satellite} alt="Satellite View" />
        </a>
      </li>
      <li>
        <a href="{base}/objects">
          <img src={Object} alt="Object View" class='setborder'/>
        </a>
      </li>
    </ul>
  </div>
</main>

<style>
  main.welcome {
    background-color: #000;
    color: #fff;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  ul {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    list-style-type: none;
    padding: 0;
    z-index: 9999;
  }
  li {
    font-size: 2rem;
  }
  .setborder {
    border-radius: 50%;
    padding: 0.3rem;
    background-color:#fff;
  }
  img {
    transition: all 0.3s ease;
  }
  img:hover {
    transform: scale(1.1);
  }
</style>
